# payments/tests/view_tests/test_create_payment_intent_view.py
import pytest
from rest_framework.test import APIClient
import stripe
from users.tests.factories.user_factory import UserFactory
from payments.tests.factories.tier_factory import TierFactory
from payments.tests.factories.price_factory import PriceFactory
from events.tests.factories.event_factory import EventFactory
from payments.models import Payment

@pytest.mark.django_db
class TestCreatePaymentIntentView:

    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.tier = TierFactory()
        self.price = PriceFactory(tier=self.tier, amount=10.00)
        self.event = EventFactory(user=self.user)

    def test_create_payment_intent_success(self, mocker):
        """
        Tests successful creation of a payment intent.
        """
        mock_payment_intent = mocker.MagicMock()
        mock_payment_intent.id = 'pi_123'
        mock_payment_intent.client_secret = 'cs_123'
        mocker.patch.object(stripe.PaymentIntent, 'create', return_value=mock_payment_intent)

        data = {
            'event_id': self.event.id,
            'target_tier_id': self.tier.id,
        }
        response = self.client.post('/api/payments/create-payment-intent/', data, format='json')

        assert response.status_code == 200
        assert response.data['clientSecret'] == 'cs_123'
        assert Payment.objects.count() == 1
        payment = Payment.objects.first()
        assert payment.user == self.user
        assert payment.event == self.event
        assert payment.price == self.price
        assert payment.stripe_payment_intent_id == 'pi_123'
        assert payment.status == 'pending'

    def test_create_payment_intent_unauthenticated(self):
        self.client.logout()
        data = {
            'event_id': self.event.id,
            'target_tier_id': self.tier.id,
        }
        response = self.client.post('/api/payments/create-payment-intent/', data, format='json')
        assert response.status_code == 401

    def test_missing_parameters(self):
        response = self.client.post('/api/payments/create-payment-intent/', {}, format='json')
        assert response.status_code == 400
        assert "event_id and target_tier_id are required" in response.data['error']

    def test_event_not_found(self):
        other_user_event = EventFactory()
        data = {
            'event_id': other_user_event.id,
            'target_tier_id': self.tier.id,
        }
        response = self.client.post('/api/payments/create-payment-intent/', data, format='json')
        assert response.status_code == 404

    def test_no_active_price(self):
        tier_no_price = TierFactory()
        data = {
            'event_id': self.event.id,
            'target_tier_id': tier_no_price.id,
        }
        response = self.client.post('/api/payments/create-payment-intent/', data, format='json')
        assert response.status_code == 400
        assert "No active, paid, one-time price could be found" in response.data['error']

    def test_stripe_api_error(self, mocker):
        mocker.patch.object(stripe.PaymentIntent, 'create', side_effect=stripe.error.StripeError("Stripe Error"))
        data = {
            'event_id': self.event.id,
            'target_tier_id': self.tier.id,
        }
        response = self.client.post('/api/payments/create-payment-intent/', data, format='json')
        assert response.status_code == 500
        assert "Stripe Error" in response.data['error']
