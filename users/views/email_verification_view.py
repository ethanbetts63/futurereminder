from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import redirect
from rest_framework.views import APIView
from users.models import User
from django.conf import settings

class EmailVerificationView(APIView):
    """
    View to handle the email verification link clicked by the user.
    """
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
                user.save()
            
            # Redirect to a frontend page indicating success.
            return redirect(f"{settings.SITE_URL}/verification-success/")
        else:
            # Redirect to a frontend page indicating failure.
            return redirect(f"{settings.SITE_URL}/verification-failed/")
