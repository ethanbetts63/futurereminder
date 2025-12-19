from django.urls import path
from .views.payment_views import CreatePaymentIntentView, StripeWebhookView
from .views.tier_list_view import TierListView

app_name = 'payments'

urlpatterns = [
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('tiers/', TierListView.as_view(), name='tier-list'),
]
