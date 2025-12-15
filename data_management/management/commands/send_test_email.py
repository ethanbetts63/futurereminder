from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = 'Sends a test email using the configured SES email backend.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--recipient',
            default='ethanbetts63@gmail.com',
            help='The email address to send the test email to.'
        )

    def handle(self, *args, **options):
        recipient = options['recipient']
        subject = "Test Reminder"
        message = "This is a test email from the FutureReminder application, sent from the SES sandbox environment via a Django management command."
        
        self.stdout.write(f"Attempting to send a test email to {recipient}...")

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully sent email to {recipient}."))
            self.stdout.write(self.style.WARNING("Please check your inbox (and spam folder) to verify receipt."))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to send email. Error: {e}"))
            self.stderr.write(self.style.WARNING("Please ensure your AWS SES SMTP credentials in the .env file are correct and that the service is running in sandbox mode."))

