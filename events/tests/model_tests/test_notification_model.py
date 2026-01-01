import pytest
from django.conf import settings
from django.utils import timezone
from events.models import Event, Notification
from payments.models import Tier
from users.models import User
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

def test_social_media_notification_creates_admin_tasks_on_save(admin_user, admin_task_tier, user_with_socials):
    """
    Tests that saving a 'social_media' notification correctly triggers the creation
    of admin tasks and updates the notification's status.
    """
    # Arrange
    event = EventFactory(user=user_with_socials)

    # Act
    notification = Notification.objects.create(
        event=event,
        user=user_with_socials,
        channel='social_media',
        scheduled_send_time=timezone.now() + timezone.timedelta(days=10)
    )

    # Assert
    # Refetch from DB to ensure we have the version with the updated status
    notification.refresh_from_db() 
    
    assert notification.status == 'admin_task_created'
    assert "Successfully generated 2 admin task(s)" in notification.failure_reason
    
    admin_events = Event.objects.filter(user=admin_user)
    assert admin_events.count() == 2
    assert admin_events.first().tier == admin_task_tier

def test_non_social_media_notification_does_not_create_tasks(admin_user, admin_task_tier, user_with_socials):
    """
    Tests that saving a notification for a different channel does not trigger the
    admin task creation logic.
    """
    # Arrange
    event = EventFactory(user=user_with_socials)

    # Act
    notification = Notification.objects.create(
        event=event,
        user=user_with_socials,
        channel='primary_email', # Not a social_media channel
        scheduled_send_time=timezone.now() + timezone.timedelta(days=10)
    )

    # Assert
    assert notification.status == 'pending' # Should remain the default
    assert not Event.objects.filter(user=admin_user).exists()

def test_failed_admin_task_creation_updates_status(user_with_socials):
    """
    Tests that if the admin task creation fails (e.g., admin user doesn't exist),
    the notification status is set to 'failed'.
    """
    # Arrange - an admin user and tier are NOT created for this test
    event = EventFactory(user=user_with_socials)

    # Act
    notification = Notification.objects.create(
        event=event,
        user=user_with_socials,
        channel='social_media',
        scheduled_send_time=timezone.now() + timezone.timedelta(days=10)
    )

    # Assert
    notification.refresh_from_db()
    assert notification.status == 'failed'
    assert "Failed to create admin tasks" in notification.failure_reason
