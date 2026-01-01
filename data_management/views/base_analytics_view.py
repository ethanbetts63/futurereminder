from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from datetime import timedelta
from collections import defaultdict
from django.db.models.functions import TruncDate
from django.db.models import Count

from events.models import Notification

class BaseAnalyticsView(APIView):
    """
    Base class for notification analytics views to share common logic.
    Provides time-series data for scheduled, sent, delivered, and failed notifications.
    """
    permission_classes = [IsAdminUser]

    # To be defined by subclasses
    CHANNELS = []

    def get(self, request, *args, **kwargs):
        # 1. Determine date range
        pending_notifications = Notification.objects.filter(
            channel__in=self.CHANNELS,
            status='pending'
        ).order_by('scheduled_send_time')

        earliest_pending = pending_notifications.first()
        latest_pending = pending_notifications.last()

        today = timezone.now().date()
        start_date = today - timedelta(days=30) # Default: last 30 days
        end_date = today + timedelta(days=30)   # Default: next 30 days

        if earliest_pending:
            start_date = earliest_pending.scheduled_send_time.date() - timedelta(days=7)
        
        if latest_pending:
            end_date = latest_pending.scheduled_send_time.date() + timedelta(days=7)

        date_range = [start_date, end_date]

        # 2. Get counts for each status, grouped by day
        scheduled_counts = Notification.objects.filter(
            channel__in=self.CHANNELS,
            scheduled_send_time__date__range=date_range
        ).annotate(day=TruncDate('scheduled_send_time')).values('day').annotate(count=Count('id')).order_by('day')

        sent_counts = Notification.objects.filter(
            channel__in=self.CHANNELS,
            status='sent',
            updated_at__date__range=date_range
        ).annotate(day=TruncDate('updated_at')).values('day').annotate(count=Count('id')).order_by('day')
        
        delivered_counts = Notification.objects.filter(
            channel__in=self.CHANNELS,
            status='delivered',
            updated_at__date__range=date_range
        ).annotate(day=TruncDate('updated_at')).values('day').annotate(count=Count('id')).order_by('day')

        error_counts = Notification.objects.filter(
            channel__in=self.CHANNELS,
            status='failed',
            updated_at__date__range=date_range
        ).annotate(day=TruncDate('updated_at')).values('day').annotate(count=Count('id')).order_by('day')

        completed_counts = Notification.objects.filter(
            channel__in=self.CHANNELS,
            status='completed',
            updated_at__date__range=date_range
        ).annotate(day=TruncDate('updated_at')).values('day').annotate(count=Count('id')).order_by('day')
        
        # 3. Combine and format the data
        chart_data = defaultdict(lambda: {'scheduled': 0, 'sent': 0, 'delivered': 0, 'errors': 0, 'completed': 0})

        for item in scheduled_counts:
            chart_data[item['day']]['scheduled'] = item['count']
        
        for item in sent_counts:
            chart_data[item['day']]['sent'] = item['count']

        for item in delivered_counts:
            chart_data[item['day']]['delivered'] = item['count']

        for item in error_counts:
            chart_data[item['day']]['errors'] = item['count']

        for item in completed_counts:
            chart_data[item['day']]['completed'] = item['count']

        # 4. Format for the chart response
        response_data = []
        current_date = start_date
        while current_date <= end_date:
            data_point = chart_data[current_date]
            response_data.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'scheduled': data_point['scheduled'],
                'sent': data_point['sent'],
                'delivered': data_point['delivered'],
                'errors': data_point['errors'],
                'completed': data_point['completed'],
            })
            current_date += timedelta(days=1)

        return Response(response_data)
