# users/tests/view_tests/test_register_view.py
import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
class TestRegisterView:

    def setup_method(self):
        self.client = APIClient()
        self.register_url = '/api/users/register/'
        self.valid_data = {
            'email': 'test@example.com',
            'password': 'strongpassword123',
            'first_name': 'Test',
            'last_name': 'User',
        }

    def test_successful_registration(self, mocker):
        mock_send_email = mocker.patch('users.serializers.register_serializer.send_verification_email')
        
        response = self.client.post(self.register_url, self.valid_data, format='json')
        
        assert response.status_code == 201
        assert User.objects.count() == 1
        
        user = User.objects.get(email='test@example.com')
        assert user.first_name == 'Test'
        assert user.check_password('strongpassword123')
        
        assert 'refresh' in response.data
        assert 'access' in response.data
        assert response.data['user']['email'] == 'test@example.com'
        
        mock_send_email.assert_called_once_with(user)

    def test_registration_with_existing_email(self, mocker):
        mock_send_email = mocker.patch('users.serializers.register_serializer.send_verification_email')
        User.objects.create_user(username='test@example.com', email='test@example.com', password='password')
        
        response = self.client.post(self.register_url, self.valid_data, format='json')
        
        assert response.status_code == 400
        assert 'email' in response.data
        assert 'already exists' in str(response.data['email'])
        assert User.objects.count() == 1
        mock_send_email.assert_not_called()

    def test_registration_with_invalid_email(self, mocker):
        mock_send_email = mocker.patch('users.serializers.register_serializer.send_verification_email')
        invalid_data = self.valid_data.copy()
        invalid_data['email'] = 'not-an-email'
        
        response = self.client.post(self.register_url, invalid_data, format='json')
        
        assert response.status_code == 400
        assert 'email' in response.data
        mock_send_email.assert_not_called()
        
    def test_registration_with_missing_required_fields(self, mocker):
        mock_send_email = mocker.patch('users.serializers.register_serializer.send_verification_email')
        
        # Missing first_name
        invalid_data = self.valid_data.copy()
        del invalid_data['first_name']
        response = self.client.post(self.register_url, invalid_data, format='json')
        assert response.status_code == 400
        assert 'first_name' in response.data

        # Missing password
        invalid_data = self.valid_data.copy()
        del invalid_data['password']
        response = self.client.post(self.register_url, invalid_data, format='json')
        assert response.status_code == 400
        assert 'password' in response.data
        
        mock_send_email.assert_not_called()
