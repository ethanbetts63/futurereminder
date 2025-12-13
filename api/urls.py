from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.frontend_views.faq_list_view import FaqListView
from .views.frontend_views.emergency_contact_view import EmergencyContactViewSet
from .views.frontend_views.product_views import SingleEventPriceView
from users.views.register_view import RegisterView
from users.views.user_profile_view import UserProfileView
from events.views.event_view import EventViewSet
from .views.backend_views.dashboard_analytics_view import DashboardAnalyticsView
from .views.backend_views.notification_views import NotificationStatsView, AdminTaskListView

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

    # Other specific-action endpoints
    path('faqs/', FaqListView.as_view(), name='faq-list'),
    path('dashboard-analytics/', DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
    
    # Notification endpoints for the admin dashboard
    path('notifications/stats/', NotificationStatsView.as_view(), name='notification-stats'),
    path('notifications/admin-tasks/', AdminTaskListView.as_view(), name='notification-admin-tasks'),
]
