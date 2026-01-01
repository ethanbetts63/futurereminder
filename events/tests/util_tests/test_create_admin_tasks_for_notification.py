import pytest
from django.conf import settings
from django.utils import timezone
from events.models import Event, Notification
from payments.models import Tier
from users.models import User
from events.utils.create_admin_tasks_for_notification import create_admin_tasks_for_notification
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.tier_factory import TierFactory

pytestmark = pytest.mark.django_db

@pytest.fixture
def admin_user():
    """Fixture to create the admin user."""
    return User.objects.create_user(
        username=settings.ADMIN_EMAIL,
        email=settings.ADMIN_EMAIL,
        is_staff=True
    )

@pytest.fixture
def admin_task_tier():
    """Fixture to create the 'Admin Task' tier."""
    return Tier.objects.create(
        name="Admin Task",
        manifest=['primary_email']
    )

@pytest.fixture
def user_with_socials():
    """Fixture for a user with social media handles."""
    return UserFactory(
        facebook_handle="test_fb",
        x_handle="test_x",
        instagram_handle=None,
        snapchat_handle=None
    )

@pytest.fixture
def notification_with_socials(user_with_socials):
    """Fixture for a social media notification."""
    event = EventFactory(user=user_with_socials)
    return Notification.objects.create(
        event=event,
        user=user_with_socials,
        channel='social_media',
        scheduled_send_time=timezone.now() + timezone.timedelta(days=10)
    )

def test_create_admin_tasks_success(admin_user, admin_task_tier, notification_with_socials):
    """
    Tests that admin task events are created successfully when a user has social media handles.
    """
    # Arrange: Clean up any potential state leaked from other tests
    Event.objects.filter(user=admin_user).delete()

    # Act
    tasks_created = create_admin_tasks_for_notification(notification_with_socials)

    # Assert
    assert tasks_created == 2
    
    admin_events = Event.objects.filter(user=admin_user)
    assert admin_events.count() == 2

    # Check the details of one of the created events
    first_admin_event = admin_events.first()
    assert first_admin_event.tier == admin_task_tier
    assert "Manual Post for" in first_admin_event.name
    assert "Original User:" in first_admin_event.notes
    assert "Platform: Facebook" in first_admin_event.notes or "Platform: X (Twitter)" in first_admin_event.notes
    
    # Check that event_date and weeks_in_advance are set correctly
    assert first_admin_event.event_date == notification_with_socials.scheduled_send_time.date()
    assert first_admin_event.weeks_in_advance == 1

def test_create_admin_tasks_no_handles(admin_user, admin_task_tier):
    """
    Tests that no admin tasks are created if the user has no social media handles.
    """
    # Arrange
    user_no_socials = UserFactory(
        facebook_handle=None,
        instagram_handle=None,
        snapchat_handle=None,
        x_handle=None
    )
    event = EventFactory(user=user_no_socials)
    notification = Notification.objects.create(
        event=event,
        user=user_no_socials,
        channel='social_media',
        scheduled_send_time=timezone.now()
    )
    # Act
    tasks_created = create_admin_tasks_for_notification(notification)

    # Assert
    assert tasks_created == 0
    assert not Event.objects.filter(user=admin_user).exists()

def test_missing_admin_user_raises_error(admin_task_tier, notification_with_socials):
    """
    Tests that an exception is raised if the admin user does not exist.
    """
    with pytest.raises(User.DoesNotExist):
        create_admin_tasks_for_notification(notification_with_socials)

def test_missing_admin_tier_raises_error(admin_user, notification_with_socials):
    """
    Tests that an exception is raised if the 'Admin Task' tier does not exist.
    """
    with pytest.raises(Tier.DoesNotExist):
        create_admin_tasks_for_notification(notification_with_socials)
