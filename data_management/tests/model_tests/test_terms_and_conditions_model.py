import pytest
from data_management.models import TermsAndConditions
from data_management.tests.factories.terms_and_conditions_factory import TermsAndConditionsFactory

@pytest.mark.django_db
def test_terms_and_conditions_creation():
    """
    Tests that a TermsAndConditions instance can be created successfully.
    """
    terms = TermsAndConditionsFactory()
    assert isinstance(terms, TermsAndConditions)
    assert terms.version is not None
    assert terms.content is not None
    assert terms.published_at is not None

@pytest.mark.django_db
def test_terms_and_conditions_str_method():
    """
    Tests the __str__ method of the TermsAndConditions model.
    """
    terms = TermsAndConditionsFactory(version="1.0")
    assert str(terms) == "Terms and Conditions v1.0"