import pytest
from users.models import EmergencyContact
from users.tests.factories.emergency_contact_factory import EmergencyContactFactory

@pytest.mark.django_db
def test_emergency_contact_creation():
    """
    Tests that a EmergencyContact instance can be created successfully.
    """
    emergency_contact = EmergencyContactFactory()
    assert isinstance(emergency_contact, EmergencyContact)
    assert emergency_contact.user is not None

@pytest.mark.django_db
def test_emergency_contact_str_method():
    """
    Tests the __str__ method of the EmergencyContact model.
    """
    emergency_contact = EmergencyContactFactory()
    expected_str = f"{emergency_contact.first_name} {emergency_contact.last_name} (Emergency Contact for {emergency_contact.user.username})"
    assert str(emergency_contact) == expected_str