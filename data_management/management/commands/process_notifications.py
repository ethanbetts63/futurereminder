from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Q
from events.models import Notification
from events.utils.send_reminder_email import send_reminder_email
from events.utils.send_reminder_sms import send_reminder_sms
import logging
from datetime import datetime

logger = logging.getLogger('data_management')

class Command(BaseCommand):
    help = 'Processes all pending or failed notifications that are due to be sent.'

    def add_arguments(self, parser):
        """
        Adds a command-line argument to allow specifying a "fake" date for processing.
        """
        parser.add_argument(
            '--date',
            type=str,
            help='Run as-if it is this date (YYYY-MM-DD). Defaults to today.'
        )

    def handle(self, *args, **options):
        """
        The main entry point for the command.
        Finds all due notifications and attempts to send them based on their channel.
        """
        processing_time = None
        if options['date']:
            try:
                processing_date = datetime.strptime(options['date'], '%Y-%m-%d').date()
                processing_time = timezone.make_aware(datetime.combine(processing_date, timezone.now().time()))
                self.stdout.write(f"[{timezone.now()}] Running notification processing for simulated date: {processing_date}")
            except ValueError:
                self.stderr.write(self.style.ERROR("Invalid date format. Please use YYYY-MM-DD."))
                return
        else:
            processing_time = timezone.now()

        self.stdout.write(f"[{processing_time}] Starting notification processing job...")

        due_notifications = Notification.objects.filter(
            Q(status='pending') | Q(status='failed'),
            scheduled_send_time__lte=processing_time,
            user__is_email_verified=True # Basic check for email
        )

        if not due_notifications.exists():
            self.stdout.write(self.style.SUCCESS("No pending or failed notifications to send."))
            return

        self.stdout.write(f"Found {due_notifications.count()} notifications to process.")

        success_count = 0
        failure_count = 0

        for n in due_notifications:
            self.stdout.write(f"Processing Notification {n.pk} for event '{n.event.name}' via {n.channel}...")
            
            sid_or_success = None
            recipient = None
            
            try:
                # --- Channel and Recipient Routing ---
                if n.channel == 'primary_email':
                    recipient = n.user.email
                elif n.channel == 'backup_email':
                    recipient = n.user.backup_email
                elif n.channel == 'primary_sms':
                    recipient = n.user.phone_number
                elif n.channel == 'backup_sms':
                    recipient = n.user.backup_phone_number
                elif n.channel == 'emergency_contact_email':
                    contact = n.user.emergency_contacts.first()
                    if contact: recipient = contact.email
                
                if not recipient:
                    raise ValueError(f"No recipient address found for channel '{n.channel}'.")

                # --- Sending Logic ---
                n.status = 'in_progress'
                n.save(update_fields=['status'])

                if n.channel in ['primary_email', 'backup_email', 'emergency_contact_email']:
                    sid_or_success = send_reminder_email(n, recipient)
                elif n.channel in ['primary_sms', 'backup_sms']:
                    sid_or_success = send_reminder_sms(n, recipient)
                else:
                    raise NotImplementedError(f"Channel '{n.channel}' is not a supported sending channel.")

                # --- Status Update ---
                if sid_or_success:
                    n.status = 'sent'
                    n.recipient_contact_info = recipient
                    if isinstance(sid_or_success, str): # SMS returns a SID
                        n.message_sid = sid_or_success
                    n.failure_reason = None # Clear previous failure reason
                    n.save(update_fields=['status', 'recipient_contact_info', 'message_sid', 'failure_reason'])
                    success_count += 1
                    self.stdout.write(self.style.SUCCESS(f"  -> Successfully sent. SID: {n.message_sid or 'N/A'}"))
                else:
                    raise Exception("Sending function returned a falsy value.")

            except Exception as e:
                n.status = 'failed'
                n.failure_reason = str(e)
                n.save(update_fields=['status', 'failure_reason'])
                failure_count += 1
                self.stderr.write(self.style.ERROR(f"  -> Failed to send. Reason: {e}"))

        self.stdout.write(f"[{timezone.now()}] Notification processing job finished.")
        self.stdout.write(self.style.SUCCESS(f"Successfully sent: {success_count}"))
        self.stdout.write(self.style.ERROR(f"Failed to send: {failure_count}"))