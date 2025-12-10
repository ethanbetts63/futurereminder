from rest_framework import generics, permissions
from api.serializers.event_creation_serializers import (
    AuthenticatedEventCreateSerializer,
)

class AuthenticatedEventCreateView(generics.CreateAPIView):
    """
    An endpoint for authenticated users to create a new event.
    Requires authentication.
    """
    serializer_class = AuthenticatedEventCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    # The user is automatically passed to the serializer context by CreateAPIView
    # and associated with the event in the serializer's create method.
