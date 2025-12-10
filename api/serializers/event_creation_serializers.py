from rest_framework import serializers
from django.contrib.auth import get_user_model
from events.models import Event

User = get_user_model()


# --- Serializer for the AUTHENTICATED flow ---

class AuthenticatedEventCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for authenticated users to create an event.
    The user is inferred from the request context.
    """
    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'event_date',
            'notes',
            'weeks_in_advance',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        user = self.context['request'].user
        event = Event.objects.create(user=user, **validated_data)
        return event