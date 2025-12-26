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
*   **Channel:** A choice field indicating the delivery method (e.g., `primary_email`, `primary_sms`, `admin_call`).
*   **Status:** Tracks the state of the notification (`pending`, `sent`, `failed`, etc.).
*   **PII Cache:** `recipient_contact_info` stores a copy of the contact detail (e.g., the actual email address) used at the moment of sending. This field is hashed during the user anonymization process.

## Key Flows & Business Logic

### Notification Scheduling: The "Manifest and Interval" Approach
The core logic for scheduling is located in the `events/utils/schedule_notifications_for_event.py` utility. This provides a flexible and tier-based scheduling system.

1.  **Trigger:** The process is initiated whenever an `Event` is saved (e.g., upon creation or update).
2.  **Cleanup:** The utility first deletes all existing `pending` notifications for the event to ensure a clean slate.
3.  **Manifest Lookup:** It uses the event's `tier.name` to look up a corresponding "manifest" in the `TIER_MANIFESTS` dictionary. A manifest is an ordered list of notification channel strings (e.g., `['primary_email', 'secondary_email', 'primary_sms']`). The order defines the escalation path.
4.  **Interval Calculation:** The system calculates an even time interval by dividing the total duration (from `notification_start_date` to `event_date`) by the number of notifications in the manifest.
5.  **Creation:** It then iterates through the manifest, creating a `Notification` object for each channel, with the `scheduled_send_time` staggered by the calculated interval.

### Notification Sending
The actual sending of notifications is handled by a management command (`data_management/management/commands/process_notifications.py`). This command runs periodically, queries for `pending` notifications that are past their `scheduled_send_time`, and dispatches them through the appropriate channel.

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
