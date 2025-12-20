# users/tests/view_tests/test_email_verification_views.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

@pytest.mark.django_db
class TestEmailVerificationView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory(is_email_verified=False)
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = default_token_generator.make_token(self.user)
        self.url = f'/api/users/verify-email/{self.uidb64}/{self.token}/'

    def test_email_verification_success(self):
        response = self.client.get(self.url)
        
        assert response.status_code == 302 # Redirect
        assert response.url == f"{settings.SITE_URL}/verification-success/"
        
        self.user.refresh_from_db()
        assert self.user.is_email_verified is True

    def test_email_verification_already_verified(self):
        self.user.is_email_verified = True
        self.user.save()

        response = self.client.get(self.url)
        
        assert response.status_code == 302
        assert response.url == f"{settings.SITE_URL}/verification-success/"

    def test_email_verification_invalid_token(self):
        invalid_url = f'/api/users/verify-email/{self.uidb64}/invalid-token/'
        response = self.client.get(invalid_url)
        
        assert response.status_code == 302
        assert response.url == f"{settings.SITE_URL}/verification-failed/"
        
        self.user.refresh_from_db()
        assert self.user.is_email_verified is False

@pytest.mark.django_db
class TestResendVerificationView:

    def setup_method(self):
        self.client = APIClient()
        self.verified_user = UserFactory(is_email_verified=True)
        self.unverified_user = UserFactory(is_email_verified=False)
        self.url = '/api/users/resend-verification/'

    def test_unauthenticated_user_cannot_access(self):
        response = self.client.post(self.url)
        assert response.status_code == 401

    def test_verified_user_cannot_resend(self):
        self.client.force_authenticate(user=self.verified_user)
        response = self.client.post(self.url)
        assert response.status_code == 400
        assert "already been verified" in response.data['detail']

    def test_unverified_user_can_resend(self, mocker):
        mock_send_email = mocker.patch('users.views.email_verification_view.send_verification_email', return_value=True)
        self.client.force_authenticate(user=self.unverified_user)
        
        response = self.client.post(self.url)
        
        assert response.status_code == 200
        assert "new verification email has been sent" in response.data['detail']
        mock_send_email.assert_called_once_with(self.unverified_user)

        self.unverified_user.refresh_from_db()
        assert self.unverified_user.verification_email_last_sent_at is not None

    def test_rate_limiting_is_enforced(self):
        self.unverified_user.verification_email_last_sent_at = timezone.now() - timedelta(seconds=30)
        self.unverified_user.save()
        
        self.client.force_authenticate(user=self.unverified_user)
        response = self.client.post(self.url)
        
        assert response.status_code == 429
        assert "Please wait" in response.data['detail']

    def test_email_sending_failure(self, mocker):
        mock_send_email = mocker.patch('users.views.email_verification_view.send_verification_email', return_value=False)
        self.client.force_authenticate(user=self.unverified_user)
        
        response = self.client.post(self.url)
        
        assert response.status_code == 500
        assert "error sending the verification email" in response.data['detail']
        mock_send_email.assert_called_once_with(self.unverified_user)
