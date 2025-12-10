from django.db import models
from django.conf import settings

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

    class Meta:
        ordering = ['-event_date']
