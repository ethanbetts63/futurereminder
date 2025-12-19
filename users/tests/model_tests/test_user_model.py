import pytest
from users.models import User
from users.tests.factories.user_factory import UserFactory

@pytest.mark.django_db
def test_user_creation():
    """
    Tests that a User instance can be created successfully.
    """
    user = UserFactory()
    assert isinstance(user, User)
    assert user.username is not None

@pytest.mark.django_db
def test_user_str_method():
    """
    Tests the __str__ method of the User model.
    """
    user = UserFactory(username="testuser")
    assert str(user) == "testuser"