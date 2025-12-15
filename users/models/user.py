from django.contrib.auth.models import AbstractUser
from django.db import models
from data_management.models import TermsAndConditions

class User(AbstractUser):
    """
    Custom user model that includes fields for various contact methods.
    """
    # Primary contact details (email is inherited from AbstractUser)
    phone = models.CharField(max_length=20)

    # Backup contact details
    backup_email = models.EmailField(blank=True, null=True)

    # Social media handles
    facebook_handle = models.CharField(max_length=255, blank=True, null=True)
    instagram_handle = models.CharField(max_length=255, blank=True, null=True)
    snapchat_handle = models.CharField(max_length=255, blank=True, null=True)
    x_handle = models.CharField(max_length=255, blank=True, null=True)

    # Legal
    agreed_to_terms = models.ForeignKey(
        TermsAndConditions,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users"
    )

    def __str__(self):
        return self.username