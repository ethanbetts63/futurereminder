# payments/serializers/tier_serializer.py
from rest_framework import serializers
from payments.models import Tier, Price

class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ['id', 'amount', 'currency', 'type']

class TierSerializer(serializers.ModelSerializer):
    prices = PriceSerializer(many=True, read_only=True)

    class Meta:
        model = Tier
        fields = ['id', 'name', 'description', 'prices']
