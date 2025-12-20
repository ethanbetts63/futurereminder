# users/tests/view_tests/test_password_reset_request_view.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory
from django.utils import timezone
from datetime import timedelta

@pytest.mark.django_db
class TestPasswordResetRequestView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory(email='test@example.com')
        self.url = '/api/users/password-reset/request/'

    def test_request_with_valid_email_sends_email(self, mocker):
        mock_send_email = mocker.patch('users.views.password_reset_request_view.send_password_reset_email', return_value=True)
        
        response = self.client.post(self.url, {'email': 'test@example.com'}, format='json')
        
        assert response.status_code == 200
        mock_send_email.assert_called_once_with(self.user)
        
        self.user.refresh_from_db()
        assert self.user.password_reset_last_sent_at is not None

    def test_request_with_non_existent_email_does_not_send(self, mocker):
        mock_send_email = mocker.patch('users.views.password_reset_request_view.send_password_reset_email')
        
        response = self.client.post(self.url, {'email': 'nonexistent@example.com'}, format='json')
        
        assert response.status_code == 200
        mock_send_email.assert_not_called()

    def test_request_with_invalid_email_does_not_send(self, mocker):
        mock_send_email = mocker.patch('users.views.password_reset_request_view.send_password_reset_email')
        
        response = self.client.post(self.url, {'email': 'not-an-email'}, format='json')
        
        assert response.status_code == 200
        mock_send_email.assert_not_called()

    def test_rate_limiting_prevents_frequent_sends(self, mocker):
        mock_send_email = mocker.patch('users.views.password_reset_request_view.send_password_reset_email', return_value=True)
        
        # First request
        self.client.post(self.url, {'email': 'test@example.com'}, format='json')
        assert mock_send_email.call_count == 1
        
        # Second request immediately after
        response = self.client.post(self.url, {'email': 'test@example.com'}, format='json')
        assert response.status_code == 200
        # The mock should NOT have been called again
        assert mock_send_email.call_count == 1

    def test_rate_limiting_allows_sends_after_timeout(self, mocker):
        mock_send_email = mocker.patch('users.views.password_reset_request_view.send_password_reset_email', return_value=True)
        
        # Set the last sent time to be in the past
        self.user.password_reset_last_sent_at = timezone.now() - timedelta(seconds=61)
        self.user.save()
        
        response = self.client.post(self.url, {'email': 'test@example.com'}, format='json')
        
        assert response.status_code == 200
        mock_send_email.assert_called_once_with(self.user)
