import factory
from factory.django import DjangoModelFactory
from users.models import EmergencyContact
from .user_factory import UserFactory

class EmergencyContactFactory(DjangoModelFactory):
    class Meta:
        model = EmergencyContact

    user = factory.SubFactory(UserFactory)
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    relationship = factory.Faker('word')
    phone = factory.Faker('phone_number')
    email = factory.Faker('email')
