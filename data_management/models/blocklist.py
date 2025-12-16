from django.db import models

class BlockedEmail(models.Model):
    """
    Stores email addresses that have opted out of all communications.
    """
    email = models.EmailField(
        unique=True, 
        db_index=True,
        help_text="The email address to block."
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="The date and time when the email was added to the blocklist."
    )

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "Blocked Email"
        verbose_name_plural = "Blocked Emails"
        ordering = ['-created_at']
