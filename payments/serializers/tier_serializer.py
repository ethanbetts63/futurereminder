# payments/serializers/tier_serializer.py
from rest_framework import serializers
from payments.models import Tier
from .price_serializer import PriceSerializer

class TierSerializer(serializers.ModelSerializer):
    prices = PriceSerializer(many=True, read_only=True)

    class Meta:
        model = Tier
        fields = ['id', 'name', 'description', 'prices']
