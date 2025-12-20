# payments/tests/serializer_tests/test_price_serializer.py
import pytest
from payments.serializers.price_serializer import PriceSerializer
from payments.tests.factories.price_factory import PriceFactory

@pytest.mark.django_db
def test_price_serializer():
    """
    Tests that the PriceSerializer correctly serializes a Price object.
    """
    price = PriceFactory()
    serializer = PriceSerializer(instance=price)

    expected_data = {
        'id': price.id,
        'amount': f'{price.amount:.2f}', # API should serialize decimals as strings
        'currency': price.currency,
        'type': price.type,
    }

    assert serializer.data == expected_data
