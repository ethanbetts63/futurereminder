from notifications.models import Notification

def clear_pending_notifications(event: 'Event'):
    """
    Deletes all notifications with a 'pending' status for a given event.
    """
    from events.models import Event
    Notification.objects.filter(event=event, status='pending').delete()

def _create_notification(event, channel, send_time, contact_info):
    """
    Helper function to create a Notification object if contact info is present.
    """
    if not contact_info:
        return
    
    Notification.objects.create(
        event=event,
        user=event.user,
        channel=channel,
        scheduled_send_time=send_time,
        recipient_contact_info=contact_info,
    )

def schedule_notifications_for_event(event: 'Event'):
    """
    Generates the entire notification schedule for a given event based on a 
    6-block, non-cumulative escalation logic.

    This function should be called whenever an event is created or updated.
    """
    from events.models import Event
    # 1. Clear any existing pending notifications for this event
    clear_pending_notifications(event)

    # 2. Basic validation and date calculation
    user = event.user
    if not event.notification_start_date or not event.event_date or event.notification_start_date >= event.event_date:
        return

    duration = event.event_date - event.notification_start_date
    block_length = duration / 6

    # 3. Loop through the 6 blocks and create notifications
    for i in range(6):
        block_start_date = event.notification_start_date + (block_length * i)
        # The last block should end exactly on the event date
        block_end_date = event.notification_start_date + (block_length * (i + 1)) if i < 5 else event.event_date

        # --- Always-on Notifications ---
        _create_notification(event, 'primary_email', block_start_date, user.email)
        _create_notification(event, 'primary_sms', block_end_date, user.phone)

        # --- Block-specific Escalations (Non-Cumulative) ---
        
        # Block 2: Backup contacts
        if i == 1:
            _create_notification(event, 'backup_email', block_start_date, user.backup_email)

        # Block 3: Admin phone call task
        elif i == 2:
            _create_notification(event, 'admin_call', block_start_date, user.phone)

        # Block 4: Social media outreach task
        elif i == 3:
            handles = [
                f"X: {user.x_handle}" if user.x_handle else None,
                f"Facebook: {user.facebook_handle}" if user.facebook_handle else None,
                f"Instagram: {user.instagram_handle}" if user.instagram_handle else None,
                f"Snapchat: {user.snapchat_handle}" if user.snapchat_handle else None,
            ]
            social_info = ", ".join(filter(None, handles))
            _create_notification(event, 'social_media', block_start_date, social_info)

        # Block 6: Emergency contacts outreach
        elif i == 5:
            emergency_contacts = user.emergency_contacts.all()
            if not emergency_contacts:
                continue
            
            for contact in emergency_contacts:
                # Prioritize email, fall back to phone
                contact_info = contact.email if contact.email else contact.phone
                # Add context for the recipient
                full_contact_details = f"{contact_info} (For: {user.first_name} {user.last_name}, Relation: {contact.relationship})"
                _create_notification(event, 'emergency_contact', block_start_date, full_contact_details)
