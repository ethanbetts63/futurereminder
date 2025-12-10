from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from events.models import Event
from events.serializers.event_serializer import EventSerializer
from api.serializers.event_creation_serializers import AuthenticatedEventCreateSerializer

class EventViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting events for an authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """
        Return the appropriate serializer class based on the action.
        - Use a simple serializer for creation.
        - Use the full serializer for other actions (list, retrieve, etc.).
        """
        if self.action == 'create':
            return AuthenticatedEventCreateSerializer
        return EventSerializer

    def get_queryset(self):
        """
        This view should only return events owned by the currently authenticated user.
        """
        return self.request.user.events.all()

    def perform_create(self, serializer):
        """
        The user is passed to the serializer context automatically.
        This method is kept for clarity but the logic is now handled
        within the serializer itself.
        """
        serializer.save() # The user will be injected via context