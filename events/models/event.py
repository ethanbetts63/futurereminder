from django.db import models
from django.conf import settings
from datetime import timedelta
from django.core.exceptions import ValidationError

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
    tier = models.ForeignKey(
        'payments.Tier',
        on_delete=models.PROTECT, # Don't allow deleting a tier that has events
        related_name="events",
        help_text="The pricing tier for this event.",
        null=True, # Will be set during creation
        blank=True,
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
        # Local import to prevent circular dependency
        from ..utils.schedule_notifications_for_event import schedule_notifications_for_event

        # Auto-calculate the notification start date before saving
        if self.event_date and self.weeks_in_advance is not None:
            self.notification_start_date = self.event_date - timedelta(weeks=self.weeks_in_advance)
        
        # Data integrity check for paid, active events
        if self.tier:
            # A tier is considered "paid" if it has an active, one-time price > 0.
            is_paid_tier = self.tier.prices.filter(
                is_active=True,
                type='one_time',
                amount__gt=0
            ).exists()

            if self.is_active and is_paid_tier:
                # If the event is active and for a paid tier, it must have a successful payment.
                if not self.payments.filter(status='succeeded').exists():
                    raise ValidationError(
                        "An active event with a paid tier must have a successful payment record."
                    )
        
        super().save(*args, **kwargs)
        
        # After saving, regenerate the notification schedule.
        # This function will clear pending notifications and create a new schedule
        # based on the event's current state (tier, dates, active status).
        schedule_notifications_for_event(self)

    class Meta:
        ordering = ['-event_date']
