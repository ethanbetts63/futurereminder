from django.core.management.base import BaseCommand
from events.utils.send_reminder_sms import send_reminder_sms
from events.models import Notification, Event
from users.models import User
from unittest.mock import MagicMock

class Command(BaseCommand):
    help = 'Sends a test SMS message to a specified number using Twilio.'

    def handle(self, *args, **options):
        test_phone_number = "+4591749128"

        self.stdout.write(f"Attempting to send a test SMS to {test_phone_number}...")

        # create mock objects to satisfy the function signature
        mock_user = MagicMock(spec=User)
        mock_user.email = 'test@example.com'

        mock_event = MagicMock(spec=Event)
        mock_event.name = 'Sample FutureReminder Event'
        mock_event.date = '2025-01-01'

        mock_notification = MagicMock(spec=Notification)
        mock_notification.user = mock_user
        mock_notification.event = mock_event
        mock_notification.pk = 123  

        try:
            success = send_reminder_sms(mock_notification, test_phone_number)

            if success:
                self.stdout.write(self.style.SUCCESS(f"Successfully sent SMS to {test_phone_number}."))
            else:
                self.stdout.write(self.style.ERROR("Failed to send SMS. Check the console for logs from the sending function."))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An exception occurred: {e}"))

