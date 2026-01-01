from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from collections import defaultdict
from django.db.models import Count
from django.contrib.auth import get_user_model
from events.models import Event
from payments.models import Payment
from dateutil.relativedelta import relativedelta
from django.db.models.functions import TruncMonth

class HistoricalSummaryView(APIView):
    """
    Provides a historical summary of platform-wide analytics for the last 12 months,
    grouped by month.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        twelve_months_ago = today - relativedelta(months=12)

        User = get_user_model()

        # Aggregate data by month
        user_counts = User.objects.filter(
            date_joined__gte=twelve_months_ago
        ).annotate(month=TruncMonth('date_joined')).values('month').annotate(count=Count('id')).order_by('month')

        event_counts = Event.objects.filter(
            created_at__gte=twelve_months_ago
        ).annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
        
        payment_counts = Payment.objects.filter(
            status='succeeded',
            created_at__gte=twelve_months_ago
        ).annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')

        # Create a dictionary to hold data for all months in the range
        chart_data = defaultdict(lambda: {'users': 0, 'events': 0, 'payments': 0})

        for item in user_counts:
            chart_data[item['month'].date()]['users'] = item['count']
        
        for item in event_counts:
            chart_data[item['month'].date()]['events'] = item['count']

        for item in payment_counts:
            chart_data[item['month'].date()]['payments'] = item['count']

        # Format for the chart response
        response_data = []
        # Start from the first day of the month, 12 months ago
        current_month = twelve_months_ago.replace(day=1)
        
        while current_month <= today:
            data_point = chart_data.get(current_month, {'users': 0, 'events': 0, 'payments': 0})
            response_data.append({
                'month': current_month.strftime('%Y-%m'),
                'users': data_point['users'],
                'events': data_point['events'],
                'payments': data_point['payments'],
            })
            # Move to the first day of the next month
            current_month += relativedelta(months=1)

        return Response(response_data)
