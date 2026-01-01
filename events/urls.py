from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.event_view import EventViewSet
from .views.webhook_views import twilio_status_webhook

router = DefaultRouter()
router.register(r'', EventViewSet, basename='event')

urlpatterns = [
    path('', include(router.urls)),
    path('webhooks/twilio/status/', twilio_status_webhook, name='twilio-status-webhook'),
]