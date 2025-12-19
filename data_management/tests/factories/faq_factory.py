import factory
from factory.django import DjangoModelFactory
from data_management.models import FAQ

class FAQFactory(DjangoModelFactory):
    class Meta:
        model = FAQ
        django_get_or_create = ('question',)

    question = factory.Faker('sentence')
    answer = factory.Faker('paragraph')
    pages = factory.Faker('json')
