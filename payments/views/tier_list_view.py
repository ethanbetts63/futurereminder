# payments/views/tier_list_view.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from payments.models import Tier
from ..serializers.tier_serializer import TierSerializer

class TierListView(generics.ListAPIView):
    """
    Provides a list of all active pricing tiers.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TierSerializer
    queryset = Tier.objects.filter(is_active=True).prefetch_related('prices')
