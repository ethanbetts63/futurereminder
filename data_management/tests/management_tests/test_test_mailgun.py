import pytest
from io import StringIO
from unittest.mock import patch, MagicMock
from django.core.management import call_command

@pytest.mark.django_db
class TestTestMailgunCommand:

    @patch('data_management.management.commands.test_mailgun.requests.post')
    def test_mailgun_success(self, mock_post):
        """Test the command when Mailgun returns a successful response."""
        # Mock the response from requests.post
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.text = '{"message": "Queued. Thank you."}'
        mock_post.return_value = mock_response
        
        out = StringIO()
        call_command('test_mailgun', stdout=out)
        
        mock_post.assert_called_once()
        # You can add more specific assertions about the call arguments here if needed
        
        output = out.getvalue()
        assert "Successfully sent email!" in output
        assert 'Queued. Thank you.' in output

    @patch('data_management.management.commands.test_mailgun.requests.post')
    def test_mailgun_failure(self, mock_post):
        """Test the command when Mailgun returns an error response."""
        mock_response = MagicMock()
        mock_response.status_code = 401
        mock_response.text = '{"message": "Forbidden"}'
        mock_post.return_value = mock_response
        
        err = StringIO()
        call_command('test_mailgun', stderr=err)
        
        mock_post.assert_called_once()
        
        error_output = err.getvalue()
        assert "Failed to send email" in error_output
        assert "Status code: 401" in error_output
        assert "Forbidden" in error_output
