# payments/tests/view_tests/test_tier_list_view.py
import pytest
from rest_framework.test import APIClient
from payments.tests.factories.tier_factory import TierFactory

@pytest.mark.django_db
class TestTierListView:
    def setup_method(self):
        self.client = APIClient()

    def test_list_active_tiers(self):
        """
        Tests that the view returns a list of active tiers.
        """
        # Create active and inactive tiers
        TierFactory.create_batch(3, is_active=True)
        TierFactory(is_active=False)

        response = self.client.get('/api/payments/tiers/')

        assert response.status_code == 200
        assert len(response.data) == 3

    def test_list_no_active_tiers(self):
        """
        Tests that the view returns an empty list when there are no active tiers.
        """
        TierFactory(is_active=False)

        response = self.client.get('/api/payments/tiers/')

        assert response.status_code == 200
        assert len(response.data) == 0
