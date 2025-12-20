# notifications/tests/view_tests/test_admin_task_list_view.py
import pytest
from rest_framework.test import APIClient
from django.utils import timezone
from datetime import timedelta

from users.tests.factories.user_factory import UserFactory
from notifications.models import Notification
from notifications.tests.factories.notification_factory import NotificationFactory
from notifications.serializers.notification_serializer import AdminTaskSerializer

@pytest.mark.django_db
class TestAdminTaskListView:

    def setup_method(self):
        self.client = APIClient()
        self.admin_user = UserFactory(is_staff=True)
        self.normal_user = UserFactory()

        self.today = timezone.now().date()
        self.start_of_week = self.today - timedelta(days=self.today.weekday())
        self.end_of_week = self.start_of_week + timedelta(days=7)

    def test_unauthorized_user_cannot_access(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get('/api/notifications/admin-tasks/')
        assert response.status_code == 403

    def test_admin_user_can_access(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/notifications/admin-tasks/')
        assert response.status_code == 200

    def test_returns_correct_tasks_for_current_week(self):
        # Helper to create timezone-aware datetimes
        def make_aware_datetime(date_obj):
            return timezone.make_aware(
                timezone.datetime.combine(date_obj, timezone.datetime.min.time())
            )

        # Tasks that should be included
        task1 = NotificationFactory(
            status='pending',
            channel='admin_call',
            scheduled_send_time=make_aware_datetime(self.start_of_week + timedelta(days=1))
        )
        task2 = NotificationFactory(
            status='pending',
            channel='emergency_contact',
            scheduled_send_time=make_aware_datetime(self.start_of_week + timedelta(days=3))
        )

        # Tasks that should be excluded
        # Wrong status
        NotificationFactory(
            status='sent',
            channel='admin_call',
            scheduled_send_time=make_aware_datetime(self.start_of_week + timedelta(days=2))
        )
        # Wrong channel
        NotificationFactory(
            status='pending',
            channel='primary_email',
            scheduled_send_time=make_aware_datetime(self.start_of_week + timedelta(days=2))
        )
        # Wrong week (next week)
        NotificationFactory(
            status='pending',
            channel='admin_call',
            scheduled_send_time=make_aware_datetime(self.end_of_week + timedelta(days=1))
        )
        # Wrong week (last week)
        NotificationFactory(
            status='pending',
            channel='admin_call',
            scheduled_send_time=make_aware_datetime(self.start_of_week - timedelta(days=1))
        )
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/notifications/admin-tasks/')

        assert response.status_code == 200
        
        # Sort both lists by id to ensure consistent order for comparison
        response_data = sorted(response.data, key=lambda x: x['id'])
        
        expected_notifications = sorted([task1, task2], key=lambda x: x.id)
        expected_data = AdminTaskSerializer(expected_notifications, many=True).data

        assert len(response_data) == 2
        assert response_data == expected_data
        
    def test_empty_list_when_no_tasks(self):
        # Helper to create timezone-aware datetimes
        def make_aware_datetime(date_obj):
            return timezone.make_aware(
                timezone.datetime.combine(date_obj, timezone.datetime.min.time())
            )
            
        # Create only irrelevant tasks
        NotificationFactory(
            status='sent',
            channel='admin_call',
            scheduled_send_time=make_aware_datetime(self.start_of_week + timedelta(days=2))
        )
        NotificationFactory(
            status='pending',
            channel='primary_email',
            scheduled_send_time=make_aware_datetime(self.start_of_week + timedelta(days=2))
        )
        
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/notifications/admin-tasks/')

        assert response.status_code == 200
        assert len(response.data) == 0
