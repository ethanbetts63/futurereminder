from rest_framework import serializers
from notifications.models import Notification

class AdminTaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification objects that represent admin tasks.
    
    Includes relevant details from the related event and user.
    """
    event_name = serializers.CharField(source='event.name', read_only=True)
    user_full_name = serializers.SerializerMethodField()
    channel_display = serializers.CharField(source='get_channel_display', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'scheduled_send_time',
            'channel_display',
            'recipient_contact_info',
            'event_name',
            'user_full_name',
        ]

    def get_user_full_name(self, obj):
        """
        Returns the user's full name, or their username if the name is not set.
        """
        user = obj.user
        if user.first_name and user.last_name:
            return f"{user.first_name} {user.last_name}"
        return user.username
