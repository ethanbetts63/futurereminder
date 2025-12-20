import pytest
from notifications.serializers.notification_serializer import AdminTaskSerializer
from notifications.tests.factories.notification_factory import NotificationFactory
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
def test_admin_task_serializer():
    """
    Tests that the AdminTaskSerializer correctly serializes a Notification object.
    """
    # Create a user with a full name for testing get_user_full_name
    user = UserFactory(first_name="John", last_name="Doe")
    
    # Create a notification linked to this user and a specific event
    notification = NotificationFactory(
        user=user,
        event__name="Test Event Name",
        channel='primary_email',  # Use a valid choice
        recipient_contact_info="test@example.com"
    )

    # Serialize the notification
    serializer = AdminTaskSerializer(instance=notification)
    
    # Expected data
    expected_data = {
        'id': notification.id,
        'scheduled_send_time': notification.scheduled_send_time.isoformat().replace('+00:00', 'Z'),
        'channel_display': 'Primary Email',  # Expect the display value
        'recipient_contact_info': 'test@example.com',
        'event_name': 'Test Event Name',
        'user_full_name': 'John Doe',
    }

    assert serializer.data == expected_data

@pytest.mark.django_db
def test_admin_task_serializer_username_fallback():
    """
    Tests that the serializer falls back to the username when first/last name are not present.
    """
    # Create a user without first_name and last_name
    user = UserFactory(first_name="", last_name="", username="testuser")
    
    notification = NotificationFactory(user=user)
    
    serializer = AdminTaskSerializer(instance=notification)
    
    assert serializer.data['user_full_name'] == 'testuser'