from django.db import models
from django.conf import settings
from .event import Event

class Notification(models.Model):
    """
    Represents a single, scheduled communication to be sent for a specific event.
    """
    
    CHANNEL_CHOICES = [
        ('primary_email', 'Primary Email'),
        ('primary_sms', 'Primary SMS'),
        ('backup_email', 'Backup Email'),
        ('backup_sms', 'Backup SMS'),
        ('social_media', 'Social Media Outreach Task'),
        ('emergency_contact_email', 'Emergency Contact Email'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('delivered', 'Delivered'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('admin_task_created', 'Admin Task Created'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    scheduled_send_time = models.DateTimeField(db_index=True)
    channel = models.CharField(max_length=30, choices=CHANNEL_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    
    recipient_contact_info = models.CharField(
        max_length=255,
        help_text="The contact info used for sending. Populated after the notification is sent.",
        null=True,
        blank=True
    )

    message_sid = models.CharField(
        max_length=255, 
        null=True, 
        blank=True, 
        unique=True, 
        db_index=True,
        help_text="The unique identifier for the message from the provider (e.g., Twilio SID)."
    )

    failure_reason = models.TextField(
        null=True, 
        blank=True,
        help_text="Reason for failure, captured from provider or sending exception."
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification for {self.event.name} to {self.user.email} via {self.get_channel_display()} on {self.scheduled_send_time}"

    def save(self, *args, **kwargs):
        # --- Handle Social Media Task Creation ---
        # On the first save of a 'social_media' notification, intercept it,
        # create the admin tasks, and update the status.
        if self._state.adding and self.channel == 'social_media':
            # Local import to prevent circular dependency
            from ..utils.create_admin_tasks_for_notification import create_admin_tasks_for_notification
            
            try:
                tasks_created = create_admin_tasks_for_notification(self)
                if tasks_created > 0:
                    self.status = 'admin_task_created'
                    self.failure_reason = f"Successfully generated {tasks_created} admin task(s)."
                else:
                    self.status = 'failed'
                    self.failure_reason = "User has no social media handles specified."
            except Exception as e:
                # Catch exceptions from the utility (e.g., Admin user not found)
                self.status = 'failed'
                self.failure_reason = f"Failed to create admin tasks: {e}"

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['scheduled_send_time']
        indexes = [
            models.Index(fields=['status', 'scheduled_send_time']),
            models.Index(fields=['message_sid']),
        ]