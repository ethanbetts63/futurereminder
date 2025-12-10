import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from payments.models import Payment

class StripeWebhookView(APIView):
    """
    Listens for webhook events from Stripe.
    This view is responsible for handling payment confirmations and updating
    the payment status in the local database.
    """
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
            payment_intent = event['data']['object'] # contains a stripe.PaymentIntent
            
            # Find the corresponding Payment in our database
            try:
                payment = Payment.objects.get(stripe_charge_id=payment_intent.id)
                # Update the status to 'succeeded'
                payment.status = 'succeeded'
                payment.save()

                # Here you could also trigger other business logic, like:
                # - Activating the associated event
                # - Sending a confirmation email to the user
                
                # Activate the associated event
                if payment.event:
                    payment.event.is_active = True
                    payment.event.save()

            except Payment.DoesNotExist:
                # This could happen if the payment was created outside of our system's flow
                # Or if there's a serious data inconsistency.
                # Log this for investigation.
                print(f"Error: Received successful payment intent for non-existent charge ID: {payment_intent.id}")
                # Still return a 200 to Stripe to prevent retries for this event.
                return HttpResponse(status=200)

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            try:
                payment = Payment.objects.get(stripe_charge_id=payment_intent.id)
                payment.status = 'failed'
                payment.save()
            except Payment.DoesNotExist:
                print(f"Error: Received failed payment intent for non-existent charge ID: {payment_intent.id}")
                return HttpResponse(status=200)

        # Passed signature verification
        return HttpResponse(status=200)
