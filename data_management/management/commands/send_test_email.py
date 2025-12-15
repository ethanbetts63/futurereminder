import json
from django.core.management.base import BaseCommand
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class Command(BaseCommand):
    help = 'Sends a test email using the configured email backend. Can send a simple text email or a multipart email based on a Django template.'

    def add_arguments(self, parser):
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

    def handle(self, *args, **options):
        recipient = options['recipient']
        subject = options['subject']
        template_name = options['template_name']
        
        try:
            context = json.loads(options['context'])
        except json.JSONDecodeError:
            self.stderr.write(self.style.ERROR("Invalid JSON provided for --context argument."))
            return

        # Add default context variables that are useful for base templates
        context.setdefault('site_url', 'https://www.futurereminder.app')
        context.setdefault('unsubscribe_url', '#')
        
        self.stdout.write(f"Attempting to send an email to {recipient} with subject '{subject}'...")

        try:
            if template_name:
                self.stdout.write(f"Using template: {template_name}")

                # Render the HTML part
                html_content = render_to_string(template_name, context)

                # Infer the .txt template name and render it. If it doesn't exist, create text from HTML.
                try:
                    txt_template_name = template_name.replace('.html', '.txt')
                    text_content = render_to_string(txt_template_name, context)
                except Exception:
                    self.stdout.write(self.style.WARNING(f"Could not find matching .txt template for {template_name}. Stripping HTML for text part."))
                    text_content = strip_tags(html_content)

                # Create and send the multipart email
                msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [recipient])
                msg.attach_alternative(html_content, "text/html")
                msg.send(fail_silently=False)

            else:
                self.stdout.write("No template specified. Sending a simple text email.")
                message = "This is a test email from the FutureReminder application, sent from the SES sandbox environment via a Django management command."
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
            self.stderr.write(self.style.WARNING("Common issues: template not found, invalid template syntax, or incorrect .env email credentials."))
