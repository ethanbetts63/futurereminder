from django.db import models

class Product(models.Model):
    """
    Represents a purchasable item in the system, like a "Single Event Reminder"
    or a "Pack of 5 Credits". This aligns with Stripe's Product object.
    """
    name = models.CharField(
        max_length=255, 
        unique=True, 
        help_text="The internal name of the product."
    )
    description = models.TextField(
        blank=True,
        help_text="A customer-facing description of the product."
    )
    stripe_product_id = models.CharField(
        max_length=255, 
        blank=True,
        help_text="The corresponding Product ID from Stripe, for synchronization."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Indicates if the product is currently available for purchase."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
