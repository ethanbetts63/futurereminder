# events/tests/view_tests/test_event_view.py
import pytest
from rest_framework.test import APIClient
from users.tests.factories.user_factory import UserFactory
from payments.tests.factories.tier_factory import TierFactory
from payments.tests.factories.price_factory import PriceFactory
from events.models import Event
from events.tests.factories.event_factory import EventFactory

@pytest.mark.django_db
def test_authenticated_event_create_success():
    """
    Tests that an authenticated user can successfully create an event.
    """
    # Required "Automated" tier for the serializer to work
    TierFactory(name="Automated")
    user = UserFactory()
    client = APIClient()
    client.force_authenticate(user=user)

    event_data = {
        'name': 'Test Event',
        'event_date': '2025-12-25',
        'notes': 'Test notes',
        'weeks_in_advance': 4,
    }

    response = client.post('/api/events/', event_data, format='json')

    assert response.status_code == 201
    assert Event.objects.count() == 1
    
    event = Event.objects.first()
    assert event.user == user
    assert event.name == event_data['name']
    assert event.tier.name == "Automated" # Check if the default tier was assigned

@pytest.mark.django_db
def test_authenticated_event_create_unauthenticated():
    """
    Tests that an unauthenticated user cannot create an event and gets a 401.
    """
    client = APIClient()
    event_data = {
        'name': 'Test Event',
        'event_date': '2025-12-25',
    }

    response = client.post('/api/events/', event_data, format='json')

    assert response.status_code == 401
    assert Event.objects.count() == 0

@pytest.mark.django_db
class TestEventViewSet:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.event = EventFactory(user=self.user)

    def test_list_events(self):
        EventFactory.create_batch(3, user=self.user)
        # Create an event for another user that should not be in the list
        EventFactory(user=UserFactory())
        
        response = self.client.get('/api/events/')
        
        assert response.status_code == 200
        assert len(response.data) == 4 # 1 from setup + 3 here

    def test_list_events_unauthenticated(self):
        self.client.logout()
        response = self.client.get('/api/events/')
        assert response.status_code == 401

    def test_retrieve_event(self):
        response = self.client.get(f'/api/events/{self.event.id}/')
        assert response.status_code == 200
        assert response.data['id'] == self.event.id

    def test_retrieve_event_unauthenticated(self):
        self.client.logout()
        response = self.client.get(f'/api/events/{self.event.id}/')
        assert response.status_code == 401

    def test_retrieve_other_users_event(self):
        other_user_event = EventFactory()
        response = self.client.get(f'/api/events/{other_user_event.id}/')
        assert response.status_code == 404

    def test_update_event(self):
        updated_data = {
            'name': 'Updated Name',
            'event_date': self.event.event_date,
            'notes': self.event.notes,
            'weeks_in_advance': self.event.weeks_in_advance,
        }
        response = self.client.put(f'/api/events/{self.event.id}/', updated_data, format='json')
        
        assert response.status_code == 200
        self.event.refresh_from_db()
        assert self.event.name == 'Updated Name'

    def test_partial_update_event(self):
        updated_data = {'notes': 'Updated notes'}
        response = self.client.patch(f'/api/events/{self.event.id}/', updated_data, format='json')
        
        assert response.status_code == 200
        self.event.refresh_from_db()
        assert self.event.notes == 'Updated notes'

    def test_destroy_event(self):
        response = self.client.delete(f'/api/events/{self.event.id}/')
        assert response.status_code == 204
        assert Event.objects.count() == 0

    def test_activate_free_tier_event(self):
        free_tier = TierFactory(name="Free Tier")
        PriceFactory(tier=free_tier, amount=0)
        self.event.tier = free_tier
        self.event.is_active = False
        self.event.save()
        
        response = self.client.post(f'/api/events/{self.event.id}/activate/')
        
        assert response.status_code == 200
        self.event.refresh_from_db()
        assert self.event.is_active is True

    def test_activate_paid_tier_event(self):
        paid_tier = TierFactory(name="Paid Tier")
        PriceFactory(tier=paid_tier, amount=10)
        self.event.tier = paid_tier
        self.event.save()
        
        response = self.client.post(f'/api/events/{self.event.id}/activate/')
        
        assert response.status_code == 400
        assert 'This action is only allowed for free-tier events.' in response.data['error']

    def test_activate_already_active_event(self):
        self.event.is_active = True
        self.event.save()

        response = self.client.post(f'/api/events/{self.event.id}/activate/')
        
        assert response.status_code == 200
        assert 'Event is already active.' in response.data['message']