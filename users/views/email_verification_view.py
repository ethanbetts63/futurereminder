from django.utils import timezone
from datetime import timedelta
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.models import User
from django.conf import settings
from users.utils.send_verification_email import send_verification_email


class EmailVerificationView(APIView):
    """
    View to handle the email verification link clicked by the user.
    """
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token, *args, **kwargs):
        """
        Verifies the user's email address.
        """
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            if not user.is_email_verified:
                user.is_email_verified = True
                user.save(update_fields=['is_email_verified'])
            
            # Redirect to a frontend page indicating success.
            return redirect(f"{settings.SITE_URL}/verification-success/")
        else:
            # Redirect to a frontend page indicating failure.
            return redirect(f"{settings.SITE_URL}/verification-failed/")


class ResendVerificationView(APIView):
    """
    Allows a logged-in user to request a new verification email, with a rate limit.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Sends a new verification email to the currently authenticated user.
        """
        user = request.user
        if user.is_email_verified:
            return Response(
                {"detail": "This email has already been verified."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # --- Rate Limiting Logic ---
        if user.verification_email_last_sent_at:
            time_since_last_send = timezone.now() - user.verification_email_last_sent_at
            if time_since_last_send < timedelta(seconds=60):
                wait_time = 60 - int(time_since_last_send.total_seconds())
                return Response(
                    {"detail": f"Please wait {wait_time} more seconds before requesting another email."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS
                )

        # Re-send the verification email
        was_sent = send_verification_email(user)
        
        if was_sent:
            # Update the timestamp only on successful send
            user.verification_email_last_sent_at = timezone.now()
            user.save(update_fields=['verification_email_last_sent_at'])
            return Response(
                {"detail": "A new verification email has been sent to your primary email address."},
                status=status.HTTP_200_OK
            )
        else:
            # If the email failed to send, return a server error
            return Response(
                {"detail": "There was an error sending the verification email. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
