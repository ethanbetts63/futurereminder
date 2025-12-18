from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from payments.models import Price

from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from rest_framework.permissions import AllowAny

@method_decorator(cache_page(60 * 60 * 24), name='dispatch')
class SingleEventPriceView(APIView):
    """
    Provides the price for a standard, single event.
    This is a public endpoint used by the frontend to display the price.
    """
    permission_classes = [AllowAny] # No authentication required

    def get(self, request, *args, **kwargs):
        cache_key = 'single_event_price_data'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

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
            
            # Store the data in the cache for 24 hours
            cache.set(cache_key, data, 60 * 60 * 24)

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
