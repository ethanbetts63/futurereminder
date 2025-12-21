import requests
from django.template.loader import render_to_string
from django.conf import settings
from data_management.models import BlockedEmail
from data_management.views.add_to_blocklist_view import signer # Import the signer
from notifications.models import Notification

def send_reminder_email(notification: Notification, recipient_address: str) -> bool:
    """
    Sends a single event reminder email based on a Notification object using Mailgun API.

    This function handles rendering the templates, constructing the email,
    and sending it via Mailgun.

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
        acknowledgement_url = f"{settings.SITE_URL}/notifications/acknowledge/{notification.pk}/"

        # 2. Construct the unique blocklist URL
        signed_email = signer.sign(recipient_address)
        unsubscribe_url = f"{settings.SITE_URL}/api/data/blocklist/block/{signed_email}/"

        # 3. Prepare the context for the templates
        context = {
            'user': notification.user,
            'event': notification.event,
            'acknowledgement_url': acknowledgement_url,
            'site_url': settings.SITE_URL,
            'unsubscribe_url': unsubscribe_url, # Add to context
        }

        # 4. Render the HTML and plain text templates
        subject = f"Reminder: {notification.event.name}"
        html_template = "notifications/emails/event_reminder.html"
        txt_template = "notifications/emails/event_reminder.txt"
        
        html_content = render_to_string(html_template, context)
        text_content = render_to_string(txt_template, context)

        # 5. Send the email using Mailgun API
        response = requests.post(
            f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data={"from": settings.DEFAULT_FROM_EMAIL,
                  "to": [recipient_address],
                  "subject": subject,
                  "text": text_content,
                  "html": html_content})

        # Check for a successful response
        if response.status_code == 200:
            return True
        else:
            # Log error from Mailgun
            print(f"Failed to send email for Notification {notification.pk}. Mailgun API responded with {response.status_code}: {response.text}")
            return False

    except Exception as e:
        # It's good practice to log this error. For now, we'll print it.
        print(f"Failed to send email for Notification {notification.pk}. Error: {e}")
        return False
