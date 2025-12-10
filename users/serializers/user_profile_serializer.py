from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, focused on profile data that a
    user is allowed to view and edit.
    """
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'backup_phone',
            'backup_email',
            'facebook_handle',
            'instagram_handle',
            'snapchat_handle',
            'x_handle',
        ]
        # The username should not be changed after creation.
        read_only_fields = ['username', 'id']
