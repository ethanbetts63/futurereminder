import pytest
from io import StringIO
from unittest.mock import patch
from django.core.management import call_command
from django.conf import settings
from django.test import override_settings
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory

@pytest.mark.django_db
class TestSendTestEmailCommand:

    @patch('data_management.management.commands.send_test_email.send_mail')
    def test_send_simple_email(self, mock_send_mail):
        """Test sending a simple text email without a template."""
        out = StringIO()
        call_command('send_test_email', '--recipient=test@example.com', '--subject=Simple Test', stdout=out)
        
        mock_send_mail.assert_called_once_with(
            subject='Simple Test',
            message="This is a test email from the FutureReminder application.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['test@example.com'],
            fail_silently=False
        )
        assert "Successfully sent email" in out.getvalue()

    @patch('data_management.management.commands.send_test_email.EmailMultiAlternatives')
    def test_send_template_email(self, mock_email_multi_alternatives, tmp_path):
        """Test sending an email using a specified template."""
        template_dir = tmp_path / "templates"
        template_dir.mkdir()
        html_template_path = template_dir / "test.html"
        txt_template_path = template_dir / "test.txt"
        html_template_path.write_text("<h1>Hello {{ name }}</h1>")
        txt_template_path.write_text("Hello {{ name }}")
        
        # Override settings to include the temp directory in template search path
        TEMPLATES = settings.TEMPLATES
        TEMPLATES[0]['DIRS'] = [str(template_dir)]

        with override_settings(TEMPLATES=TEMPLATES):
            out = StringIO()
            call_command(
                'send_test_email',
                '--recipient=test@example.com',
                '--template_name=test.html',
                '--context={"name": "World"}',
                stdout=out
            )

        mock_email_multi_alternatives.assert_called_once()
        # We can now check the content of the email
        call_args = mock_email_multi_alternatives.call_args[0]
        assert call_args[0] == 'Test Email' # subject
        assert "Hello World" in call_args[1] # text_content
        assert call_args[2] == settings.DEFAULT_FROM_EMAIL # from_email
        assert call_args[3] == ['test@example.com'] # recipient
        
        mock_email_multi_alternatives.return_value.attach_alternative.assert_called_once()
        html_content_arg = mock_email_multi_alternatives.return_value.attach_alternative.call_args[0][0]
        assert "<h1>Hello World</h1>" in html_content_arg

        mock_email_multi_alternatives.return_value.send.assert_called_once()
        assert "Successfully sent email" in out.getvalue()

    @patch('data_management.management.commands.send_test_email.send_reminder_email')
    def test_reminder_test_flow(self, mock_send_reminder_email):
        """Test the --reminder_test flag flow."""
        mock_send_reminder_email.return_value = True
        UserFactory()
        EventFactory()
        
        out = StringIO()
        call_command('send_test_email', '--reminder_test', '--recipient=reminder@test.com', stdout=out)
        
        mock_send_reminder_email.assert_called_once()
        assert mock_send_reminder_email.call_args[0][1] == 'reminder@test.com'
        assert "Successfully sent event reminder test email" in out.getvalue()

    def test_reminder_test_no_data(self):
        """Test the --reminder_test flag when there is no data in the database."""
        err = StringIO()
        call_command('send_test_email', '--reminder_test', stderr=err)
        assert "Could not find any Users" in err.getvalue()

    def test_invalid_json_context(self):
        """Test that the command handles invalid JSON in the --context argument."""
        err = StringIO()
        call_command('send_test_email', '--context={invalid}', stderr=err)
        assert "Invalid JSON provided" in err.getvalue()
