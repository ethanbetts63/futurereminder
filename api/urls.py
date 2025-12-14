from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.frontend_views.faq_list_view import FaqListView
from .views.frontend_views.emergency_contact_view import EmergencyContactViewSet
from .views.frontend_views.product_views import SingleEventPriceView
from .views.frontend_views.terms_and_conditions_view import LatestTermsAndConditionsView
from payments.views.tier_list_view import TierListView
from users.views.register_view import RegisterView
from users.views.user_profile_view import UserProfileView
from events.views.event_view import EventViewSet
from .views.backend_views.notification_views import NotificationStatsView, AdminTaskListView
from .views.backend_views.analytics_views import (
    AutomatedNotificationHistoryView, 
    ManualNotificationHistoryView,
    HistoricalSummaryView
)

# A router automatically generates the URLs for a ViewSet.
router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'emergency-contacts', EmergencyContactViewSet, basename='emergencycontact')

urlpatterns = [
    # All standard resource URLs (list, create, retrieve, update, delete)
    path('', include(router.urls)),

    # User management endpoints
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    path('users/register/', RegisterView.as_view(), name='register'),
    
    # Configuration endpoints
    path('products/single-event-price/', SingleEventPriceView.as_view(), name='single-event-price'),
    path('tiers/', TierListView.as_view(), name='tier-list'),

    # Other specific-action endpoints
    path('faqs/', FaqListView.as_view(), name='faq-list'),
    path('terms/latest/', LatestTermsAndConditionsView.as_view(), name='latest-terms'),
    
    # Notification endpoints for the admin dashboard
    path('notifications/stats/', NotificationStatsView.as_view(), name='notification-stats'),
    path('notifications/admin-tasks/', AdminTaskListView.as_view(), name='notification-admin-tasks'),

    # Analytics endpoints for chart data
    path('analytics/automated-notifications/', AutomatedNotificationHistoryView.as_view(), name='automated-notification-history'),
    path('analytics/manual-notifications/', ManualNotificationHistoryView.as_view(), name='manual-notification-history'),
    path('analytics/historical-summary/', HistoricalSummaryView.as_view(), name='historical-summary'),
]
