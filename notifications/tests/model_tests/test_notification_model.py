import pytest
from notifications.models import Notification
from notifications.tests.factories.notification_factory import NotificationFactory
from events.tests.factories.event_factory import EventFactory

@pytest.mark.django_db
def test_notification_creation():
    """
    Tests that a Notification instance can be created successfully.
    """
    notification = NotificationFactory()
    assert isinstance(notification, Notification)
    assert notification.event is not None
    assert notification.user is not None
    assert notification.scheduled_send_time is not None
    assert notification.channel is not None
    assert notification.status is not None

@pytest.mark.django_db
def test_notification_str_method():
    """
    Tests the __str__ method of the Notification model.
    """
    event = EventFactory(name="Test Event")
    notification = NotificationFactory(event=event)
    expected_str = f"Notification for {notification.event.name} to {notification.user.email} via {notification.get_channel_display()} on {notification.scheduled_send_time}"
    assert str(notification) == expected_str