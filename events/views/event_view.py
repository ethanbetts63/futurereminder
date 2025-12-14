from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
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
        We will relax the payment status check here to allow viewing of pending events.
        """
        return self.request.user.events.all()

    def perform_create(self, serializer):
        """
        The user is passed to the serializer context automatically.
        This method is kept for clarity but the logic is now handled
        within the serializer itself.
        """
        serializer.save() # The user will be injected via context

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """
        Custom action to activate an event, intended for free-tier events.
        """
        event = self.get_object()

        if not event.tier:
            return Response(
                {'error': 'Event does not have a tier associated with it.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Security check: Ensure the tier is actually free.
        is_free_tier = not event.tier.prices.filter(
            is_active=True,
            type='one_time',
            amount__gt=0
        ).exists()

        if not is_free_tier:
            return Response(
                {'error': 'This action is only allowed for free-tier events.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if event.is_active:
            return Response(
                {'message': 'Event is already active.'},
                status=status.HTTP_200_OK
            )

        event.is_active = True
        event.save()
        
        serializer = self.get_serializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)