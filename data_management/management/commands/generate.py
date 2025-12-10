from django.core.management.base import BaseCommand
from data_management.utils.generation_utils.faq_generator import FaqUpdateOrchestrator

class Command(BaseCommand):
    help = 'Generates data for the application. Use flags to specify what to generate.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--faqs',
            action='store_true',
            help='Generate FAQs from the JSONL data file.',
        )

    def handle(self, *args, **options):
        if options['faqs']:
            self.stdout.write(self.style.SUCCESS('Starting FAQ generation...'))
            orchestrator = FaqUpdateOrchestrator(command=self)
            orchestrator.run()
        else:
            self.stdout.write(self.style.WARNING(
                'No generation flag specified. Please use --faqs or other available options.'
            ))
