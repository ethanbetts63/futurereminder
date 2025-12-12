import json
from django.conf import settings
from payments.models import Product, Price

class ProductUpdateOrchestrator:
    """
    Orchestrates the update/creation of Products and Prices from a JSONL file.
    """
    def __init__(self, command):
        self.command = command
        self.products_file_path = settings.BASE_DIR / 'data_management' / 'data' / 'products.jsonl'

    def run(self):
        self.command.stdout.write(self.command.style.WARNING("Deleting all existing Products and Prices..."))
        price_count, _ = Price.objects.all().delete()
        product_count, _ = Product.objects.all().delete()
        self.command.stdout.write(self.command.style.SUCCESS(f"Deleted {product_count} Products and {price_count} Prices."))

        self.command.stdout.write(f"Importing products from {self.products_file_path}...")

        with open(self.products_file_path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    data = json.loads(line)
                    product_data = data['product']
                    price_data_list = data['prices']

                    # Create or update the Product
                    product, created = Product.objects.update_or_create(
                        name=product_data['name'],
                        defaults={'description': product_data.get('description', '')}
                    )
                    
                    if created:
                        self.command.stdout.write(self.command.style.SUCCESS(f"Created Product: {product.name}"))
                    else:
                        self.command.stdout.write(self.command.style.WARNING(f"Updated Product: {product.name}"))

                    # Create or update associated Prices
                    for price_data in price_data_list:
                        price, price_created = Price.objects.update_or_create(
                            product=product,
                            amount=price_data['amount'],
                            type=price_data['type'],
                            defaults={
                                'currency': price_data.get('currency', 'usd'),
                                'recurring_interval': price_data.get('recurring_interval')
                            }
                        )
                        if price_created:
                            self.command.stdout.write(self.command.style.SUCCESS(f"  - Created Price: {price}"))
                        else:
                            self.command.stdout.write(self.command.style.WARNING(f"  - Updated Price: {price}"))

                except json.JSONDecodeError:
                    self.command.stderr.write(self.command.style.ERROR(f"Skipping invalid line: {line.strip()}"))
                except KeyError as e:
                    self.command.stderr.write(self.command.style.ERROR(f"Skipping line with missing key {e}: {line.strip()}"))

        self.command.stdout.write(self.command.style.SUCCESS("Product and Price import complete."))
