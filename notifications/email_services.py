from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils.html import strip_tags

from data_management.models import BlockedEmail
from notifications.models import Notification

def send_reminder_email(notification: Notification, recipient_address: str) -> bool:
    """
    Sends a single event reminder email based on a Notification object.

    This function handles rendering the templates, constructing the email,
    and sending it.

    Args:
        notification: The Notification instance to be sent.
        recipient_address: The email address to send the reminder to.

    Returns:
        True if the email was sent successfully, False otherwise.
    """
    # --- Blocklist Check ---
    if BlockedEmail.objects.filter(email=recipient_address).exists():
        print(f"Email to {recipient_address} suppressed because it is on the blocklist.")
        return False # Returning False because the email was not sent.
    
    if not notification.user or not notification.event or not recipient_address:
        # Cannot send an email without context or a recipient.
        return False

    try:
        # 1. Construct the unique acknowledgement URL
        # The frontend will need a corresponding route for this.
        acknowledgement_url = f"{settings.SITE_URL}/notifications/acknowledge/{notification.pk}/"

        # 2. Prepare the context for the templates
        context = {
            'user': notification.user,
            'event': notification.event,
            'acknowledgement_url': acknowledgement_url,
            'site_url': settings.SITE_URL, # For base template
        }

        # 3. Render the HTML and plain text templates
        subject = f"Reminder: {notification.event.name}"
        html_template = "notifications/emails/event_reminder.html"
        txt_template = "notifications/emails/event_reminder.txt"
        
        html_content = render_to_string(html_template, context)
        text_content = render_to_string(txt_template, context)

        # 4. Send the email
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_address]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)

        return True

    except Exception as e:
        # It's good practice to log this error. For now, we'll print it.
        print(f"Failed to send email for Notification {notification.pk}. Error: {e}")
        return False
