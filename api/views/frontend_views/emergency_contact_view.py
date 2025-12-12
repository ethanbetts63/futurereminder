from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from users.models.emergency_contact import EmergencyContact
from users.serializers.emergency_contact_serializer import EmergencyContactSerializer

class EmergencyContactViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting
    a user's emergency contacts.
    """
    serializer_class = EmergencyContactSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should only return contacts for the currently authenticated user.
        """
        return self.request.user.emergency_contacts.all()

    def perform_create(self, serializer):
        """
        Automatically assign the current user to the contact upon creation.
        """
        serializer.save(user=self.request.user)
