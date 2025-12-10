from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom user model that includes fields for various contact methods.
    """
    # Primary contact details (email is inherited from AbstractUser)
    phone = models.CharField(max_length=20)

    # Backup contact details
    backup_phone = models.CharField(max_length=20, blank=True, null=True)
    backup_email = models.EmailField(blank=True, null=True)

    # Social media handles
    facebook_handle = models.CharField(max_length=255, blank=True, null=True)
    instagram_handle = models.CharField(max_length=255, blank=True, null=True)
    snapchat_handle = models.CharField(max_length=255, blank=True, null=True)
    x_handle = models.CharField(max_length=255, blank=True, null=True)


    def __str__(self):
        return self.username