from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from rest_framework.request import Request

from ..models import Notification

@csrf_exempt
@transaction.atomic
def twilio_status_webhook(request: Request) -> HttpResponse:
    """
    Handles status update webhooks from Twilio.

    Updates the Notification status based on the final delivery status
    reported by Twilio.
    """
    if request.method == 'POST':
        # Data is form-encoded
        message_sid = request.POST.get('MessageSid')
        message_status = request.POST.get('MessageStatus')

        if not message_sid:
            return HttpResponse(status=400) # Bad Request if no SID

        try:
            notification = Notification.objects.select_for_update().get(message_sid=message_sid)
        except Notification.DoesNotExist:
            # If we don't have this SID, we can't do anything.
            # Return 200 so Twilio doesn't retry.
            return HttpResponse(status=200)

        # Map Twilio statuses to our model's statuses
        if message_status == 'delivered':
            notification.status = 'delivered'
        elif message_status in ['failed', 'undelivered']:
            notification.status = 'failed'
            # Store the error code as the failure reason
            error_code = request.POST.get('ErrorCode')
            notification.failure_reason = f"Twilio Error Code: {error_code}"
        
        # We don't need to handle 'sent', 'queued', etc. as we only
        # care about the terminal status.
        
        notification.save()

        return HttpResponse(status=200)

    return HttpResponse(status=405) # Method Not Allowed
