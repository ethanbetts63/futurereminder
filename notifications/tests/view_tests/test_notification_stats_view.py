# notifications/tests/view_tests/test_notification_stats_view.py
import pytest
from rest_framework.test import APIClient
from django.utils import timezone
from datetime import timedelta
from collections import Counter

from notifications.models import Notification
from users.tests.factories.user_factory import UserFactory
from notifications.tests.factories.notification_factory import NotificationFactory

@pytest.mark.django_db
class TestNotificationStatsView:

    def setup_method(self):
        self.client = APIClient()
        self.admin_user = UserFactory(is_staff=True)
        self.normal_user = UserFactory()

    def test_unauthorized_user_cannot_access(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get('/api/notifications/stats/')
        assert response.status_code == 403

    def test_admin_user_can_access(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/notifications/stats/')
        assert response.status_code == 200

    def test_stats_aggregation(self):
        now = timezone.now()

        # Helper to create and then force-update the timestamp
        def create_and_set_timestamp(count, timestamp, **kwargs):
            notifications = NotificationFactory.create_batch(count, **kwargs)
            notification_ids = [n.id for n in notifications]
            Notification.objects.filter(id__in=notification_ids).update(updated_at=timestamp)

        # Recent notifications that should be counted
        create_and_set_timestamp(3, now - timedelta(days=1), status='sent', channel='email')
        create_and_set_timestamp(2, now - timedelta(days=3), status='failed', channel='sms')
        create_and_set_timestamp(1, now - timedelta(days=6), status='sent', channel='sms')

        # Irrelevant notifications that should be ignored
        create_and_set_timestamp(5, now - timedelta(days=2), status='pending') # wrong status
        create_and_set_timestamp(4, now - timedelta(days=8), status='sent', channel='email') # too old

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/notifications/stats/')

        assert response.status_code == 200
        expected_stats = {
            'sent': {
                'email': 3,
                'sms': 1
            },
            'failed': {
                'sms': 2
            }
        }
        # Convert Counters to dicts for comparison
        response_data = {
            'sent': dict(response.data['sent']),
            'failed': dict(response.data['failed'])
        }
        assert response_data == expected_stats

    def test_no_relevant_notifications(self):
        now = timezone.now()

        def create_and_set_timestamp(count, timestamp, **kwargs):
            notifications = NotificationFactory.create_batch(count, **kwargs)
            notification_ids = [n.id for n in notifications]
            Notification.objects.filter(id__in=notification_ids).update(updated_at=timestamp)

        # Irrelevant notifications only
        create_and_set_timestamp(5, now - timedelta(days=2), status='pending')
        create_and_set_timestamp(4, now - timedelta(days=8), status='sent', channel='email')

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/notifications/stats/')

        assert response.status_code == 200
        expected_stats = {
            'sent': {},
            'failed': {}
        }
        # Convert Counters to dicts for comparison
        response_data = {
            'sent': dict(response.data['sent']),
            'failed': dict(response.data['failed'])
        }
        assert response_data == expected_stats
