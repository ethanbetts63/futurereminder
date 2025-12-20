# users/tests/view_tests/test_user_profile_view.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
class TestUserProfileView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory(email='testuser@example.com', first_name='Test', last_name='User')
        self.url = '/api/users/me/'

    def test_unauthenticated_user_cannot_access(self):
        response = self.client.get(self.url)
        assert response.status_code == 401

    def test_get_own_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        
        assert response.status_code == 200
        assert response.data['email'] == self.user.email
        assert response.data['first_name'] == self.user.first_name

    def test_update_own_profile_success(self):
        self.client.force_authenticate(user=self.user)
        update_data = {
            'first_name': 'UpdatedFirst',
            'last_name': 'UpdatedLast',
            'phone': '1234567890'
        }
        
        response = self.client.patch(self.url, update_data, format='json')
        
        assert response.status_code == 200
        assert response.data['first_name'] == 'UpdatedFirst'
        assert response.data['phone'] == '1234567890'
        
        self.user.refresh_from_db()
        assert self.user.first_name == 'UpdatedFirst'

    def test_update_profile_with_invalid_data(self):
        self.client.force_authenticate(user=self.user)
        update_data = {'email': 'not-a-valid-email'}
        
        response = self.client.patch(self.url, update_data, format='json')
        
        assert response.status_code == 400
        assert 'email' in response.data

    def test_cannot_update_to_existing_email(self):
        other_user = UserFactory(email='other@example.com')
        self.client.force_authenticate(user=self.user)
        update_data = {'email': other_user.email}
        
        response = self.client.patch(self.url, update_data, format='json')
        
        # This should fail because the email is already taken.
        # The User model should enforce this. Let's assume a 400.
        assert response.status_code == 400
        assert 'email' in response.data

    def test_user_cannot_make_themselves_staff(self):
        assert self.user.is_staff is False
        self.client.force_authenticate(user=self.user)
        update_data = {'is_staff': True}
        
        response = self.client.patch(self.url, update_data, format='json')
        
        # The serializer should ideally ignore this field if it's not
        # explicitly writable or if the user is not an admin.
        # Let's check that the value did not change.
        assert response.status_code == 200
        assert response.data['is_staff'] is False
        
        self.user.refresh_from_db()
        assert self.user.is_staff is False
