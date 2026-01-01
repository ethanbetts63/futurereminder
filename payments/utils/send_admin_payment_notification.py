import logging
from django.conf import settings
from events.utils.send_reminder_email import send_reminder_email
from events.utils.send_reminder_sms import send_reminder_sms

logger = logging.getLogger(__name__)

def send_admin_payment_notification(payment_id: str):
    """
    Sends a notification to the admin via email and SMS after a successful payment.

    Args:
        payment_id: The ID of the successful payment, for logging purposes.
    """
    message = "Congratulations on getting paid. FutureReminder just made money."
    subject = "🎉 You Got Paid! 🎉"
    
    admin_email = settings.ADMIN_EMAIL
    admin_number = settings.ADMIN_NUMBER

    if not all([admin_email, admin_number]):
        logger.error(
            f"Admin contact details (ADMIN_EMAIL, ADMIN_NUMBER) are not fully configured. "
            f"Cannot send payment notification for payment_id: {payment_id}."
        )
        return

    try:
        # Send email to admin
        logger.info(f"Sending payment success email to admin for payment_id: {payment_id}")
        send_reminder_email(
            recipient_email=admin_email,
            subject=subject,
            body=message
        )

        # Send SMS to admin
        logger.info(f"Sending payment success SMS to admin for payment_id: {payment_id}")
        send_reminder_sms(
            to_number=admin_number,
            body=message
        )
        logger.info(f"Successfully sent admin payment notifications for payment_id: {payment_id}")

    except Exception as e:
        logger.error(
            f"An error occurred while sending admin payment notification for payment_id: {payment_id}. Error: {e}",
            exc_info=True
        )
