from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class BlocklistSuccessView(APIView):
    """
    A simple view to show a generic success message.
    This is what the AddToBlocklistView redirects to.
    """
    def get(self, request, *args, **kwargs):
        # This will be routed on the frontend to a simple page.
        # This approach avoids needing a template here.
        # For now, this is just a placeholder to make the redirect work.
        # The actual content will be a new React component.
        return Response({}, status=status.HTTP_200_OK)
