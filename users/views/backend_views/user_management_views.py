from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

class DeleteUserView(APIView):
    """
    View for authenticated users to delete their own account.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Handles the DELETE request to permanently delete the user's account.
        """
        user = request.user
        
        logger.info(f"Account deletion initiated for user: {user.email} (ID: {user.id}).")
        
        try:
            user.delete()
            logger.info(f"Successfully deleted account for former user ID: {user.id}.")
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            logger.error(
                f"Error during account deletion for user ID: {user.id}. Error: {str(e)}",
                exc_info=True
            )
            return Response(
                {"detail": "An unexpected error occurred while deleting your account. Please contact support."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
