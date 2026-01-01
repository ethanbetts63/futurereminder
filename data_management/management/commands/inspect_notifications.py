from django.core.management.base import BaseCommand
from django.utils import timezone
from events.models import Notification

class Command(BaseCommand):
    help = 'Inspects and lists all notifications in the system.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--status',
            type=str,
            help='Filter notifications by a specific status (e.g., pending, sent, failed).',
        )

    def handle(self, *args, **options):
        status_filter = options['status']

        self.stdout.write(self.style.SUCCESS("--- Inspecting Notifications ---"))

        # Base queryset
        notifications = Notification.objects.all()

        if status_filter:
            notifications = notifications.filter(status=status_filter)
            self.stdout.write(self.style.SUCCESS(f"Filtering by status: {status_filter}"))

        # Order by most recently scheduled
        notifications = notifications.order_by('-scheduled_send_time')

        if not notifications.exists():
            self.stdout.write("No notifications found matching the criteria.")
            return

        self.stdout.write(f"Found {notifications.count()} notifications.\n")

        for notif in notifications:
            # Choose a color based on status
            if notif.status == 'delivered' or notif.status == 'sent':
                status_style = self.style.SUCCESS
            elif notif.status == 'failed':
                status_style = self.style.ERROR
            elif notif.status == 'pending':
                status_style = self.style.WARNING
            else:
                status_style = self.style.HTTP_INFO

            self.stdout.write(self.style.HTTP_SUCCESS(f"--- Notification ID: {notif.pk} ---"))
            self.stdout.write(f"  Event: '{notif.event.name}' (ID: {notif.event.pk}) for user {notif.user.email}")
            
            # Format scheduled time for readability
            scheduled_time = timezone.localtime(notif.scheduled_send_time).strftime('%Y-%m-%d %H:%M:%S %Z')
            self.stdout.write(f"  Scheduled: {scheduled_time}")

            self.stdout.write(f"  Channel: {notif.get_channel_display()}")
            self.stdout.write("  Status: ", ending="")
            self.stdout.write(status_style(notif.status.upper()))
            self.stdout.write(f"  Provider SID: {notif.message_sid or 'N/A'}")
            self.stdout.write(f"  Failure Reason: {notif.failure_reason or 'None'}")
            self.stdout.write("\n")

        self.stdout.write(self.style.SUCCESS("--- Inspection Complete ---"))
