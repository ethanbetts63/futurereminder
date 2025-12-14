# payments/serializers/price_serializer.py
from rest_framework import serializers
from payments.models import Price

class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = ['id', 'amount', 'currency', 'type']
