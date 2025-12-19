import factory
from factory.django import DjangoModelFactory
from data_management.models import BlockedEmail

class BlockedEmailFactory(DjangoModelFactory):
    class Meta:
        model = BlockedEmail
        django_get_or_create = ('email',)

    email = factory.Faker('email')
