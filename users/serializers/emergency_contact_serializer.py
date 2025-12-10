from rest_framework import serializers
from ..models.emergency_contact import EmergencyContact

class EmergencyContactSerializer(serializers.ModelSerializer):
    """
    Serializer for the EmergencyContact model for CRUD operations
    by an authenticated user.
    """
    class Meta:
        model = EmergencyContact
        fields = [
            'id',
            'first_name',
            'last_name',
            'phone',
            'email',
        ]
