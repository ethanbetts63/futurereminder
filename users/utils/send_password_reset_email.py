import requests
from django.conf import settings
from django.template.loader import render_to_string
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from users.models import User
from data_management.models import BlockedEmail
from data_management.views.blocklist_view import signer


def send_password_reset_email(user: User):
    """
    Sends an email to the user with a link to reset their password using the Mailgun API.
    """
    try:
        # --- Blocklist Check ---
        if BlockedEmail.objects.filter(email=user.email).exists():
            print(f"Password reset email to {user.email} suppressed because it is on the blocklist.")
            return False

        # Generate a token and user ID for the password reset URL
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Construct the password reset URL for the frontend
        reset_url = f"{settings.SITE_URL}/reset-password-confirm/{uid}/{token}"

        # Construct the unique blocklist URL
        signed_email = signer.sign(user.email)
        unsubscribe_url = f"{settings.SITE_URL}/api/data/blocklist/block/{signed_email}/"

        context = {
            'user': user,
            'reset_url': reset_url,
            'site_url': settings.SITE_URL,
            'unsubscribe_url': unsubscribe_url,
        }

        subject = "Reset Your FutureReminder Password"
        html_content = render_to_string("users/emails/password_reset_email.html", context)
        text_content = render_to_string("users/emails/password_reset_email.txt", context)

        # Send the email using Mailgun API
        response = requests.post(
            f"https://api.mailgun.net/v3/{settings.MAILGUN_DOMAIN}/messages",
            auth=("api", settings.MAILGUN_API_KEY),
            data={"from": settings.DEFAULT_FROM_EMAIL,
                  "to": [user.email],
                  "subject": subject,
                  "text": text_content,
                  "html": html_content})

        if response.status_code == 200:
            return True
        else:
            print(f"Failed to send password reset email to {user.email}. Mailgun responded with {response.status_code}: {response.text}")
            return False

    except Exception as e:
        print(f"Failed to send password reset email to {user.email}. Error: {e}")
        return False
