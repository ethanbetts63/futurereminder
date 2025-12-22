import pytest
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta, datetime
from rest_framework.test import APIClient
from users.models import User
from events.models import Notification
from events.tests.factories.event_factory import EventFactory

pytestmark = pytest.mark.django_db

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def admin_user():
    return User.objects.create_superuser('admin@example.com', 'password')

@pytest.fixture
def regular_user():
    return User.objects.create_user('user@example.com', 'password')

def test_automated_notification_history_unauthorized(api_client, regular_user):
    """
    Test that a non-admin user cannot access the view.
    """
    api_client.force_authenticate(user=regular_user)
    url = reverse('data_management:automated-notification-history')
    response = api_client.get(url)
    assert response.status_code == 403

def test_automated_notification_history_authorized(api_client, admin_user):
    """
    Test that an admin user can access the view and gets a 200 response.
    """
    api_client.force_authenticate(user=admin_user)
    
    event = EventFactory()
    # Use a fixed date for deterministic testing
    base_time = timezone.make_aware(datetime(2025, 12, 15, 12, 0, 0))
    completed_time = base_time - timedelta(days=1)

    # 1. A pending notification that defines the date range
    Notification.objects.create(
        event=event,
        user=event.user,
        channel='primary_email', 
        status='pending', 
        scheduled_send_time=base_time
    )
    
    # 2. A completed notification that should be counted
    completed_notification = Notification.objects.create(
        event=event,
        user=event.user,
        channel='primary_sms', 
        status='sent', 
        scheduled_send_time=base_time - timedelta(days=2),
    )
    # Manually update the 'updated_at' field to bypass auto_now=True
    Notification.objects.filter(pk=completed_notification.pk).update(updated_at=completed_time)


    # 3. A notification with a status that should NOT be counted as completed
    Notification.objects.create(
        event=event,
        user=event.user,
        channel='primary_email', 
        status='failed', 
        scheduled_send_time=base_time - timedelta(days=3),
    )

    # 4. A notification with a channel that should NOT be included
    Notification.objects.create(
        event=event,
        user=event.user,
        channel='admin_call', 
        status='completed', 
        scheduled_send_time=base_time - timedelta(days=4),
    )

    url = reverse('data_management:automated-notification-history')
    response = api_client.get(url)
    
    assert response.status_code == 200
    assert isinstance(response.data, list)
    assert len(response.data) > 0
    
    # Define the dates we expect to see data for
    scheduled_day_str = base_time.strftime('%Y-%m-%d')
    completed_day_str = completed_time.strftime('%Y-%m-%d')
    
    data_map = {item['date']: item for item in response.data}

    # Check the data for the scheduled notification
    assert scheduled_day_str in data_map
    assert data_map[scheduled_day_str]['scheduled'] == 1
    
    # Check the data for the completed notification
    assert completed_day_str in data_map
    assert data_map[completed_day_str]['completed'] == 1