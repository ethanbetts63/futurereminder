from rest_framework.permissions import AllowAny
from django.core.signing import Signer, BadSignature
from django.shortcuts import redirect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import BlockedEmail

signer = Signer()

from rest_framework.permissions import AllowAny

class AddToBlocklistView(APIView):
    """
    View to handle the blocklist link clicked by a user in an email.
    """
    permission_classes = [AllowAny]

    def get(self, request, signed_email, *args, **kwargs):
        """
        Verifies the signature and adds the email to the blocklist.
        """
        try:
            email = signer.unsign(signed_email)
        except BadSignature:
            # This could be a generic "invalid link" page in the future
            return Response(
                {"detail": "Invalid block link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use get_or_create to handle cases where the user clicks the link multiple times.
        blocked_email, created = BlockedEmail.objects.get_or_create(email=email)

        if created:
            # Log that a new email was blocked
            print(f"Email '{email}' has been added to the blocklist.")
        
        # In the future, this could be a dedicated frontend page.
        # For now, a simple message is sufficient.
        return redirect(f"{settings.SITE_URL}/blocklist-success/")
