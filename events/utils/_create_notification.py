from ..models import Notification

def _create_notification(event, channel, send_time):
    """
    Helper function to create a Notification object.
    The contact info will be looked up at the time of sending.
    """
    Notification.objects.create(
        event=event,
        user=event.user,
        channel=channel,
        scheduled_send_time=send_time,
    )
