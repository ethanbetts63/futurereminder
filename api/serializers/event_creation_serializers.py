from rest_framework import serializers
from django.contrib.auth import get_user_model
from events.models import Event
from payments.models import Tier

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
        
        # Find the default free tier to assign to all new events
        try:
            free_tier = Tier.objects.get(name="Automated")
        except Tier.DoesNotExist:
            # This is a critical server configuration error if the default tier is missing.
            raise serializers.ValidationError({
                "error": "The default 'Automated' tier could not be found. Please contact support."
            })

        # Create the event and assign the default tier
        event = Event.objects.create(user=user, tier=free_tier, **validated_data)
        return event