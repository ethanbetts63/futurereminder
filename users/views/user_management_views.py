from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.utils.anonymize_user import anonymize_user

class DeleteUserView(APIView):
    """
    View for authenticated users to delete their own account.
    This process is destructive and anonymizes user data.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Handles the DELETE request to anonymize and deactivate the user's account.
        """
        user = request.user
        
        try:
            anonymize_user(user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            # Optionally, you could print the error for debugging purposes
            # print(f"Error during account anonymization: {str(e)}")
            return Response(
                {"detail": "An unexpected error occurred while deleting your account. Please contact support."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
