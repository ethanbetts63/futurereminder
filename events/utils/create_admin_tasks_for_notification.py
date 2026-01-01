from django.conf import settings
from django.utils import timezone
from events.models import Event
from payments.models import Tier
from users.models import User

def create_admin_tasks_for_notification(notification):
    """
    Creates 'Admin Task' events for a designated admin user based on a 'social_media'
    notification.

    Args:
        notification: The Notification instance with the 'social_media' channel.

    Returns:
        The number of admin tasks (Events) created.
    """
    # This function is designed to be called from the Notification.save() method,
    # so it contains its own error handling but raises exceptions on critical
    # setup issues like a missing admin user or tier.
    
    admin_user = User.objects.get(email=settings.ADMIN_EMAIL)
    admin_tier = Tier.objects.get(name="Admin Task")

    original_user = notification.user
    original_event = notification.event
    
    social_handles = {
        'Facebook': original_user.facebook_handle,
        'Instagram': original_user.instagram_handle,
        'Snapchat': original_user.snapchat_handle,
        'X (Twitter)': original_user.x_handle,
    }

    tasks_created = 0
    for platform, handle in social_handles.items():
        if handle:
            # Prepare the notes for the admin task
            notes_content = f"""
            A manual social media post is required.

            --------------------------------
            Original User: {original_user.username} ({original_user.email})
            Original Event: {original_event.name}
            Original Event Date: {original_event.event_date.strftime('%Y-%m-%d')}
            --------------------------------
            
            Platform: {platform}
            User's Handle: {handle}
            
            Suggested Content:
            "Friendly reminder from FutureReminder for {original_user.first_name} about their upcoming event: '{original_event.name}' on {original_event.event_date.strftime('%B %d, %Y')}!"
            """

            Event.objects.create(
                user=admin_user,
                tier=admin_tier,
                name=f"Manual Post for {original_user.username}: {platform}",
                notes=notes_content.strip(),
                event_date=notification.scheduled_send_time.date(),
                weeks_in_advance=1, # Give the admin a 1-week heads up
                is_active=True
            )
            tasks_created += 1

    return tasks_created
