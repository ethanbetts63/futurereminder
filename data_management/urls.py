from django.urls import path
from .views import blocklist_view
from .views.faq_list_view import FaqListView
from .views.terms_and_conditions_view import LatestTermsAndConditionsView
from .views.product_views import SingleEventPriceView
from .views.analytics_views import (
    AutomatedNotificationHistoryView,
    ManualNotificationHistoryView,
    HistoricalSummaryView
)

app_name = 'data_management'

urlpatterns = [
    path(
        'blocklist/block/<str:signed_email>/',
        blocklist_view.AddToBlocklistView.as_view(),
        name='add_to_blocklist'
    ),
    path(
        'blocklist-success/',
        blocklist_view.BlocklistSuccessView.as_view(),
        name='blocklist_success'
    ),
    path('faqs/', FaqListView.as_view(), name='faq-list'),
    path('terms/latest/', LatestTermsAndConditionsView.as_view(), name='latest-terms'),
    path('products/single-event-price/', SingleEventPriceView.as_view(), name='single-event-price'),
    path('analytics/automated-notifications/', AutomatedNotificationHistoryView.as_view(), name='automated-notification-history'),
    path('analytics/manual-notifications/', ManualNotificationHistoryView.as_view(), name='manual-notification-history'),
    path('analytics/historical-summary/', HistoricalSummaryView.as_view(), name='historical-summary'),
]
