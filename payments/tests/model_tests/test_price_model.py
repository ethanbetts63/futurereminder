import pytest
from payments.models import Price
from payments.tests.factories.price_factory import PriceFactory
from payments.tests.factories.tier_factory import TierFactory
import decimal

@pytest.mark.django_db
def test_price_creation():
    """
    Tests that a Price instance can be created successfully.
    """
    price = PriceFactory()
    assert isinstance(price, Price)
    assert price.tier is not None
    assert price.stripe_price_id is not None
    assert price.amount is not None
    assert price.currency is not None
    assert price.type is not None
    assert price.is_active is not None

@pytest.mark.django_db
def test_price_str_method_one_time():
    """
    Tests the __str__ method of the Price model for a one-time price.
    """
    tier = TierFactory(name="Test Tier")
    price = PriceFactory(tier=tier, amount=decimal.Decimal('10.00'), type='one_time')
    expected_str = f"Test Tier - ${price.amount} (One-Time)"
    assert str(price) == expected_str

@pytest.mark.django_db
def test_price_str_method_recurring():
    """
    Tests the __str__ method of the Price model for a recurring price.
    """
    tier = TierFactory(name="Test Tier")
    price = PriceFactory(tier=tier, amount=decimal.Decimal('10.00'), type='recurring', recurring_interval='month')
    expected_str = f"Test Tier - ${price.amount}/{price.recurring_interval}"
    assert str(price) == expected_str
