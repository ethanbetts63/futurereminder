import pytest
from datetime import date, timedelta
from unittest.mock import patch
from django.core.exceptions import ValidationError
from events.models import Event
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.price_factory import PriceFactory

@pytest.mark.django_db
def test_event_creation():
    """
    Tests that an Event instance can be created successfully.
    """
    event = EventFactory()
    assert isinstance(event, Event)
    assert event.name is not None
    assert event.event_date is not None
    assert event.user is not None
    assert event.tier is not None

@patch('events.utils.schedule_notifications_for_event.schedule_notifications_for_event')
@pytest.mark.django_db
def test_save_calls_schedule_notifications(mock_schedule_func):
    """
    Tests that saving an Event instance calls the scheduling utility.
    This test uses a mock to isolate the save method's behavior.
    """
    event = EventFactory()
    
    # The event is created and saved by the factory.
    # Now, check if the mock was called.
    mock_schedule_func.assert_called_once_with(event)

@pytest.mark.django_db
def test_notification_start_date_calculation():
    """
    Tests that the notification_start_date is correctly calculated when an Event is saved.
    """
    event_date = date(2025, 12, 25)
    weeks_in_advance = 4
    expected_notification_start_date = event_date - timedelta(weeks=weeks_in_advance)

    event = EventFactory(
        event_date=event_date,
        weeks_in_advance=weeks_in_advance
    )

    assert event.notification_start_date == expected_notification_start_date

@pytest.mark.django_db
def test_active_paid_event_requires_payment():
    """
    Tests that a ValidationError is raised if an active event with a paid tier
    does not have a successful payment record.
    """
    # Create a paid tier
    price = PriceFactory(amount=10.00)
    tier = price.tier

    # Create an event with the paid tier
    event = EventFactory(tier=tier, is_active=False)

    # Try to activate the event without a payment
    with pytest.raises(ValidationError):
        event.is_active = True
        event.save()

@pytest.mark.django_db
def test_event_str_method():
    """
    Tests the __str__ method of the Event model.
    """
    event = EventFactory(name="Test Event", event_date=date(2025, 12, 25))
    expected_str = f"'Test Event' on 2025-12-25 for {event.user.username}"
    assert str(event) == expected_str