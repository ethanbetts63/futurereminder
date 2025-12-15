import json
from datetime import datetime
from django.core.management.base import BaseCommand
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone

from users.models import User
from events.models import Event
from notifications.models import Notification
from notifications.email_services import send_reminder_email

class Command(BaseCommand):
    help = 'Sends a test email using the configured email backend. Can send a simple text email or a multipart email based on a Django template.'

    def add_arguments(self, parser):
        # General arguments
        parser.add_argument(
            '--recipient',
            default='ethanbetts63@gmail.com',
            help='The email address to send the test email to.'
        )
        parser.add_argument(
            '--subject',
            default='Test Email',
            help='The subject line of the email.'
        )
        # Generic template test arguments
        parser.add_argument(
            '--template_name',
            type=str,
            help='The path to the email template (e.g., "notifications/emails/base.html"). The .txt version will be inferred.'
        )
        parser.add_argument(
            '--context',
            type=str,
            default='{}',
            help='A JSON string representing the context to pass to the template.'
        )
        # Specific test for the event reminder flow
        parser.add_argument(
            '--reminder_test',
            action='store_true',
            help='Run a specific test for the event reminder email using a random User and Event.'
        )

    def handle(self, *args, **options):
        recipient = options['recipient']

        if options['reminder_test']:
            self.stdout.write(self.style.SUCCESS("--- Running Event Reminder Test ---"))
            try:
                user = User.objects.order_by('?').first()
                event = Event.objects.order_by('?').first()

                if not user:
                    self.stderr.write(self.style.ERROR("Test failed: Could not find any Users in the database."))
                    return
                if not event:
                    self.stderr.write(self.style.ERROR("Test failed: Could not find any Events in the database."))
                    return
                
                self.stdout.write(f"Found random User: {user.email}")
                self.stdout.write(f"Found random Event: {event.title}")

                # Create a temporary, in-memory Notification object for the test
                notification = Notification(
                    user=user,
                    event=event,
                    recipient_contact_info=recipient,
                    # Other fields are not needed for the email context
                )

                self.stdout.write(f"Attempting to send reminder email to {recipient}...")
                success = send_reminder_email(notification)

                if success:
                    self.stdout.write(self.style.SUCCESS("Successfully sent event reminder test email."))
                else:
                    self.stderr.write(self.style.ERROR("The send_reminder_email function reported a failure."))

            except Exception as e:
                self.stderr.write(self.style.ERROR(f"An unexpected error occurred during the reminder test: {e}"))
            return

        # --- Default generic email testing logic ---
        self.stdout.write(self.style.SUCCESS("--- Running Generic Email Test ---"))
        subject = options['subject']
        template_name = options['template_name']
        
        try:
            context = json.loads(options['context'])
        except json.JSONDecodeError:
            self.stderr.write(self.style.ERROR("Invalid JSON provided for --context argument."))
            return

        context.setdefault('site_url', settings.SITE_URL)
        context.setdefault('unsubscribe_url', '#')
        
        self.stdout.write(f"Attempting to send an email to {recipient} with subject '{subject}'...")

        try:
            if template_name:
                self.stdout.write(f"Using template: {template_name}")
                html_content = render_to_string(template_name, context)
                try:
                    txt_template_name = template_name.replace('.html', '.txt')
                    text_content = render_to_string(txt_template_name, context)
                except Exception:
                    self.stdout.write(self.style.WARNING(f"Could not find matching .txt template for {template_name}. Stripping HTML."))
                    text_content = strip_tags(html_content)

                msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient])
                msg.attach_alternative(html_content, "text/html")
                msg.send(fail_silently=False)

            else:
                self.stdout.write("No template specified. Sending a simple text email.")
                message = "This is a test email from the FutureReminder application."
                send_mail(
                    subject=subject, message=message, from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient], fail_silently=False,
                )

            self.stdout.write(self.style.SUCCESS(f"Successfully sent email to {recipient}."))

        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Failed to send email. Error: {e}"))
            self.stderr.write(self.style.WARNING("Common issues: template not found, invalid template syntax, or incorrect .env email credentials."))
