import pytest
from io import StringIO
from django.core.management import call_command
from django.utils import timezone
from unittest.mock import patch
from datetime import timedelta

from events.models import Notification
from events.tests.factories.event_factory import EventFactory
from users.tests.factories.user_factory import UserFactory

@pytest.fixture
def mock_send_email():
    """Mocks the send_reminder_email function."""
    with patch('data_management.management.commands.process_notifications.send_reminder_email') as mock:
        mock.return_value = True
        yield mock

@pytest.fixture
def mock_send_sms():
    """Mocks the send_reminder_sms function."""
    with patch('data_management.management.commands.process_notifications.send_reminder_sms') as mock:
        mock.return_value = "SM_fake_sid_12345"
        yield mock

@pytest.mark.django_db
class TestProcessNotificationsCommand:
    def test_sends_due_email_notification(self, mock_send_email, mock_send_sms):
        """Tests that a pending email notification due in the past is sent."""
        user = UserFactory()
        event = EventFactory(user=user)
        notification = Notification.objects.create(
            event=event,
            user=user,
            channel='primary_email',
            status='pending',
            scheduled_send_time=timezone.now() - timedelta(hours=1)
        )

        call_command('process_notifications')

        mock_send_email.assert_called_once()
        mock_send_sms.assert_not_called()
        notification.refresh_from_db()
        assert notification.status == 'sent'
        assert notification.recipient_contact_info == user.email

    def test_sends_due_sms_notification(self, mock_send_email, mock_send_sms):
        """Tests that a pending SMS notification due in the past is sent."""
        user = UserFactory(phone_number='+15551234567')
        event = EventFactory(user=user)
        notification = Notification.objects.create(
            event=event,
            user=user,
            channel='primary_sms',
            status='pending',
            scheduled_send_time=timezone.now() - timedelta(hours=1)
        )

        call_command('process_notifications')

        mock_send_sms.assert_called_once()
        mock_send_email.assert_not_called()
        notification.refresh_from_db()
        assert notification.status == 'sent'
        assert notification.message_sid == "SM_fake_sid_12345"

    def test_retries_failed_notification(self, mock_send_email):
        """Tests that a notification with 'failed' status is retried."""
        user = UserFactory()
        event = EventFactory(user=user)
        Notification.objects.create(
            event=event,
            user=user,
            channel='primary_email',
            status='failed',
            scheduled_send_time=timezone.now() - timedelta(days=1)
        )

        call_command('process_notifications')

        mock_send_email.assert_called_once()

    def test_does_not_send_future_notification(self, mock_send_email, mock_send_sms):
        """Tests that a notification scheduled for the future is not sent."""
        user = UserFactory()
        event = EventFactory(user=user)
        Notification.objects.create(
            event=event,
            user=user,
            channel='primary_email',
            status='pending',
            scheduled_send_time=timezone.now() + timedelta(hours=1)
        )

        call_command('process_notifications')

        mock_send_email.assert_not_called()
        mock_send_sms.assert_not_called()

    def test_handles_unsupported_channel(self, mock_send_email, mock_send_sms):
        """Tests that a notification for an unsupported channel is marked as failed."""
        user = UserFactory()
        event = EventFactory(user=user)
        notification = Notification.objects.create(
            event=event,
            user=user,
            channel='social_media',
            status='pending',
            scheduled_send_time=timezone.now() - timedelta(hours=1)
        )
        
        call_command('process_notifications')

        mock_send_email.assert_not_called()
        mock_send_sms.assert_not_called()
        notification.refresh_from_db()
        assert notification.status == 'failed'
        assert "NotImplementedError" in notification.failure_reason

    def test_date_argument_filters_correctly(self, mock_send_email):
        """Tests that the --date argument correctly filters notifications."""
        user = UserFactory()
        event = EventFactory(user=user)
        yesterday = timezone.now().date() - timedelta(days=1)
        
        notification = Notification.objects.create(
            event=event,
            user=user,
            channel='primary_email',
            status='pending',
            scheduled_send_time=timezone.make_aware(
                datetime.combine(yesterday, timezone.now().time())
            )
        )

        # Act 1: Run for today's date, it should not be processed
        today_str = timezone.now().strftime('%Y-%m-%d')
        call_command('process_notifications', date=today_str)
        mock_send_email.assert_not_called()

        # Act 2: Run for yesterday's date, it should be processed
        yesterday_str = yesterday.strftime('%Y-%m-%d')
        call_command('process_notifications', date=yesterday_str)
        mock_send_email.assert_called_once()
        notification.refresh_from_db()
        assert notification.status == 'sent'

            assert "SMTP server is down" in notification.failure_reason

    