from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils import timezone
from datetime import timedelta
from collections import Counter

from notifications.models import Notification
from api.serializers.notification_serializer import AdminTaskSerializer

class NotificationStatsView(APIView):
    """
    Provides statistics on automated notifications (sent vs. failed) over the
    last 7 days.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        seven_days_ago = timezone.now() - timedelta(days=7)

        # Get relevant notifications
        notifications = Notification.objects.filter(
            updated_at__gte=seven_days_ago,
            status__in=['sent', 'failed']
        ).values('status', 'channel')

        # Aggregate the stats
        stats = {
            'sent': Counter(),
            'failed': Counter()
        }
        for notif in notifications:
            stats[notif['status']][notif['channel']] += 1

        return Response(stats)


class AdminTaskListView(ListAPIView):
    """
    Provides a list of pending manual admin tasks scheduled for the current week.
    """
    permission_classes = [IsAdminUser]
    serializer_class = AdminTaskSerializer

    def get_queryset(self):
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday()) # Monday
        end_of_week = start_of_week + timedelta(days=7)

        admin_task_channels = ['admin_call', 'social_media', 'emergency_contact']

        queryset = Notification.objects.filter(
            status='pending',
            channel__in=admin_task_channels,
            scheduled_send_time__date__gte=start_of_week,
            scheduled_send_time__date__lt=end_of_week
        ).select_related('event', 'user').order_by('scheduled_send_time')

        return queryset
