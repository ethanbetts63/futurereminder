import pytest
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from events.serializers.event_creation_serializers import AuthenticatedEventCreateSerializer
from events.tests.factories.event_factory import EventFactory
from users.tests.factories.user_factory import UserFactory
from payments.tests.factories.tier_factory import TierFactory

User = get_user_model()


@pytest.mark.django_db
class TestAuthenticatedEventCreateSerializer:
    def test_create_event_authenticated(self, drf_request_factory):
        """
        Tests that an authenticated user can create an event.
        """
        user = UserFactory()
        TierFactory(name="Automated")  # Ensure the default tier exists
        request = drf_request_factory(user=user)

        event_data = {
            "name": "Test Event",
            "event_date": "2025-12-25",
            "notes": "Test notes",
            "weeks_in_advance": 4,
        }

        serializer = AuthenticatedEventCreateSerializer(
            data=event_data,
            context={"request": request}
        )

        assert serializer.is_valid(raise_exception=True)
        event = serializer.save()

        assert event.user == user
        assert event.name == event_data["name"]
        assert str(event.event_date) == event_data["event_date"]
        assert event.notes == event_data["notes"]
        assert event.weeks_in_advance == event_data["weeks_in_advance"]
        assert event.tier.name == "Automated"

    def test_create_event_missing_tier_raises_error(self, drf_request_factory):
        """
        Tests that a validation error is raised if the default 'Automated' tier is missing.
        """
        user = UserFactory()
        request = drf_request_factory(user=user)

        event_data = {
            "name": "Test Event",
            "event_date": "2025-12-25",
        }

        serializer = AuthenticatedEventCreateSerializer(
            data=event_data,
            context={"request": request}
        )

        with pytest.raises(ValidationError) as excinfo:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        
        assert "The default 'Automated' tier could not be found." in str(excinfo.value)