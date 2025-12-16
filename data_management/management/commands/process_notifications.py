from django.core.management.base import BaseCommand
from django.utils import timezone
from notifications.models import Notification
from notifications.email_services import send_reminder_email
import logging

# It's better to get the logger for the specific app
logger = logging.getLogger('data_management')

class Command(BaseCommand):
    help = 'Processes all pending notifications that are due to be sent.'

    def handle(self, *args, **options):
        """
        The main entry point for the command.
        """
        self.stdout.write(f"[{timezone.now()}] Starting notification processing job...")

        # Get all notifications that are pending and scheduled for a time in the past
        due_notifications = Notification.objects.filter(
            status='pending',
            scheduled_send_time__lte=timezone.now()
        )

        if not due_notifications.exists():
            self.stdout.write(self.style.SUCCESS("No pending notifications to send."))
            return

        self.stdout.write(f"Found {due_notifications.count()} notifications to process.")

        success_count = 0
        failure_count = 0

        for notification in due_notifications:
            self.stdout.write(f"Processing Notification {notification.pk} for event '{notification.event.name}'...")
            
            user = notification.user
            contact_address = None
            
            # --- Live Lookup for Contact Info ---
            if notification.channel == 'primary_email':
                contact_address = user.email
            elif notification.channel == 'backup_email':
                contact_address = user.backup_email
            # In the future, other channels like SMS would be handled here.
            
            if not contact_address:
                self.stderr.write(self.style.ERROR(f"  -> No contact address found for channel '{notification.channel}'. Skipping."))
                notification.status = 'failed'
                notification.save(update_fields=['status'])
                failure_count += 1
                continue

            # --- Channel Routing ---
            was_sent = False
            if notification.channel in ['primary_email', 'backup_email']:
                was_sent = send_reminder_email(notification, contact_address)
            else:
                self.stdout.write(self.style.WARNING(f"  -> Unsupported channel '{notification.channel}'. Skipping."))
                continue

            # --- Update Status ---
            if was_sent:
                notification.status = 'sent'
                notification.recipient_contact_info = contact_address # Save the address that was used
                notification.save(update_fields=['status', 'recipient_contact_info'])
                success_count += 1
                self.stdout.write(self.style.SUCCESS(f"  -> Successfully sent to {contact_address}."))
            else:
                notification.status = 'failed'
                notification.save(update_fields=['status'])
                failure_count += 1
                self.stderr.write(self.style.ERROR(f"  -> Failed to send to {contact_address}."))

        self.stdout.write(f"[{timezone.now()}] Notification processing job finished.")
        self.stdout.write(self.style.SUCCESS(f"Successfully sent: {success_count}"))
        self.stdout.write(self.style.ERROR(f"Failed to send: {failure_count}"))
