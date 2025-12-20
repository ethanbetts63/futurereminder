import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework.permissions import AllowAny
from payments.models import Payment, Tier

class StripeWebhookView(APIView):
    """
    Listens for webhook events from Stripe.
    This view is responsible for handling payment confirmations and updating
    the payment status in the local database.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            # Invalid payload
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            metadata = payment_intent.get('metadata', {})
            target_tier_id = metadata.get('target_tier_id')

            # Find the corresponding Payment in our database
            try:
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
                payment.status = 'succeeded'
                payment.save()
                
                # Upgrade Tier and Activate Event, if we have the necessary info
                if payment.event and target_tier_id:
                    try:
                        # Use the ID from the metadata to get the correct tier
                        paid_tier = Tier.objects.get(id=target_tier_id)
                        
                        # Upgrade the event's tier and activate it
                        event_to_update = payment.event
                        event_to_update.tier = paid_tier
                        event_to_update.is_active = True
                        event_to_update.save() # The custom save method will validate

                    except Tier.DoesNotExist:
                        print(f"CRITICAL ERROR: Tier with ID {target_tier_id} not found. Cannot upgrade event {payment.event.id}.")
                        return HttpResponse(status=200)

            except Payment.DoesNotExist:
                print(f"Error: Received successful payment intent for non-existent charge ID: {payment_intent.id}")
                return HttpResponse(status=200)

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            try:
                payment = Payment.objects.get(stripe_payment_intent_id=payment_intent['id'])
                payment.status = 'failed'
                payment.save()
            except Payment.DoesNotExist:
                print(f"Error: Received failed payment intent for non-existent charge ID: {payment_intent.id}")
                return HttpResponse(status=200)

        # Passed signature verification
        return HttpResponse(status=200)