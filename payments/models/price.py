from django.db import models

class Price(models.Model):
    """
    Represents the price of a specific Product. A Product can have multiple Prices.
    This aligns with Stripe's Price object.
    """
    class PriceType(models.TextChoices):
        ONE_TIME = 'one_time', 'One-Time'
        RECURRING = 'recurring', 'Recurring'

    class Interval(models.TextChoices):
        MONTH = 'month', 'Month'
        YEAR = 'year', 'Year'

    product = models.ForeignKey(
        'payments.Product', 
        on_delete=models.CASCADE, 
        related_name='prices'
    )
    stripe_price_id = models.CharField(
        max_length=255, 
        blank=True,
        help_text="The corresponding Price ID from Stripe, for synchronization."
    )
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="The price amount."
    )
    currency = models.CharField(
        max_length=3, 
        default='usd',
        help_text="The three-letter ISO currency code."
    )
    type = models.CharField(
        max_length=10,
        choices=PriceType.choices,
        default=PriceType.ONE_TIME,
        help_text="Whether the price is for a one-time purchase or a subscription."
    )
    recurring_interval = models.CharField(
        max_length=10,
        choices=Interval.choices,
        null=True,
        blank=True,
        help_text="The frequency at which a subscription is billed. Required if type is 'recurring'."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Indicates if this price is currently active."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.type == 'recurring':
            return f"{self.product.name} - ${self.amount}/{self.recurring_interval}"
        return f"{self.product.name} - ${self.amount} (One-Time)"
