import pytest
from datetime import timedelta
from django.utils import timezone
from events.models import Notification
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.tier_factory import TierFactory
from users.tests.factories.user_factory import UserFactory

pytestmark = pytest.mark.django_db

@pytest.fixture
def base_time():
    """Provides a fixed, timezone-aware date for deterministic testing."""
    return timezone.make_aware(timezone.datetime(2025, 1, 1, 12, 0, 0))

def test_full_creation_flow(base_time):
    """
    Tests the 'happy path': creating an active event correctly generates 
    the full set of notifications from the tier's manifest.
    """
    # --- Arrange ---
    user = UserFactory()
    manifest = ['primary_email', 'primary_sms', 'backup_email']
    tier = TierFactory(manifest=manifest)
    
    # --- Act ---
    # EventFactory automatically calls .save(), triggering the scheduling logic.
    event = EventFactory(
        user=user,
        tier=tier,
        is_active=True,
        event_date=base_time.date() + timedelta(days=28),
        weeks_in_advance=3 # 21 days
    )

    # --- Assert ---
    notifications = Notification.objects.filter(event=event).order_by('scheduled_send_time')
    
    assert notifications.count() == 3
    assert [n.channel for n in notifications] == manifest

    # Check timing: 3 notifications over 21 days. Interval is 7 days.
    expected_day1 = event.notification_start_date
    expected_day2 = event.notification_start_date + timedelta(days=7)
    expected_day3 = event.notification_start_date + timedelta(days=14)

    assert notifications[0].scheduled_send_time.date() == expected_day1
    assert notifications[1].scheduled_send_time.date() == expected_day2
    assert notifications[2].scheduled_send_time.date() == expected_day3

def test_event_update_flow_regenerates_notifications(base_time):
    """
    Tests that updating an event (e.g., changing its tier) clears the old
    pending notifications and creates a new, correct schedule.
    """
    # --- Arrange ---
    user = UserFactory()
    tier_a = TierFactory(name="Tier A", manifest=['primary_email'])
    tier_b = TierFactory(name="Tier B", manifest=['primary_sms', 'backup_sms'])
    
    event = EventFactory(
        user=user,
        tier=tier_a,
        is_active=True,
        event_date=base_time.date() + timedelta(days=30)
    )

    # --- Act & Assert (Part 1) ---
    # Confirm the initial state is correct (1 notification for Tier A)
    assert Notification.objects.filter(event=event, status='pending').count() == 1
    
    # Now, update the event's tier
    event.tier = tier_b
    event.save() # This should trigger the cleanup and regeneration

    # --- Assert (Part 2) ---
    # The old notification for Tier A should be gone, and two new ones for Tier B created.
    notifications = Notification.objects.filter(event=event, status='pending').order_by('scheduled_send_time')
    
    assert notifications.count() == 2
    assert [n.channel for n in notifications] == ['primary_sms', 'backup_sms']

def test_activation_flow_creates_notifications(base_time):
    """
    Tests that notifications are only created when an event is activated,
    not upon initial creation if is_active=False.
    """
    # --- Arrange ---
    user = UserFactory()
    tier = TierFactory(manifest=['primary_email'])
    
    # --- Act & Assert (Part 1) ---
    # Create the event as inactive.
    event = EventFactory(
        user=user,
        tier=tier,
        is_active=False,
        event_date=base_time.date() + timedelta(days=30)
    )

    # Verify no notifications were created initially.
    assert Notification.objects.filter(event=event).count() == 0

    # --- Act (Part 2) ---
    # Now, activate the event and save it.
    event.is_active = True
    event.save()

    # --- Assert (Part 2) ---
    # Verify that the notification has now been created.
    assert Notification.objects.filter(event=event).count() == 1
    notification = Notification.objects.get(event=event)
    assert notification.channel == 'primary_email'
    assert notification.status == 'pending'
