import pytest
from payments.models import Tier
from payments.tests.factories.tier_factory import TierFactory

@pytest.mark.django_db
def test_tier_creation():
    """
    Tests that a Tier instance can be created successfully.
    """
    tier = TierFactory()
    assert isinstance(tier, Tier)
    assert tier.name is not None
    assert tier.description is not None
    assert tier.stripe_product_id is not None
    assert tier.is_active is not None

@pytest.mark.django_db
def test_tier_str_method():
    """
    Tests the __str__ method of the Tier model.
    """
    tier = TierFactory(name="Test Tier")
    assert str(tier) == "Test Tier"