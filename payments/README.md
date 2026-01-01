# Payments App

The `payments` Django app handles all payment-related functionality for the FutureReminder application, integrating with Stripe for secure one-time transactions to activate user events. This app is designed with a strong emphasis on decoupled state management and webhook-driven fulfillment to ensure reliability and security.

## Architecture and Core Concepts

### Decoupled State Management
Instead of merely adding a "paid" status to the existing `Event` model, the system utilizes a dedicated `Payment` model. This design separates the concerns of event management from transaction tracking. The `Payment` model serves as a ledger for all transactions, while the `Event` model's `is_active` status is derived from a successful payment, making the system more robust and scalable.

### Webhook-Driven Fulfillment
Event activation is handled by a backend webhook, rather than directly by the user's browser session. Upon successful payment confirmation from Stripe, a secure, server-to-server message is sent to our webhook endpoint. This endpoint then processes the payment, activates the associated event, and updates its tier. This method ensures events are only activated after payment is fully confirmed, enhancing reliability and security.

## Key Features

*   **Stripe Integration**: Seamlessly integrates with Stripe for processing one-time payments.
*   **Tier-Based Pricing**: Supports various pricing tiers, each linked to specific event functionalities and notification schedules.
*   **Secure Payment Flow**: Utilizes Stripe PaymentIntents and webhooks for a secure and asynchronous payment processing flow.
*   **Admin Notifications**: Sends automated email and SMS notifications to administrators upon successful payments.

## File Breakdown

### Models
*   `payments/models/tier.py`: Defines the `Tier` model, representing different pricing levels (e.g., "Automated", "Full Escalation"). These tiers correspond to Stripe Product objects and include a `manifest` (JSONField) detailing notification channel schedules.
*   `payments/models/price.py`: Defines the `Price` model, which specifies the cost for a `Tier`. It aligns with Stripe's Price object, supports one-time (and potentially recurring) payments, and stores Stripe Price IDs.
*   `payments/models/payment.py`: Defines the `Payment` model, which records individual transactions. It tracks status (`pending`, `succeeded`, `failed`), amount, links to the `User` and `Event`, and stores the Stripe `PaymentIntent` ID.

### Views
*   `payments/views/create_payment_intent.py`: Handles the creation of Stripe PaymentIntents. The frontend calls this authenticated API endpoint to initiate a payment, which results in a `Payment` record being created in the local database and a `PaymentIntent` on Stripe. It returns the `clientSecret` needed by the frontend to complete the payment.
*   `payments/views/stripe_webhook.py`: This public endpoint listens for incoming webhook events from Stripe. It verifies the event's signature and processes events such as `payment_intent.succeeded` (to update `Payment` status, activate the associated `Event`, and upgrade its `Tier`) and `payment_intent.payment_failed`.
*   `payments/views/tier_list_view.py`: A public API endpoint that provides a list of all active pricing tiers, including their associated `Price` objects.

### Serializers
*   `payments/serializers/price_serializer.py`: Serializes data for the `Price` model.
*   `payments/serializers/tier_serializer.py`: Serializes data for the `Tier` model, including nested `Price` objects.

### Utilities
*   `payments/utils/send_admin_payment_notification.py`: A utility function responsible for sending email (via Mailgun) and SMS (via Twilio) notifications to the project administrators upon successful payment.

## Stripe Integration Flow

1.  **Fetch Tiers**: The frontend retrieves a list of available `Tiers` (pricing plans) from the `/api/payments/tiers/` endpoint (handled by `TierListView`).
2.  **Initiate Payment**: The user selects a `Tier` for an `Event` they wish to activate. The frontend then calls the `/api/payments/create-payment-intent/` endpoint (handled by `CreatePaymentIntentView`), providing the `event_id` and `target_tier_id`. This creates a `PaymentIntent` on Stripe and a `Payment` record in the local database, returning a `clientSecret` to the frontend.
3.  **Client-Side Payment**: The frontend uses the received `clientSecret` with Stripe's Elements library to collect the user's payment information securely and confirm the payment.
4.  **Webhook Notification**: Once Stripe processes the payment (successfully or with failure), it sends a webhook event to the `/api/payments/webhook/` endpoint (handled by `StripeWebhookView`).
5.  **Backend Fulfillment**: The `StripeWebhookView` verifies the webhook's authenticity. If the `payment_intent.succeeded` event is received, it updates the local `Payment` record's status, activates the associated `Event` by setting `is_active` to `True`, and assigns the `Event` to the `paid_tier`. An admin notification is also triggered. If `payment_intent.payment_failed` is received, the `Payment` record's status is updated accordingly.