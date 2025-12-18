# TODO: Remember to run `python manage.py makemigrations` and `python manage.py migrate` 
# to apply the new `password_reset_last_sent_at` field to the database.

from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from users.models import User
from users.utils.send_password_reset_email import send_password_reset_email
from users.serializers.password_reset_request_serializer import EmailSerializer

class PasswordResetRequestView(APIView):
    """
    Allows a user to request a password reset email.
    This view is public and includes rate limiting.
    """
    permission_classes = [AllowAny]
    serializer_class = EmailSerializer

    def post(self, request, *args, **kwargs):
        """
        Sends a password reset email if the user exists.
        Always returns a success response to prevent user enumeration.
        """
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            # Even if validation fails (e.g., malformed email), we return a generic message.
            # This is important to prevent leaking information.
            return Response(
                {"detail": "If an account with this email exists, a password reset link has been sent."},
                status=status.HTTP_200_OK
            )

        email = serializer.validated_data.get('email')
        
        try:
            user = User.objects.get(email__iexact=email, is_active=True)
            
            # --- Rate Limiting Logic ---
            if user.password_reset_last_sent_at:
                time_since_last_send = timezone.now() - user.password_reset_last_sent_at
                if time_since_last_send < timedelta(seconds=60):
                    # Even if rate-limited, we don't inform the user.
                    # We just silently don't send the email.
                    return Response(
                        {"detail": "If an account with this email exists, a password reset link has been sent."},
                        status=status.HTTP_200_OK
                    )
            
            # --- Send the email ---
            was_sent = send_password_reset_email(user)
            
            if was_sent:
                # Update the timestamp only on successful send
                user.password_reset_last_sent_at = timezone.now()
                user.save(update_fields=['password_reset_last_sent_at'])
                
        except User.DoesNotExist:
            # If the user does not exist, we do nothing.
            # The response below will be returned, same as a success case.
            pass
        except Exception as e:
            # Log the exception but do not expose it to the client
            print(f"An unexpected error occurred during password reset request: {e}")
            # Potentially use a more robust logging mechanism here
            pass

        return Response(
            {"detail": "If an account with this email exists, a password reset link has been sent."},
            status=status.HTTP_200_OK
        )
