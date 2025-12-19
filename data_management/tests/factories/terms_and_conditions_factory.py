import factory
from factory.django import DjangoModelFactory
from data_management.models import TermsAndConditions
import pytz

class TermsAndConditionsFactory(DjangoModelFactory):
    class Meta:
        model = TermsAndConditions
        django_get_or_create = ('version',)

    version = factory.Faker('bothify', text='?.#')
    content = factory.Faker('paragraph')
    published_at = factory.Faker('date_time', tzinfo=pytz.UTC)