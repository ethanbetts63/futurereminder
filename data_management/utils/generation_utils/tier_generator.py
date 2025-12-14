import json
from django.conf import settings
from payments.models import Tier, Price

class TierUpdateOrchestrator:
    """
    Reads tier and price definitions from a JSONL file and updates the database.
    """
    def __init__(self, command):
        self.command = command
        self.tiers_file_path = settings.BASE_DIR / 'data_management' / 'data' / 'tiers.jsonl'

    def run(self):
        self.command.stdout.write(f"Loading tiers from {self.tiers_file_path}...")
        try:
            with open(self.tiers_file_path, 'r') as f:
                for line in f:
                    self._process_line(line)
            self.command.stdout.write(self.command.style.SUCCESS("Successfully processed all tiers and prices."))
        except FileNotFoundError:
            self.command.stdout.write(self.command.style.ERROR(f"{self.tiers_file_path} not found."))
        except Exception as e:
            self.command.stdout.write(self.command.style.ERROR(f"An error occurred: {e}"))

    def _process_line(self, line):
        data = json.loads(line)
        
        # Create or update the Tier
        tier, created = Tier.objects.update_or_create(
            name=data['tier_name'],
            defaults={
                'description': data['tier_description'],
                'stripe_product_id': data['stripe_product_id'],
            }
        )

        if created:
            self.command.stdout.write(self.command.style.SUCCESS(f"  Created new tier: {tier.name}"))
        else:
            self.command.stdout.write(self.command.style.NOTICE(f"  Updated existing tier: {tier.name}"))

        # Create or update the associated Price
        price, created = Price.objects.update_or_create(
            tier=tier,
            type=data['price_type'], # Assuming one price per type for a tier
            defaults={
                'amount': data['price'],
                'stripe_price_id': data['stripe_price_id'],
                'currency': 'usd',
            }
        )
        
        if created:
            self.command.stdout.write(self.command.style.SUCCESS(f"    - Created new price: ${price.amount} ({price.type})"))
        else:
            self.command.stdout.write(self.command.style.NOTICE(f"    - Updated existing price: ${price.amount} ({price.type})"))
