# notifications/tests/factories/notification_factory.py
import factory
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
from django.utils import timezone
from notifications.models import Notification
from users.tests.factories.user_factory import UserFactory
from events.tests.factories.event_factory import EventFactory

class NotificationFactory(DjangoModelFactory):
    class Meta:
        model = Notification

    event = SubFactory(EventFactory)
    user = SubFactory(UserFactory)
    scheduled_send_time = Faker('future_datetime', tzinfo=factory.LazyFunction(timezone.get_current_timezone))
    channel = factory.Iterator([choice[0] for choice in Notification.CHANNEL_CHOICES])
    status = factory.Iterator([choice[0] for choice in Notification.STATUS_CHOICES])
    recipient_contact_info = Faker('email')