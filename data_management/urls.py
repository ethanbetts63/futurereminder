from django.urls import path
from .views import blocklist_view

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
]
