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
            'country_code',
            'phone',
            'backup_email',
            'secondary_backup_email',
            'backup_phone',
            'facebook_handle',
            'instagram_handle',
            'snapchat_handle',
            'x_handle',
            'is_staff',
            'is_superuser',
            'is_email_verified',
        ]
        read_only_fields = [
            'username', 
            'id', 
            'is_staff', 
            'is_superuser', 
            'is_email_verified'
        ]

    def validate_email(self, value):
        """
        Ensure the new email is not already in use by another user.
        """
        lower_email = value.lower()
        # The instance is available during updates
        if self.instance and self.instance.email == lower_email:
            return lower_email # No change, so it's valid
            
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return lower_email

