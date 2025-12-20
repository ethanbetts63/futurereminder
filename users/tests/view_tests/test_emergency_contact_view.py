# users/tests/view_tests/test_emergency_contact_view.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory
from users.tests.factories.emergency_contact_factory import EmergencyContactFactory

@pytest.mark.django_db
class TestEmergencyContactViewSet:

    def setup_method(self):
        self.client = APIClient()
        self.user1 = UserFactory()
        self.user2 = UserFactory()
        
        self.contact1_user1 = EmergencyContactFactory(user=self.user1)
        self.contact2_user1 = EmergencyContactFactory(user=self.user1)
        self.contact_user2 = EmergencyContactFactory(user=self.user2)

        self.list_create_url = '/api/users/emergency-contacts/'
        self.detail_url = f'/api/users/emergency-contacts/{self.contact1_user1.pk}/'
        self.other_user_detail_url = f'/api/users/emergency-contacts/{self.contact_user2.pk}/'

    def test_unauthenticated_user_cannot_access(self):
        response = self.client.get(self.list_create_url)
        assert response.status_code == 401
        
        response = self.client.get(self.detail_url)
        assert response.status_code == 401

    def test_list_own_contacts(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.list_create_url)
        
        assert response.status_code == 200
        assert len(response.data) == 2
        assert response.data[0]['id'] in [self.contact1_user1.id, self.contact2_user1.id]

    def test_create_contact(self):
        self.client.force_authenticate(user=self.user1)
        new_contact_data = {
            'first_name': 'New',
            'last_name': 'Contact',
            'phone': '555-1234'
        }
        
        response = self.client.post(self.list_create_url, new_contact_data, format='json')
        
        assert response.status_code == 201
        assert self.user1.emergency_contacts.count() == 3
        assert response.data['first_name'] == 'New'

    def test_retrieve_own_contact(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.detail_url)
        
        assert response.status_code == 200
        assert response.data['id'] == self.contact1_user1.id

    def test_cannot_retrieve_other_users_contact(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.other_user_detail_url)
        assert response.status_code == 404

    def test_update_own_contact(self):
        self.client.force_authenticate(user=self.user1)
        update_data = {'first_name': 'Updated Name'}
        
        response = self.client.patch(self.detail_url, update_data, format='json')
        
        assert response.status_code == 200
        assert response.data['first_name'] == 'Updated Name'
        
        self.contact1_user1.refresh_from_db()
        assert self.contact1_user1.first_name == 'Updated Name'

    def test_cannot_update_other_users_contact(self):
        self.client.force_authenticate(user=self.user1)
        update_data = {'first_name': 'Updated Name'}
        
        response = self.client.patch(self.other_user_detail_url, update_data, format='json')
        assert response.status_code == 404

    def test_delete_own_contact(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(self.detail_url)
        
        assert response.status_code == 204
        assert self.user1.emergency_contacts.count() == 1

    def test_cannot_delete_other_users_contact(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(self.other_user_detail_url)
        assert response.status_code == 404
