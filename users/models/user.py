from django.contrib.auth.models import AbstractUser
from django.db import models
from data_management.models import TermsAndConditions

class User(AbstractUser):
    """
    Custom user model that includes fields for various contact methods
    and fields to support data anonymization upon account deletion.
    """
    # Primary contact details (email, first_name, last_name are inherited)
    country_code = models.CharField(max_length=5, blank=True)
    phone = models.CharField(max_length=20, blank=True)

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

    # --------------------------------------------------------------------------
    # Anonymization Fields
    # These fields store the hashes of PII and are only populated upon account
    # deletion. The original PII fields are then wiped.
    # --------------------------------------------------------------------------
    
    anonymized_at = models.DateTimeField(
        null=True,
        blank=True,
        editable=False,
        help_text="Timestamp of when the account was anonymized."
    )
    
    # Hashed versions of user PII for audit purposes.
    # CharField with max_length=64 for SHA-256 hashes.
    hash_first_name = models.CharField(max_length=64, blank=True, editable=False)
    hash_last_name = models.CharField(max_length=64, blank=True, editable=False)
    hash_email = models.CharField(max_length=64, blank=True, editable=False, db_index=True)
    hash_country_code = models.CharField(max_length=64, blank=True, editable=False)
    hash_phone = models.CharField(max_length=64, blank=True, editable=False)
    hash_backup_email = models.CharField(max_length=64, blank=True, editable=False)
    hash_facebook_handle = models.CharField(max_length=64, blank=True, editable=False)
    hash_instagram_handle = models.CharField(max_length=64, blank=True, editable=False)
    hash_snapchat_handle = models.CharField(max_length=64, blank=True, editable=False)
    hash_x_handle = models.CharField(max_length=64, blank=True, editable=False)

    def __str__(self):
        return self.username