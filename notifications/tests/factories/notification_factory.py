import factory
from factory.django import DjangoModelFactory
from notifications.models import Notification
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory
from faker import Faker
import pytz

fake = Faker()

class NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Notification

    event = factory.SubFactory(EventFactory)
    user = factory.SubFactory(UserFactory)
    scheduled_send_time = factory.LazyFunction(lambda: fake.date_time_this_decade(tzinfo=pytz.UTC))
    channel = factory.Iterator([choice[0] for choice in Notification.CHANNEL_CHOICES])
    status = factory.Iterator([choice[0] for choice in Notification.STATUS_CHOICES])
    recipient_contact_info = factory.LazyAttribute(lambda obj: obj.user.email)