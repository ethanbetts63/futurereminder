from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny
from users.models import User

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

class PasswordResetConfirmView(APIView):
    """
    View to handle the actual password reset, after the user has clicked
    the link in their email.
    """
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, uidb64, token, *args, **kwargs):
        """
        Resets the user's password if the token is valid.
        """
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            # If the token is valid, set the new password
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response(
                {"detail": "Your password has been reset successfully. You can now log in with your new password."},
                status=status.HTTP_200_OK
            )
        else:
            # If the user or token is invalid, return an error
            return Response(
                {"detail": "This password reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST
            )
