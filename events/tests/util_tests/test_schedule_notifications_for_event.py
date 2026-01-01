import pytest
from datetime import timedelta, time
from django.utils import timezone
from unittest.mock import patch
from events.models import Notification
from events.utils.schedule_notifications_for_event import schedule_notifications_for_event
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.tier_factory import TierFactory

pytestmark = pytest.mark.django_db


@pytest.fixture
def base_time():
    # Use a fixed, timezone-aware date for deterministic testing
    return timezone.make_aware(timezone.datetime(2025, 1, 1, 12, 0, 0))


def test_happy_path_creates_correct_notifications(base_time):
    """
    Tests that the function creates the correct number and sequence of notifications.
    """
    manifest = ['primary_email', 'primary_sms', 'backup_email']
    tier = TierFactory(manifest=manifest)
    event = EventFactory(
        is_active=True,
        tier=tier,
        event_date=base_time.date() + timedelta(days=30),
        weeks_in_advance=4 # approx 28 days
    )
    
    # event.notification_start_date is 2025-01-03
    
    schedule_notifications_for_event(event)

    notifications = Notification.objects.filter(event=event).order_by('scheduled_send_time')
    
    assert notifications.count() == 3
    assert [n.channel for n in notifications] == manifest

    # Check timing: 3 notifications over 28 days. Interval is ~9.33 days.
    # Notif 1: Jan 3 (start_date + 0 * interval)
    # Notif 2: Jan 12 (start_date + 1 * interval)
    # Notif 3: Jan 21 (start_date + 2 * interval)
    expected_day1 = event.notification_start_date
    expected_day2 = event.notification_start_date + timedelta(days=9)
    expected_day3 = event.notification_start_date + timedelta(days=18)

    assert notifications[0].scheduled_send_time.date() == expected_day1
    assert notifications[1].scheduled_send_time.date() == expected_day2
    assert notifications[2].scheduled_send_time.date() == expected_day3


def test_cleanup_deletes_pending_notifications(base_time):
    """
    Tests that any pre-existing 'pending' notifications are cleared.
    """
    tier = TierFactory(manifest=['primary_email'])
    event = EventFactory(is_active=True, tier=tier, event_date=base_time.date() + timedelta(days=10))

    # Manually create a pending notification that should be deleted
    stale_notification = Notification.objects.create(
        event=event,
        user=event.user,
        channel='primary_sms',
        status='pending',
        scheduled_send_time=base_time
    )

    # Manually create a non-pending notification that should NOT be deleted
    sent_notification = Notification.objects.create(
        event=event,
        user=event.user,
        channel='primary_email',
        status='sent',
        scheduled_send_time=base_time - timedelta(days=1)
    )

    schedule_notifications_for_event(event)

    # The stale 'pending' notification should be gone
    assert not Notification.objects.filter(pk=stale_notification.pk).exists()
    # The 'sent' notification should remain
    assert Notification.objects.filter(pk=sent_notification.pk).exists()
    # A new notification from the manifest should be created
    assert Notification.objects.filter(event=event, status='pending').count() == 1


def test_does_nothing_for_inactive_event(base_time):
    """
    Tests that no notifications are scheduled for an event with is_active=False.
    """
    tier = TierFactory(manifest=['primary_email'])
    event = EventFactory(is_active=False, tier=tier, event_date=base_time.date())

    schedule_notifications_for_event(event)

    assert Notification.objects.filter(event=event).count() == 0


def test_does_nothing_for_event_without_tier(base_time):
    """
    Tests that no notifications are scheduled for an event with tier=None.
    """
    event = EventFactory(is_active=True, tier=None, event_date=base_time.date())

    schedule_notifications_for_event(event)
    
    assert Notification.objects.filter(event=event).count() == 0


def test_handles_empty_manifest(base_time):
    """
    Tests that the function runs without error and creates no notifications
    for a tier with an empty manifest.
    """
    tier = TierFactory(manifest=[])
    event = EventFactory(is_active=True, tier=tier, event_date=base_time.date())
    
    schedule_notifications_for_event(event)

    assert Notification.objects.filter(event=event).count() == 0


def test_handles_single_item_manifest(base_time):
    """
    Tests that a single-item manifest schedules one notification on the start date.
    """
    tier = TierFactory(manifest=['primary_email'])
    event = EventFactory(
        is_active=True,
        tier=tier,
        event_date=base_time.date() + timedelta(days=10),
        weeks_in_advance=1
    )
    # notification_start_date should be 10 days - 7 days = 3 days from base_time
    
    schedule_notifications_for_event(event)
    
    notifications = Notification.objects.filter(event=event)
    assert notifications.count() == 1
    
    notification = notifications.first()
    assert notification.channel == 'primary_email'
    assert notification.scheduled_send_time.date() == event.notification_start_date