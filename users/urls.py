from django.urls import path
from .views import email_verification_view

app_name = 'users'

urlpatterns = [
    path(
        'verify-email/<str:uidb64>/<str:token>/',
        email_verification_view.EmailVerificationView.as_view(),
        name='email_verify'
    ),
]
