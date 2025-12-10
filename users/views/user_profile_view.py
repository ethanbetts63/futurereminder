from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..serializers.user_profile_serializer import UserProfileSerializer

class UserProfileView(APIView):
    """
    API view for retrieving and updating the authenticated user's profile.
    Accessed via `/api/users/me/`.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return the profile of the currently authenticated user.
        """
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    def patch(self, request):
        """
        Update the profile of the currently authenticated user.
        """
        user = request.user
        # partial=True allows for partial updates (e.g., only sending the fields to be changed)
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
