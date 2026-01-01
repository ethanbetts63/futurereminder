from datetime import timedelta, datetime, time
from django.utils import timezone
from ..models import Event
from .clear_pending_notifications import clear_pending_notifications
from ._create_notification import _create_notification

# The single source of truth for notification schedules per tier.
# The order defines the escalation hierarchy (cheapest first).
TIER_MANIFESTS = {
    'Free': [
        'primary_email',
        'primary_email',
        'primary_sms',
    ],
    'Standard': [
        'primary_email',
        'backup_email',
        'primary_email',
        'primary_sms',
        'primary_email',
        'emergency_contact_email',

    ],
    'Premium': [
        'primary_email',
        'backup_email',
        'primary_sms',
        'primary_email',
        'backup_sms',
        'primary_email',
        'emergency_contact_email',
        'social_media',
    ]
}


def schedule_notifications_for_event(event: 'Event'):
    """
    Generates an evenly-distributed notification schedule for a given event
    based on the 'Manifest and Interval' approach.

    This function should be called whenever an event is created or updated.
    """
    # 1. Clear any existing pending notifications for this event
    clear_pending_notifications(event)
    print(f"Cleared pending notifications for event ID {event.id}")

    # 2. Basic validation
    if not all([event.is_active, event.tier, event.notification_start_date, event.event_date]) or \
       event.notification_start_date >= event.event_date:
        print(f"Skipping notification scheduling for event ID {event.id} due to invalid state.")
        return

    # 3. Get the manifest from the event's tier
    manifest = event.tier.manifest
    if not manifest:
        # Log this event? For now, we just stop.
        return

    # 4. Calculate timing intervals
    total_duration = event.event_date - event.notification_start_date
    total_notifications = len(manifest)

    if total_notifications == 0:
        print(f"No notifications scheduled for event ID {event.id} (manifest is empty).")
        return
    
    # If there's only one notification, schedule it at the start.
    # Otherwise, calculate the interval to spread them out.
    interval = total_duration / total_notifications if total_notifications > 1 else timedelta(0)

    # 5. Create notifications based on the manifest
    for i, channel in enumerate(manifest):
        # Calculate the target date for the notification
        target_date = event.notification_start_date + (interval * i)
        
        # Combine date with midnight time and make it timezone-aware
        send_time_naive = datetime.combine(target_date, time.min)
        send_time_aware = timezone.make_aware(send_time_naive, timezone.get_current_timezone())
        
        # Schedule the notification. The helper is simple and doesn't need contact info.
        _create_notification(
            event=event,
            channel=channel,
            send_time=send_time_aware
        )
        print(f"Scheduled {channel} notification for event ID {event.id} at {send_time_aware.isoformat()}")
