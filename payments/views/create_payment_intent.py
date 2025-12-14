import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from events.models import Event
from payments.models import Payment, Tier, Price

# It's good practice to initialize the API key once.
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    """
    Creates a Stripe PaymentIntent for a given event and a target tier.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = request.data.get('event_id')
        target_tier_id = request.data.get('target_tier_id')

        if not all([event_id, target_tier_id]):
            return Response(
                {"error": "event_id and target_tier_id are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            event = Event.objects.get(id=event_id, user=request.user)
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found or you don't have permission."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Fetch the price for the TARGET tier, not the event's current tier.
        try:
            target_tier = Tier.objects.get(id=target_tier_id)
            price = target_tier.prices.filter(is_active=True, type='one_time').first()
            if not price or price.amount <= 0:
                raise Price.DoesNotExist
        except (Tier.DoesNotExist, Price.DoesNotExist):
             return Response(
                {"error": f"No active, paid, one-time price could be found for the selected tier."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        amount_in_cents = int(price.amount * 100)

        try:
            # Create a PaymentIntent with Stripe
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency=price.currency,
                automatic_payment_methods={'enabled': True},
                metadata={
                    'event_id': event.id,
                    'user_id': request.user.id,
                    'target_tier_id': target_tier.id, # Add target tier to metadata
                }
            )

            # Create a corresponding Payment record in our database
            Payment.objects.create(
                user=request.user,
                event=event,
                price=price,
                stripe_payment_intent_id=payment_intent.id,
                amount=price.amount,
                status='pending'
            )

            return Response({
                'clientSecret': payment_intent.client_secret
            })

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
