from rest_framework import serializers
from events.models import Event

class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.
    Handles serialization for list, create, update, and delete operations.
    """
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    payment_details = serializers.SerializerMethodField()

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
            'payment_details',
        ]
        # The user should not be able to update these fields directly
        # 'user' is set automatically, and 'is_active' is controlled by payment status.
        read_only_fields = ['user', 'is_active', 'created_at', 'updated_at']

    def get_payment_details(self, obj):
        """
        Retrieves the amount and date of the most recent successful payment.
        """
        # An event should ideally have only one successful payment.
        # We order by most recent just in case of any edge cases.
        successful_payment = obj.payments.filter(status='succeeded').order_by('-created_at').first()
        
        if successful_payment:
            return {
                'amount': successful_payment.amount,
                'date': successful_payment.created_at
            }
        return None
