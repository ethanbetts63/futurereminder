from django.conf import settings
from django.utils import timezone
from users.models import User
from users.utils.hash_value import hash_value
from events.models import Notification


def anonymize_user(user: User):
    """
    Orchestrates the full user anonymization process.

    This function implements the steps defined in the user deletion workflow:
    1. Cancels all pending notifications for the user.
    2. Hashes all personally identifiable information (PII) into `hash_` fields.
    3. Wipes the original PII fields.
    4. Replaces the unique email field with a placeholder.
    5. Deactivates the user account to prevent future logins.
    """
    # --- Step 1: Cancel Pending Notifications ---
    pending_notifications = Notification.objects.filter(user=user, status='pending')
    if pending_notifications.exists():
        pending_notifications.delete()

    # --- Step 2 & 3: Hash and Wipe PII ---
    salt = getattr(settings, 'HASHING_SALT', None)
    if not salt:
        # In a real scenario, you might raise an exception or handle this more gracefully.
        # For now, we abort silently if the salt is not configured.
        return

    # --- Anonymize Sent Notification History ---
    # We need to hash the PII stored in the recipient_contact_info of sent notifications.
    notifications_to_update = Notification.objects.filter(user=user, status__in=['sent', 'failed', 'completed'])
    for notification in notifications_to_update:
        if notification.recipient_contact_info:
            notification.recipient_contact_info = hash_value(notification.recipient_contact_info, salt)
            notification.save(update_fields=['recipient_contact_info'])

    # A mapping of original PII fields to their `hash_` counterparts.
    pii_fields_to_hash = {
        'first_name': 'hash_first_name',
        'last_name': 'hash_last_name',
        'country_code': 'hash_country_code',
        'phone': 'hash_phone',
        'backup_email': 'hash_backup_email',
        'facebook_handle': 'hash_facebook_handle',
        'instagram_handle': 'hash_instagram_handle',
        'snapchat_handle': 'hash_snapchat_handle',
        'x_handle': 'hash_x_handle',
    }
    
    # Hash email separately as it's a special case
    if user.email:
        user.hash_email = hash_value(user.email, salt)

    for field_name, hash_field_name in pii_fields_to_hash.items():
        original_value = getattr(user, field_name, None)
        if original_value:
            # Hash the value and store it
            hashed_value = hash_value(original_value, salt)
            setattr(user, hash_field_name, hashed_value)
            # Wipe the original value
            setattr(user, field_name, "")
    
    # --- Step 4: Overwrite Unique Email Field ---
    user.email = f"deleted_{user.pk}@deleted.com"
    user.username = f"deleted_user_{user.pk}" # Also anonymize the username to be safe

    # --- Step 5: Deactivate Account ---
    user.is_active = False
    user.anonymized_at = timezone.now()
    user.save()
