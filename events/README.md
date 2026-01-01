# Events App

## Purpose

The `events` app is the functional core of the FutureReminder service. It is responsible for managing user-created events and, most importantly, orchestrating the entire notification scheduling and management lifecycle based on a user's selected service tier. This app absorbed the responsibilities of the formerly separate `notifications` app.

## Core Models

### `Event`
This is the central model representing an item a user wants to be reminded of.

**Key Fields & Behavior:**
*   **Core Details:** `name`, `event_date`, `notes`.
*   **Ownership:** A foreign key to the `User` who owns the event.
*   **Tier:** A foreign key to a `payments.Tier` model. The selected tier is critical as it dictates the notification schedule.
*   **Status:** `is_active` is a boolean flag that enables the notification process. It is typically set to `True` after a successful payment for a paid tier or upon activation for a free tier.
*   **Scheduling Trigger:** The `save()` method of this model is overridden. When an event is saved, it automatically triggers the `schedule_notifications_for_event` utility, which regenerates the entire notification schedule for that event.

### `Notification`
This model represents a single, scheduled communication to be sent for a specific event. An `Event` will have multiple `Notification` objects associated with it.

**Key Fields:**
*   **Links:** Foreign keys to both `Event` and `User`.
*   **Scheduling:** `scheduled_send_time` stores the exact time the notification is due.
*   **Channel:** A choice field indicating the delivery method (e.g., `primary_email`, `primary_sms`, `emergency_contact_email`).
*   **Status:** Tracks the full lifecycle of the notification (`pending`, `in_progress`, `sent`, `delivered`, `failed`).
*   **Provider SID:** `message_sid` stores the unique ID from the provider (e.g., Twilio, Mailgun) after a message is successfully sent. This is our tracking number.
*   **Failure Logging:** `failure_reason` stores the error message if a notification fails at any stage, providing crucial data for debugging.
*   **PII Cache:** `recipient_contact_info` stores a copy of the contact detail used at the moment of sending.

## Key Flows & Business Logic

### Notification Scheduling: The "Manifest and Interval" Approach
The core logic for scheduling is located in the `events/utils/schedule_notifications_for_event.py` utility. This provides a flexible and tier-based scheduling system.

1.  **Trigger:** The process is initiated whenever an `Event` is saved (e.g., upon creation, update, or activation).
2.  **Cleanup:** The utility first deletes all existing `pending` notifications for the event to ensure a clean slate.
3.  **Manifest Lookup:** It retrieves the notification schedule (the "manifest") directly from the `manifest` field of the event's associated `Tier` object (`event.tier.manifest`). A manifest is an ordered list of notification channel strings (e.g., `['primary_email', 'primary_sms', 'emergency_contact_email']`). The order defines the escalation path. This approach allows schedules to be managed dynamically in the database.
4.  **Interval Calculation:** The system calculates an even time interval by dividing the total duration (from `notification_start_date` to `event_date`) by the number of notifications in the manifest.
5.  **Creation:** It then iterates through the manifest, creating a `Notification` object for each channel, with the `scheduled_send_time` staggered by the calculated interval. All new notifications have a status of `pending`.

### Notification Sending: A Closed-Loop System
The actual sending of notifications is a robust, closed-loop process designed for reliability and tracking. It is handled by the `send_notifications` management command, which is intended to be run on a recurring schedule (e.g., daily).

1.  **Query & Lock:** The command queries the database for `pending` notifications that are past their `scheduled_send_time`. To prevent race conditions, it immediately locks this batch of notifications by updating their status to `in_progress`.
2.  **Dispatch via `Notification.send()`:** The command iterates through the claimed notifications and calls the `.send()` method on each one. This method acts as a dispatcher:
    *   It reads the notification's own `channel`.
    *   It calls the appropriate utility function (`send_reminder_email` for Mailgun, `send_reminder_sms` for Twilio).
    *   The `send` method is wrapped in a `try...except` block. If the API call fails at this stage, the exception is caught, the `status` is set to `failed`, and the error is logged in the `failure_reason` field.
3.  **API Call & Callback:** The sending utility (e.g., `send_reminder_sms`) makes the API call to the external provider. It includes a `StatusCallback` URL pointing back to our application's webhook endpoint. If the call is successful, the provider returns a unique `message_sid`, which is saved on the `Notification` object, and the status is updated to `sent`.
4.  **Webhook Feedback Loop:** When the final delivery status is known, the provider makes a POST request to our callback URL (`/api/events/webhooks/twilio/status/`).
    *   A dedicated webhook view receives this request.
    *   It uses the `message_sid` from the request data to find the corresponding `Notification`.
    *   It updates the notification's `status` to its final state, either `delivered` or `failed`. If it failed, the `failure_reason` is updated with the error code from the provider.

## API Endpoints

The primary API for this app is exposed via a DRF `ModelViewSet` under the `/api/events/` prefix. It provides standard RESTful endpoints for authenticated users.

*   `/api/events/`:
    *   `GET`: List all events for the current user.
    *   `POST`: Create a new event for the current user.
*   `/api/events/<id>/`:
    *   `GET`: Retrieve a specific event.
    *   `PUT`/`PATCH`: Update a specific event.
    *   `DELETE`: Delete a specific event.
*   `/api/events/<id>/activate/`:
    *   `POST`: A custom action to activate an event. This is intended for free-tier events that do not require a payment flow.
