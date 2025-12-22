import pytest
from io import StringIO
from unittest.mock import patch
from django.core.management import call_command
from django.utils import timezone
from datetime import timedelta
from events.models import Notification
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory

@pytest.mark.django_db
class TestProcessNotificationsCommand:

    @patch('data_management.management.commands.process_notifications.send_reminder_email')
    def test_process_due_notifications(self, mock_send_email):
        """
        Test that the command processes notifications that are due,
        updates their status, and calls the email sending function.
        """
        mock_send_email.return_value = True
        
        # --- Test Data ---
        user = UserFactory(is_email_verified=True, backup_email='backup@test.com')
        event = EventFactory(user=user)

        # 1. A notification that is due to be sent
        due_notification = Notification.objects.create(
            event=event,
            user=user,
            channel='primary_email',
            status='pending',
            scheduled_send_time=timezone.now() - timedelta(hours=1)
        )
        
        # 2. A notification that is not yet due
        future_notification = Notification.objects.create(
            event=event,
            user=user,
            channel='primary_email',
            status='pending',
            scheduled_send_time=timezone.now() + timedelta(hours=1)
        )

        # 3. A notification for an unverified user
        unverified_user = UserFactory(is_email_verified=False)
        unverified_event = EventFactory(user=unverified_user)
        unverified_notification = Notification.objects.create(
            event=unverified_event,
            user=unverified_user,
            channel='primary_email',
            status='pending',
            scheduled_send_time=timezone.now() - timedelta(hours=1)
        )

        # 4. A notification with a backup email
        backup_email_notification = Notification.objects.create(
            event=event,
            user=user,
            channel='backup_email',
            status='pending',
            scheduled_send_time=timezone.now() - timedelta(hours=1)
        )
        
        # --- Call Command ---
        out = StringIO()
        call_command('process_notifications', stdout=out)
        
        # --- Assertions ---
        # Reload from DB to get updated status
        due_notification.refresh_from_db()
        future_notification.refresh_from_db()
        unverified_notification.refresh_from_db()
        backup_email_notification.refresh_from_db()

        # Check that the correct notifications were processed
        assert due_notification.status == 'sent'
        assert future_notification.status == 'pending' # Should not have been processed
        assert unverified_notification.status == 'pending' # Should not have been processed
        assert backup_email_notification.status == 'sent'

        # Check that the email sending function was called for the correct notifications
        assert mock_send_email.call_count == 2
        mock_send_email.assert_any_call(due_notification, user.email)
        mock_send_email.assert_any_call(backup_email_notification, user.backup_email)

        # Check the command output
        output = out.getvalue()
        assert f"Found 2 notifications to process." in output
        assert f"Successfully sent to {user.email}" in output
        assert f"Successfully sent to {user.backup_email}" in output
        assert "Successfully sent: 2" in output
        assert "Failed to send: 0" in output
        
    def test_no_due_notifications(self):
        """Test the command's output when there are no notifications to send."""
        out = StringIO()
        call_command('process_notifications', stdout=out)
        assert "No pending notifications to send." in out.getvalue()

    @patch('data_management.management.commands.process_notifications.send_reminder_email')
    def test_email_sending_failure(self, mock_send_email):
        """Test that the notification status is updated to 'failed' if sending fails."""
        mock_send_email.return_value = False
        
        user = UserFactory(is_email_verified=True)
        event = EventFactory(user=user)
        notification = Notification.objects.create(
            event=event,
            user=user,
            channel='primary_email',
            status='pending',
            scheduled_send_time=timezone.now() - timedelta(hours=1)
        )
        
        out = StringIO()
        err = StringIO()
        call_command('process_notifications', stdout=out, stderr=err)
        
        notification.refresh_from_db()
        assert notification.status == 'failed'
        
        mock_send_email.assert_called_once()
        assert f"Failed to send to {user.email}" in err.getvalue()
        assert "Successfully sent: 0" in out.getvalue()
        assert "Failed to send: 1" in out.getvalue()
