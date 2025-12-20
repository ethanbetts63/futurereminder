from .base_analytics_view import BaseAnalyticsView

class ManualNotificationHistoryView(BaseAnalyticsView):
    """
    Provides time-series data for manual notifications.
    - Scheduled: All notifications of this type.
    - Completed: Notifications with 'completed' status.
    """
    CHANNELS = ['admin_call', 'social_media', 'emergency_contact']
    COMPLETED_STATUSES = ['completed']
