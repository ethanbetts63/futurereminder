from django.db import models
from django.conf import settings
from events.models import Event

class Notification(models.Model):
    """
    Represents a single, scheduled communication to be sent for a specific event.
    """
    
    CHANNEL_CHOICES = [
        ('primary_email', 'Primary Email'),
        ('primary_sms', 'Primary SMS'),
        ('backup_email', 'Backup Email'),
        ('backup_sms', 'Backup SMS'),
        ('admin_call', 'Admin Call Task'),
        ('social_media', 'Social Media Outreach Task'),
        ('emergency_contact', 'Emergency Contact Outreach'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    scheduled_send_time = models.DateTimeField(db_index=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', db_index=True)
    
    # This will be populated with the contact info that was used at the time of sending.
    recipient_contact_info = models.CharField(
        max_length=255,
        help_text="The contact info used for sending. Populated after the notification is sent.",
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification for {self.event.title} to {self.user.email} via {self.get_channel_display()} on {self.scheduled_send_time}"

    class Meta:
        ordering = ['scheduled_send_time']
        indexes = [
            models.Index(fields=['status', 'scheduled_send_time']),
        ]