from django.db import models
from django.conf import settings
from datetime import timedelta

class Event(models.Model):
    """
    Represents a single reminder event created by a user.
    """
    # Core Event Details
    name = models.CharField(
        max_length=255,
        help_text="The name or title of the event."
    )
    event_date = models.DateField(
        help_text="The date the event will occur."
    )
    weeks_in_advance = models.PositiveIntegerField(
        default=4,
        help_text="The number of weeks in advance to start sending notifications."
    )
    notification_start_date = models.DateField(
        editable=False,
        null=True,
        blank=True,
        help_text="The auto-calculated date when notifications will begin."
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Optional notes to provide more context about the event."
    )

    # Ownership and Status
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="events",
        help_text="The user who owns this event."
    )
    is_active = models.BooleanField(
        default=False,
        help_text="Whether the event is active and notifications should be sent. Activated upon successful payment."
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"'{self.name}' on {self.event_date} for {self.user.username}"

    def save(self, *args, **kwargs):
        # Import services here to avoid circular dependency at startup
        from notifications.services import schedule_notifications_for_event, clear_pending_notifications

        # Auto-calculate the notification start date before saving
        if self.event_date and self.weeks_in_advance:
            self.notification_start_date = self.event_date - timedelta(weeks=self.weeks_in_advance)
        
        super().save(*args, **kwargs)

        # After saving, trigger notification scheduling or clearing.
        # We wrap this in a try/except block to ensure that a failure in the
        # notification scheduling logic does not prevent the event itself from
        # being saved, which is the more critical operation.
        try:
            if self.is_active:
                schedule_notifications_for_event(self)
            else:
                clear_pending_notifications(self)
        except Exception:
            # If any error occurs during notification scheduling, we'll ignore it
            # and allow the event saving to succeed.
            pass

    class Meta:
        ordering = ['-event_date']
