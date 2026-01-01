import os
from datetime import timedelta
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.utils import timezone
from django.conf import settings
from users.models import User
from payments.models import Tier
from events.models import Event, Notification

class Command(BaseCommand):
    help = 'Runs a full end-to-end test of the notification system, sending real emails and texts.'

    def handle(self, *args, **options):
        """
        Main entry point for the command.
        Orchestrates the setup, execution, and reporting of the E2E test.
        """
        # 1. --- Safety Check ---
        self.stdout.write(self.style.WARNING("--- Step 1: Safety Check ---"))
        if not settings.DEBUG:
            raise CommandError("This command can only be run in a DEBUG environment. Aborting.")
        self.stdout.write(self.style.SUCCESS("DEBUG is True. Proceeding."))

        # 2. --- Test Setup ---
        self.stdout.write(self.style.WARNING("\n--- Step 2: Test Setup ---"))
        
        user_email = "ethanbetts63@gmail.com"
        user_phone = "+4591749128"

        user, created = User.objects.get_or_create(
            username=user_email,
            defaults={'email': user_email}
        )
        user.phone = user_phone
        user.backup_phone = user_phone # Using same for simplicity
        user.is_email_verified = True
        user.save()
        
        self.stdout.write(f"User '{user.email}' prepared.")

        try:
            tier = Tier.objects.get(name="Full Escalation")
        except Tier.DoesNotExist:
            raise CommandError("The 'Full Escalation' tier does not exist. Please load tiers first.")
        
        self.stdout.write(f"Using tier: '{tier.name}'.")

        event_date = timezone.now().date() + timedelta(days=14)
        event = Event.objects.create(
            user=user,
            tier=tier,
            name="E2E Test Event",
            description="This is an automated end-to-end test event.",
            event_date=event_date,
            is_active=True
        )
        self.stdout.write(f"Event '{event.name}' created for date: {event.event_date}.")

        # 3. --- Initial State Report ---
        self.stdout.write(self.style.WARNING("\n--- Step 3: Initial State Report ---"))
        notifications = Notification.objects.filter(event=event).order_by('scheduled_send_time')
        if not notifications.exists():
            raise CommandError("No notifications were scheduled for the event. Aborting test.")

        self.stdout.write(self.style.SUCCESS(f"Successfully scheduled {notifications.count()} notifications:"))
        for i, n in enumerate(notifications):
            self.stdout.write(f"  - Notification {i+1}: Channel='{n.channel}', Scheduled for={n.scheduled_send_time.strftime('%Y-%m-%d %H:%M')}")

        # 4. --- Time Simulation Loop ---
        self.stdout.write(self.style.WARNING("\n--- Step 4: Time Simulation Loop ---"))
        # Loop for 15 days to cover the entire 14-day period
        for i in range(15):
            simulated_date = timezone.now().date() + timedelta(days=i)
            simulated_date_str = simulated_date.strftime('%Y-%m-%d')
            self.stdout.write(self.style.HTTP_INFO(f"\n>>> Simulating Day {i}: {simulated_date_str} <<<"))
            
            call_command('process_notifications', date=simulated_date_str)

        # 5. --- Final State Report ---
        self.stdout.write(self.style.WARNING("\n--- Step 5: Final State Report ---"))
        self.stdout.write("Final status of notifications:")
        
        for n in notifications.order_by('scheduled_send_time'):
            n.refresh_from_db()
            style = self.style.SUCCESS if n.status == 'sent' else self.style.ERROR
            if n.status == 'failed' and "not a supported sending channel" in n.failure_reason:
                style = self.style.WARNING # For manual tasks
            
            self.stdout.write(style(f"  - Channel='{n.channel}', Scheduled='{n.scheduled_send_time.date()}', Final Status='{n.status}'"))
            if n.status == 'failed':
                 self.stdout.write(self.style.ERROR(f"    - Reason: {n.failure_reason}"))
        
        self.stdout.write(self.style.SUCCESS("\nEnd-to-end test command finished."))
