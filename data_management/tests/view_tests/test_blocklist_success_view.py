import pytest
from django.urls import reverse
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db

@pytest.fixture
def api_client():
    return APIClient()

def test_blocklist_success_view(api_client):
    """
    Test that the blocklist success view returns a 200 OK.
    """
    url = reverse('data_management:blocklist_success')
    response = api_client.get(url)
    assert response.status_code == 200
