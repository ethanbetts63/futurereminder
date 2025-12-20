# users/tests/view_tests/test_change_password_view.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
class TestChangePasswordView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory(password='old_password123')
        self.url = '/api/users/change-password/'

    def test_unauthenticated_user_cannot_access(self):
        response = self.client.put(self.url, {})
        assert response.status_code == 401

    def test_change_password_success(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "old_password": "old_password123",
            "new_password": "new_strong_password456",
            "new_password_confirm": "new_strong_password456",
        }
        response = self.client.put(self.url, data, format='json')

        assert response.status_code == 200
        assert "Password updated successfully" in response.data['detail']

        self.user.refresh_from_db()
        assert self.user.check_password("new_strong_password456")

    def test_change_password_incorrect_old_password(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "old_password": "wrong_old_password",
            "new_password": "new_strong_password456",
            "new_password_confirm": "new_strong_password456",
        }
        response = self.client.put(self.url, data, format='json')

        assert response.status_code == 400
        assert "old_password" in response.data

    def test_change_password_mismatched_new_passwords(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "old_password": "old_password123",
            "new_password": "new_strong_password456",
            "new_password_confirm": "mismatched_password",
        }
        response = self.client.put(self.url, data, format='json')

        assert response.status_code == 400
        assert "new_password_confirm" in response.data

    def test_change_password_new_password_too_short(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "old_password": "old_password123",
            "new_password": "short",
            "new_password_confirm": "short",
        }
        response = self.client.put(self.url, data, format='json')

        assert response.status_code == 400
        assert "new_password" in response.data
        # This message comes from Django's default password validators
        assert "at least 8 characters" in str(response.data['new_password'])

    def test_change_password_new_password_too_common(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "old_password": "old_password123",
            "new_password": "password",
            "new_password_confirm": "password",
        }
        response = self.client.put(self.url, data, format='json')
        
        assert response.status_code == 400
        assert "new_password" in response.data
        assert "too common" in str(response.data['new_password'])
