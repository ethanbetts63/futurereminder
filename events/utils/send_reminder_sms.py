import os
from twilio.rest import Client
from django.conf import settings
from ..models import Notification

def send_reminder_sms(notification: Notification, recipient_phone_number: str) -> bool:
    """
    Sends a single event reminder SMS based on a Notification object using Twilio API.

    This function constructs the SMS and sends it via Twilio.

    Args:
        notification: The Notification instance to be sent.
        recipient_phone_number: The phone number to send the reminder to.

    Returns:
        True if the SMS was sent successfully, False otherwise.
    """
    if not notification.user or not notification.event or not recipient_phone_number:
        # Cannot send an SMS without context or a recipient.
        return False

    try:
        # 1. Construct the message
        message_body = f"Reminder: {notification.event.name} on {notification.event.date}. More info at {settings.SITE_URL}"

        # 2. Send the SMS using Twilio API
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        message = client.messages.create(
            body=message_body,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=recipient_phone_number
        )

        # 3. Check for a successful response
        if message.sid:
            return True
        else:
            print(f"Failed to send SMS for Notification {notification.pk}. Twilio API did not return a message SID.")
            return False

    except Exception as e:
        # It's good practice to log this error. For now, we'll print it.
        print(f"Failed to send SMS for Notification {notification.pk}. Error: {e}")
        return False
