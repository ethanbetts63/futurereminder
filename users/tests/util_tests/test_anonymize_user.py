import pytest
from django.conf import settings
from users.utils.anonymize_user import anonymize_user
from users.utils.hash_value import hash_value
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory
from events.tests.factories.notification_factory import NotificationFactory
from events.models import Notification

@pytest.mark.django_db
def test_anonymize_user_full_process():
    """
    Tests the entire anonymize_user process, including the newly added
    logic for hashing recipient_contact_info on sent notifications.
    """
    # 1. Arrange
    # Create a user with some PII
    user = UserFactory(
        first_name="John",
        email="test@example.com",
        phone="1234567890"
    )
    event = EventFactory(user=user)
    
    # Create notifications for this user
    pending_notification = NotificationFactory(user=user, event=event, status='pending')
    
    sent_notification = NotificationFactory(
        user=user, 
        event=event, 
        status='sent', 
        recipient_contact_info="test@example.com"
    )
    
    failed_notification = NotificationFactory(
        user=user,
        event=event,
        status='failed',
        recipient_contact_info="1234567890"
    )

    # 2. Act
    anonymize_user(user)

    # 3. Assert
    # Assert pending notification was deleted
    with pytest.raises(Notification.DoesNotExist):
        Notification.objects.get(pk=pending_notification.pk)

    # Assert sent notifications had their PII hashed
    sent_notification.refresh_from_db()
    failed_notification.refresh_from_db()
    
    salt = getattr(settings, 'HASHING_SALT')
    assert sent_notification.recipient_contact_info == hash_value("test@example.com", salt)
    assert failed_notification.recipient_contact_info == hash_value("1234567890", salt)

    # Assert user's own PII was wiped and they are inactive
    user.refresh_from_db()
    assert user.is_active is False
    assert user.first_name == ""
    assert user.phone == ""
    assert user.email == f"deleted_{user.pk}@deleted.com"
    assert user.hash_first_name == hash_value("John", salt)
