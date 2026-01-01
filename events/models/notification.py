from django.db import models
from django.conf import settings
from .event import Event
from ..utils.send_reminder_email import send_reminder_email
from ..utils.send_reminder_sms import send_reminder_sms

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
        ('in_progress', 'In Progress'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('delivered', 'Delivered'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
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
        max_length=40, 
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

    class Meta:
        ordering = ['scheduled_send_time']
        indexes = [
            models.Index(fields=['status', 'scheduled_send_time']),
            models.Index(fields=['message_sid']),
        ]