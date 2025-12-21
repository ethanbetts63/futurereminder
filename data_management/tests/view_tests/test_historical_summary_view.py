import pytest
from django.urls import reverse
from django.utils import timezone
from datetime import datetime
from dateutil.relativedelta import relativedelta
from rest_framework.test import APIClient
from users.models import User
from events.models import Event
from payments.models import Payment
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.payment_factory import PaymentFactory

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

def setup_historical_data():
    """Creates data with specific creation dates over the last few months."""
    today = timezone.now()

    # --- Month 2 Data (2 months ago) ---
    month2_time = (today - relativedelta(months=2)).replace(hour=0, minute=0, second=0, microsecond=0)
    print(f"Month 2 time: {month2_time}, timezone: {month2_time.tzinfo}") # DEBUG
    user_month2 = UserFactory()
    User.objects.filter(pk=user_month2.pk).update(date_joined=month2_time)
    events_month2 = EventFactory.create_batch(3, user=user_month2)
    for event in events_month2:
        Event.objects.filter(pk=event.pk).update(created_at=month2_time)

    # --- Month 1 Data (1 month ago) ---
    month1_time = (today - relativedelta(months=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    user1_month1 = UserFactory()
    User.objects.filter(pk=user1_month1.pk).update(date_joined=month1_time)
    user2_month1 = UserFactory()
    User.objects.filter(pk=user2_month1.pk).update(date_joined=month1_time)
    event_month1 = EventFactory(user=user1_month1)
    Event.objects.filter(pk=event_month1.pk).update(created_at=month1_time)
    payment_month1 = PaymentFactory(user=user1_month1, event=event_month1, status='succeeded')
    Payment.objects.filter(pk=payment_month1.pk).update(created_at=month1_time)


def test_historical_summary_unauthorized(api_client, regular_user):
    api_client.force_authenticate(user=regular_user)
    url = reverse('data_management:historical-summary')
    response = api_client.get(url)
    assert response.status_code == 403

def test_historical_summary_authorized(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    setup_historical_data()
    
    url = reverse('data_management:historical-summary')
    response = api_client.get(url)
    
    assert response.status_code == 200
    assert isinstance(response.data, list)
    
    # The view returns data for the last 12 months + the current month.
    assert len(response.data) == 13

    data_map = {item['month']: item for item in response.data}
    
    today = timezone.now()
    month1_str = (today - relativedelta(months=1)).strftime('%Y-%m')
    month2_str = (today - relativedelta(months=2)).strftime('%Y-%m')

    # Assertions for Month 1
    assert month1_str in data_map
    assert data_map[month1_str]['users'] == 2
    assert data_map[month1_str]['events'] == 1
    assert data_map[month1_str]['payments'] == 1
    
    # Assertions for Month 2
    assert month2_str in data_map
    assert data_map[month2_str]['users'] == 1
    assert data_map[month2_str]['events'] == 3
    assert data_map[month2_str]['payments'] == 0
