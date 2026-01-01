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
*   **Status:** Tracks the full lifecycle of the notification (`pending`, `sent`, `delivered`, `failed`). The `in_progress` status has been removed as the new process is atomic.
*   **Provider SID:** `message_sid` stores the unique ID from the provider (e.g., Twilio, Mailgun) after a message is successfully sent. This is our tracking number.
*   **Failure Logging:** `failure_reason` stores the error message if a notification fails at any stage, providing crucial data for debugging.
*   **PII Cache:** `recipient_contact_info` stores a copy of the contact detail used at the moment of sending.

## Key Flows & Business Logic

### Notification Scheduling: The "Manifest and Interval" Approach
The core logic for scheduling is located in the `events/utils/schedule_notifications_for_event.py` utility. This provides a flexible and tier-based scheduling system.

1.  **Trigger:** The process is initiated whenever an `Event` is saved (e.g., upon creation, update, or activation).
2.  **Cleanup:** The utility first deletes all existing `pending` notifications for the event to ensure a clean slate.
3.  **Manifest Lookup:** It retrieves the notification schedule (the "manifest") from the `manifest` field of the event's associated `Tier` object (`event.tier.manifest`). A manifest is an ordered list of notification channel strings (e.g., `['primary_email', 'primary_sms', 'emergency_contact_email']`). The order defines the escalation path. This approach allows schedules to be managed dynamically in the database.
4.  **Interval Calculation:** The system calculates an even time interval by dividing the total duration (from `notification_start_date` to `event_date`) by the number of notifications in the manifest.
5.  **Creation:** It then iterates through the manifest, creating a `Notification` object for each channel, with the `scheduled_send_time` staggered by the calculated interval. All new notifications have a status of `pending`.

### Notification Sending: A Centralized Service Approach
The architecture has been refactored to a "fat service" model where all sending logic is centralized in a single management command. This simplifies the flow and removes business logic from the model layer. The `Notification.send()` method has been removed.

1.  **Central Command:** The `data_management/management/commands/process_notifications.py` command is the single point of entry for all notification sending. It is designed to be run as a periodic task (e.g., a daily cron job).
2.  **Query:** The command queries the database for all notifications that are due (`scheduled_send_time` is in the past) and have a status of `pending` or `failed`. This allows the system to automatically retry failed notifications.
3.  **Dispatch:** For each notification, the command inspects the `channel` field.
    *   It retrieves the correct recipient information (e.g., user's primary email, backup phone number).
    *   It calls the appropriate sending utility (e.g., `send_reminder_email`, `send_reminder_sms`).
    *   If a channel is not supported (i.e., no sending logic is defined for it), the notification is marked as `failed` with an appropriate reason.
4.  **Atomic Update:** The sending utility attempts to make the API call.
    *   If successful, it returns the provider's message ID. The notification `status` is immediately updated to `sent` and the `message_sid` is saved.
    *   If the API call fails, the exception is caught, and the `status` is updated to `failed` with the error message logged in `failure_reason`. The entire operation is atomic for each notification.
5.  **Webhook Feedback Loop:** The webhook process remains the same. External providers call our webhook endpoints to provide final delivery status updates (`delivered` or `failed`), which are looked up by `message_sid`.

### Social Media ADMIN Task Creation: Notification Inception
To handle notification channels that require manual intervention, a special flow is initiated directly from the `Notification` model.

1.  **Trigger:** The `save()` method on the `Notification` model contains logic that checks the notification's channel when it is first created.
2.  **Condition:** If a notification is being created with the channel `social_media`, the logic is triggered.
3.  **Action:** The `save()` method calls the `create_admin_tasks_for_notification` utility. This utility creates one new `Event` for each social media handle found on the original user's profile. These new events are assigned to a designated admin user and use a special "Admin Task" tier. The `event_date` for these tasks is set to the scheduled send time of the original `social_media` notification, and `weeks_in_advance` is set to 1, giving the admin a one-week notice.
4.  **Status Update:** After successfully creating the admin tasks, the original `social_media` notification has its status immediately set to `admin_task_created`. Because its status is no longer `pending`, the `process_notifications` command will never pick it up, effectively ending its lifecycle.

## End-to-End Testing
To ensure the entire notification pipeline works correctly with live credentials, a dedicated end-to-end test command is provided.

**Command:** `python manage.py run_e2e_notification_test`

**Functionality:**
1.  **Safety Check:** First, it verifies that `DEBUG` is `True` in the settings to prevent it from ever running in a production environment.
2.  **Setup:** It creates a test `User` and an associated `Event` using the "Full Escalation" tier. It populates the user with backup and emergency contact details.
3.  **Simulation:** It simulates the passage of 15 days, calling the `process_notifications` command once for each day to mimic a real-world cron job.
4.  **Reporting:** After the simulation, it prints a final report showing the status of every notification that was scheduled.
5.  **Cleanup:** Finally, it deletes the test `User`, which cascades to delete the `Event` and all associated `Notification` objects, leaving the database clean.

This command provides a true E2E validation of the system, from event creation to sending real emails and SMS messages via the configured providers.

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