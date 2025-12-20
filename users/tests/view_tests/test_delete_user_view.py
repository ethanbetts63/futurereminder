# users/tests/view_tests/test_delete_user_view.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory
from notifications.tests.factories.notification_factory import NotificationFactory
from django.conf import settings

from django.test import override_settings

@pytest.mark.django_db
class TestDeleteUserView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory(
            is_active=True,
            first_name="Test",
            last_name="User",
            email="test@example.com",
            phone="1234567890"
        )
        self.url = '/api/users/delete/'

    def test_unauthenticated_user_cannot_access(self):
        response = self.client.delete(self.url)
        assert response.status_code == 401

    @override_settings(HASHING_SALT="a-secure-test-salt")
    def test_delete_user_anonymizes_data_and_deactivates(self):
        # Create a pending notification that should be deleted
        NotificationFactory(user=self.user, status='pending')
        # Create a sent notification that should NOT be deleted
        NotificationFactory(user=self.user, status='sent')

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)

        assert response.status_code == 204
        
        self.user.refresh_from_db()

        # Check user is deactivated
        assert self.user.is_active is False
        assert self.user.anonymized_at is not None

        # Check PII is wiped
        assert self.user.first_name == ""
        assert self.user.last_name == ""
        assert self.user.phone == ""
        assert "deleted" in self.user.email
        
        # Check hash fields are populated
        assert self.user.hash_first_name != ""
        assert self.user.hash_last_name != ""
        assert self.user.hash_phone != ""
        assert self.user.hash_email != ""

        # Check notifications
        assert self.user.notifications.filter(status='pending').count() == 0
        assert self.user.notifications.filter(status='sent').count() == 1

    @override_settings(HASHING_SALT=None)
    def test_delete_fails_if_salt_is_not_configured(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)

        # The view currently returns a 500 error in this case,
        # which might not be ideal but we test the current behavior.
        # A better implementation might handle the missing salt more gracefully.
        # Based on the code, it aborts silently and returns a 204.
        # This is a good example of a test revealing a potential logic issue.
        # Let's assert the user is NOT anonymized.
        
        assert response.status_code == 204

        self.user.refresh_from_db()
        assert self.user.is_active is True # Should not be deactivated
        assert self.user.first_name == "Test" # Should not be wiped
