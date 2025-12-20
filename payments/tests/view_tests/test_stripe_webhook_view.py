# payments/tests/view_tests/test_stripe_webhook_view.py
import pytest
import json
from rest_framework.test import APIClient
import stripe
from users.tests.factories.user_factory import UserFactory
from payments.tests.factories.tier_factory import TierFactory
from payments.tests.factories.price_factory import PriceFactory
from events.tests.factories.event_factory import EventFactory
from payments.tests.factories.payment_factory import PaymentFactory

@pytest.mark.django_db
class TestStripeWebhookView:

    def setup_method(self):
        self.client = APIClient()

    def _get_webhook_event(self, event_type, payment_intent_id, target_tier_id=None):
        event = {
            'type': event_type,
            'data': {
                'object': {
                    'id': payment_intent_id,
                    'object': 'payment_intent',
                    'metadata': {},
                }
            }
        }
        if target_tier_id:
            event['data']['object']['metadata']['target_tier_id'] = str(target_tier_id)
        return event

    def test_webhook_success(self, mocker):
        tier = TierFactory()
        event = EventFactory()
        payment = PaymentFactory(event=event, stripe_payment_intent_id='pi_123', status='pending')
        
        webhook_event = self._get_webhook_event('payment_intent.succeeded', 'pi_123', tier.id)
        mocker.patch.object(stripe.Webhook, 'construct_event', return_value=webhook_event)

        response = self.client.post('/api/payments/webhook/', data=json.dumps(webhook_event), content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')

        assert response.status_code == 200
        payment.refresh_from_db()
        assert payment.status == 'succeeded'
        event.refresh_from_db()
        assert event.tier == tier
        assert event.is_active is True

    def test_webhook_payment_failed(self, mocker):
        payment = PaymentFactory(stripe_payment_intent_id='pi_456', status='pending')
        
        webhook_event = self._get_webhook_event('payment_intent.payment_failed', 'pi_456')
        mocker.patch.object(stripe.Webhook, 'construct_event', return_value=webhook_event)

        response = self.client.post('/api/payments/webhook/', data=json.dumps(webhook_event), content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')

        assert response.status_code == 200
        payment.refresh_from_db()
        assert payment.status == 'failed'

    def test_invalid_signature(self, mocker):
        mocker.patch.object(stripe.Webhook, 'construct_event', side_effect=stripe.error.SignatureVerificationError('bad sig', 'sig_123'))
        response = self.client.post('/api/payments/webhook/', data='{}', content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')
        assert response.status_code == 400

    def test_invalid_payload(self, mocker):
        mocker.patch.object(stripe.Webhook, 'construct_event', side_effect=ValueError)
        response = self.client.post('/api/payments/webhook/', data='{}', content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')
        assert response.status_code == 400

    def test_payment_not_found(self, mocker):
        webhook_event = self._get_webhook_event('payment_intent.succeeded', 'pi_nonexistent')
        mocker.patch.object(stripe.Webhook, 'construct_event', return_value=webhook_event)
        
        response = self.client.post('/api/payments/webhook/', data=json.dumps(webhook_event), content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')
        assert response.status_code == 200

    def test_tier_not_found(self, mocker):
        event = EventFactory()
        payment = PaymentFactory(event=event, stripe_payment_intent_id='pi_789', status='pending')
        
        webhook_event = self._get_webhook_event('payment_intent.succeeded', 'pi_789', 9999) # Non-existent tier ID
        mocker.patch.object(stripe.Webhook, 'construct_event', return_value=webhook_event)
        
        response = self.client.post('/api/payments/webhook/', data=json.dumps(webhook_event), content_type='application/json', HTTP_STRIPE_SIGNATURE='sig_123')
        
        assert response.status_code == 200
        payment.refresh_from_db()
        assert payment.status == 'succeeded' # Payment is still successful
        event.refresh_from_db()
        assert event.is_active is False # Event is not activated
