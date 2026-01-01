from django.db import models

class Tier(models.Model):
    """
    Represents a pricing tier for an event, such as "Automated" or "Full Escalation".
    This model connects to Stripe's Product object. Pricing is handled by the associated Price model.
    """
    name = models.CharField(
        max_length=255, 
        unique=True, 
        help_text="The name of the tier."
    )
    description = models.TextField(
        blank=True,
        help_text="A customer-facing description of the tier's features."
    )
    manifest = models.JSONField(
        default=list,
        help_text="A list of notification channel strings defining the schedule for this tier."
    )
    stripe_product_id = models.CharField(
        max_length=255, 
        blank=True,
        help_text="The corresponding Product ID from Stripe."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Indicates if the tier is currently available for selection."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
