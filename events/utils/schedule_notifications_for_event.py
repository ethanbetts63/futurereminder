from datetime import timedelta
from ..models import Event
from .clear_pending_notifications import clear_pending_notifications
from ._create_notification import _create_notification

# The single source of truth for notification schedules per tier.
# The order defines the escalation hierarchy (cheapest first).
TIER_MANIFESTS = {
    'Free': [
        'primary_email',
        'primary_email',
    ],
    'Standard': [
        'primary_email',
        'secondary_email',
        'primary_email',
        'primary_sms',
        'primary_email',
    ],
    'Premium': [
        'primary_email',
        'secondary_email',
        'primary_sms',
        'primary_email',
        'backup_sms', # Assumes backup_phone is used for SMS
        'admin_call',
        'primary_email',
        'emergency_contact',
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

    # 2. Basic validation
    if not all([event.is_active, event.tier, event.notification_start_date, event.event_date]) or \
       event.notification_start_date >= event.event_date:
        return

    # 3. Get the manifest for the event's tier
    manifest = TIER_MANIFESTS.get(event.tier.name)
    if not manifest:
        return

    # 4. Calculate timing intervals
    total_duration = event.event_date - event.notification_start_date
    total_notifications = len(manifest)

    if total_notifications == 0:
        return
    
    # If there's only one notification, schedule it at the start.
    # Otherwise, calculate the interval to spread them out.
    interval = total_duration / total_notifications if total_notifications > 1 else timedelta(0)

    # 5. Create notifications based on the manifest
    for i, channel in enumerate(manifest):
        # The last notification should be on the interval, not on the event date itself,
        # to give some time for action.
        send_time = event.notification_start_date + (interval * i)
        
        # Schedule the notification. The _create_notification helper is simple and
        # does not require contact info, which is looked up at send time.
        _create_notification(
            event=event,
            channel=channel,
            send_time=send_time
        )
