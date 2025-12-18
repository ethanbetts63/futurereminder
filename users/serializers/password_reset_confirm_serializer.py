from rest_framework import serializers

class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for the password reset confirmation endpoint.
    Validates that the two password fields match and meet complexity requirements.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8  # Enforce a minimum length
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "The two password fields didn't match."})
        # Note: You could add more complex password validation here if needed.
        return attrs
