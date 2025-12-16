from django.urls import path
from .views import verification_views

app_name = 'users'

urlpatterns = [
    path(
        'verify-email/<str:uidb64>/<str:token>/',
        verification_views.EmailVerificationView.as_view(),
        name='email_verify'
    ),
]
