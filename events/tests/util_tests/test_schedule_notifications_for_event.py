import pytest
from datetime import date, timedelta
from events.models import Notification
from events.utils.schedule_notifications_for_event import TIER_MANIFESTS
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.tier_factory import TierFactory
from users.tests.factories.user_factory import UserFactory

pytestmark = pytest.mark.django_db

@pytest.fixture
def free_tier():
    return TierFactory(name='Free')

@pytest.fixture
def standard_tier():
    return TierFactory(name='Standard')

@pytest.fixture
def premium_tier():
    return TierFactory(name='Premium')

def test_schedule_for_inactive_event(free_tier):
    """
    Tests that no notifications are created for an inactive event.
    The schedule function is called via the model's save() method.
    """
    EventFactory(is_active=False, tier=free_tier)
    assert Notification.objects.count() == 0

def test_schedule_for_event_with_no_tier():
    """
    Tests that no notifications are created if the event has no tier.
    """
    EventFactory(is_active=True, tier=None)
    assert Notification.objects.count() == 0

def test_schedule_for_event_with_invalid_dates(premium_tier):
    """
    Tests that no notifications are created if the start date is on or after the event date.
    Here, we achieve this by setting weeks_in_advance to 0.
    """
    event = EventFactory(
        is_active=True,
        tier=premium_tier,
        event_date=date.today() + timedelta(days=10),
        weeks_in_advance=0
    )
    assert event.notification_start_date == event.event_date
    assert Notification.objects.count() == 0

def test_free_tier_schedule(free_tier):
    """
    Tests the notification schedule generation for a Free tier event.
    """
    weeks_in_advance = 2
    event_date = date(2025, 1, 15)
    expected_start_date = event_date - timedelta(weeks=weeks_in_advance) # 2025-01-01

    event = EventFactory(
        is_active=True,
        tier=free_tier,
        event_date=event_date,
        weeks_in_advance=weeks_in_advance
    )

    assert event.notification_start_date == expected_start_date
    
    notifications = Notification.objects.filter(event=event).order_by('scheduled_send_time')
    manifest = TIER_MANIFESTS['Free']
    assert notifications.count() == len(manifest)
    
    total_duration = event.event_date - event.notification_start_date
    interval = total_duration / len(manifest) # 14 days / 2 = 7 days

    assert notifications[0].channel == manifest[0]
    assert notifications[0].scheduled_send_time.date() == expected_start_date
    
    assert notifications[1].channel == manifest[1]
    assert notifications[1].scheduled_send_time.date() == expected_start_date + interval

def test_standard_tier_schedule(standard_tier):
    """
    Tests the notification schedule generation for a Standard tier event.
    """
    weeks_in_advance = 5
    event_date = date(2025, 2, 25)
    expected_start_date = event_date - timedelta(weeks=weeks_in_advance) # 2025-01-21

    event = EventFactory(
        is_active=True,
        tier=standard_tier,
        event_date=event_date,
        weeks_in_advance=weeks_in_advance
    )
    
    assert event.notification_start_date == expected_start_date

    notifications = Notification.objects.filter(event=event).order_by('scheduled_send_time')
    manifest = TIER_MANIFESTS['Standard']
    assert notifications.count() == len(manifest)
    
    total_duration = event.event_date - event.notification_start_date # 35 days
    interval = total_duration / len(manifest) # 35 / 5 = 7 days

    for i, notification in enumerate(notifications):
        assert notification.channel == manifest[i]
        assert notification.scheduled_send_time.date() == expected_start_date + (interval * i)

def test_premium_tier_schedule(premium_tier):
    """
    Tests the notification schedule generation for a Premium tier event.
    """
    weeks_in_advance = 1
    event_date = date(2025, 1, 10)
    expected_start_date = event_date - timedelta(weeks=weeks_in_advance) # 2025-01-03

    event = EventFactory(
        is_active=True,
        tier=premium_tier,
        event_date=event_date,
        weeks_in_advance=weeks_in_advance
    )
    
    assert event.notification_start_date == expected_start_date

    notifications = Notification.objects.filter(event=event).order_by('scheduled_send_time')
    manifest = TIER_MANIFESTS['Premium']
    assert notifications.count() == len(manifest)
    
    total_duration = event.event_date - event.notification_start_date # 7 days
    interval = total_duration / len(manifest) # 7 days / 9 notifications is < 1 day

    for i, notification in enumerate(notifications):
        assert notification.channel == manifest[i]
        expected_date = expected_start_date + (interval * i)
        assert notification.scheduled_send_time.date() == expected_date

def test_schedule_clears_old_notifications_on_update(free_tier, premium_tier):
    """
    Tests that updating an event clears the old schedule and creates a new one.
    """
    event = EventFactory(is_active=True, tier=free_tier)
    
    # Initial creation (triggers schedule_notifications_for_event via save)
    assert Notification.objects.filter(event=event).count() == len(TIER_MANIFESTS['Free'])
    
    # Update the tier and save again
    event.tier = premium_tier
    event.save()
    
    # Assert that the old notifications are gone and the new schedule is in place
    assert Notification.objects.filter(event=event).count() == len(TIER_MANIFESTS['Premium'])
    assert Notification.objects.filter(event=event, channel='primary_sms').exists() # a channel only in premium

