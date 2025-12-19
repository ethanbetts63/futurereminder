import pytest
from data_management.models import BlockedEmail
from data_management.tests.factories.blocked_email_factory import BlockedEmailFactory

@pytest.mark.django_db
def test_blocked_email_creation():
    """
    Tests that a BlockedEmail instance can be created successfully.
    """
    blocked_email = BlockedEmailFactory()
    assert isinstance(blocked_email, BlockedEmail)
    assert blocked_email.email is not None

@pytest.mark.django_db
def test_blocked_email_str_method():
    """
    Tests the __str__ method of the BlockedEmail model.
    """
    blocked_email = BlockedEmailFactory(email="test@example.com")
    assert str(blocked_email) == "test@example.com"