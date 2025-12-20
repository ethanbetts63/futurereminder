from .base_analytics_view import BaseAnalyticsView

class AutomatedNotificationHistoryView(BaseAnalyticsView):
    """
    Provides time-series data for automated notifications.
    - Scheduled: All notifications of this type.
    - Completed: Notifications with 'sent' status.
    """
    CHANNELS = ['primary_email', 'primary_sms', 'backup_email', 'backup_sms']
    COMPLETED_STATUSES = ['sent']
