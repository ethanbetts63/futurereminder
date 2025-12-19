import pytest
from data_management.models import FAQ
from data_management.tests.factories.faq_factory import FAQFactory

@pytest.mark.django_db
def test_faq_creation():
    """
    Tests that a FAQ instance can be created successfully.
    """
    faq = FAQFactory()
    assert isinstance(faq, FAQ)
    assert faq.question is not None
    assert faq.answer is not None
    assert faq.pages is not None

@pytest.mark.django_db
def test_faq_str_method():
    """
    Tests the __str__ method of the FAQ model.
    """
    faq = FAQFactory(question="What is the meaning of life?")
    assert str(faq) == "What is the meaning of life?"