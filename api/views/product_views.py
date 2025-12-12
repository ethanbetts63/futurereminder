from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from payments.models import Price

class SingleEventPriceView(APIView):
    """
    Provides the price for a standard, single event.
    This is a public endpoint used by the frontend to display the price.
    """
    permission_classes = [] # No authentication required

    def get(self, request, *args, **kwargs):
        try:
            # For the MVP, we assume there is one default, active, one-time price.
            price = Price.objects.filter(is_active=True, type='one_time').first()
            if not price:
                raise Price.DoesNotExist
            
            # Serialize the data manually for this simple case
            data = {
                'priceId': price.id,
                'amount': price.amount,
                'currency': price.currency,
            }
            return Response(data)

        except Price.DoesNotExist:
             return Response(
                {"error": "No active price configured for purchase."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            # Log the exception e
            return Response(
                {"error": "An unexpected error occurred."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
