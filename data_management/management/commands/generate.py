from django.core.management.base import BaseCommand
from data_management.utils.generation_utils.faq_generator import FaqUpdateOrchestrator
from data_management.utils.generation_utils.product_generator import ProductUpdateOrchestrator

class Command(BaseCommand):
    help = 'Generates data for the application. Use flags to specify what to generate.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--faqs',
            action='store_true',
            help='Generate FAQs from the JSONL data file.',
        )
        parser.add_argument(
            '--products',
            action='store_true',
            help='Generate Products and Prices from the JSONL data file.',
        )

    def handle(self, *args, **options):
        something_generated = False
        if options['faqs']:
            something_generated = True
            self.stdout.write(self.style.SUCCESS('Starting FAQ generation...'))
            orchestrator = FaqUpdateOrchestrator(command=self)
            orchestrator.run()
        
        if options['products']:
            something_generated = True
            self.stdout.write(self.style.SUCCESS('Starting Product and Price generation...'))
            orchestrator = ProductUpdateOrchestrator(command=self)
            orchestrator.run()

        if not something_generated:
            self.stdout.write(self.style.WARNING(
                'No generation flag specified. Please use --faqs, --products, or other available options.'
            ))
