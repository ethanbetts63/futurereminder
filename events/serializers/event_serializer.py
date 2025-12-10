from rest_framework import serializers
from events.models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.
    Handles serialization for list, create, update, and delete operations.
    """
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'name',
            'event_date',
            'notes',
            'weeks_in_advance',
            'user',
            'is_active',
            'created_at',
            'updated_at',
        ]
        # The user should not be able to update these fields directly
        # 'user' is set automatically, and 'is_active' is controlled by payment status.
        read_only_fields = ['user', 'is_active', 'created_at', 'updated_at']

