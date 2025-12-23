import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from events.models import Notification
from .event_factory import EventFactory
from users.tests.factories.user_factory import UserFactory
import pytz

class NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Notification

    event = SubFactory(EventFactory)
    user = SubFactory(UserFactory)
    scheduled_send_time = Faker('future_datetime', tzinfo=pytz.utc)
    channel = factory.Iterator([choice[0] for choice in Notification.CHANNEL_CHOICES])
    status = factory.Iterator([choice[0] for choice in Notification.STATUS_CHOICES])
    recipient_contact_info = Faker('email')
