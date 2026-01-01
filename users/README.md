# Users App

## Purpose

The `users` app is the cornerstone of user management within the FutureReminder application. It is responsible for handling everything related to user identity, authentication, profile data, and the processes of account creation and deletion.

## Core Models

### `User`
This is the custom user model for the project (`AbstractUser`), extended to include a rich set of fields for robust communication and data privacy.

**Key Fields:**
*   **Primary Contact:** Inherits `email`, `first_name`, `last_name` from Django's auth system. Adds `country_code` and `phone`.
*   **Backup Contact:** `backup_email`, `secondary_backup_email`, `backup_phone`.
*   **Social Media:** Handles for Facebook, Instagram, Snapchat, and X.
*   **Account Status:**
    *   `is_email_verified`: A boolean flag set to `True` once a user clicks the verification link sent to their email.
    *   `verification_email_last_sent_at`: A timestamp to enable rate-limiting of the "Resend Verification" feature.
*   **Anonymization Fields:** A comprehensive set of `hash_*` fields (e.g., `hash_first_name`, `hash_email`) that store hashed PII upon account deletion to maintain system integrity while protecting user privacy.

### `EmergencyContact`
A simple model that links directly to a `User` account. Each user can have multiple emergency contacts.

## Key Flows & Business Logic

### User Registration Flow ("Upfront Account Creation")
The application uses a unified "upfront" registration strategy. There is no separate sign-up page or anonymous flow.

1.  **Initiation:** A user begins the process by clicking "Create an Event" from the homepage.
2.  **Account Creation:** The user is directed to the `ProfileCreationPage` (`/create-flow/profile`), where they provide their profile information and a password.
3.  **Backend Process:** The data is submitted to the `/api/users/register/` endpoint, which uses `RegisterSerializer` to create a new `User` instance.
4.  **Authentication:** Upon successful creation, the `RegisterView` immediately generates and returns JWT (Access and Refresh) tokens.
5.  **Session Start:** The frontend receives the tokens, logs the user in, and navigates them to the next step in the event creation flow (`/create-flow/contacts`).

### User Deletion (Anonymization) Flow
To comply with data privacy principles, user deletion is not a simple database record removal. Instead, it is an anonymization process triggered from the "Delete Account" section of the user's account page.

The logic is orchestrated by the `anonymize_user` utility function:
1.  **Cancel Pending Notifications:** All `Notification` objects linked to the user with a `pending` status are immediately and permanently deleted.
2.  **Hash PII:** The value of every PII field (e.g., `first_name`, `phone`) is securely hashed using a system salt. The resulting hash is stored in the corresponding `hash_*` field (e.g., `hash_first_name`).
3.  **Wipe PII:** The original PII fields are overwritten with empty strings. The `email` field, which has a `UNIQUE` constraint, is set to a placeholder value (`deleted_{user.pk}@deleted.com`).
4.  **Deactivate Account:** The user's `is_active` flag is set to `False` to prevent any future logins.
5.  **Timestamp:** An `anonymized_at` timestamp is recorded on the user model.

## API Endpoints

The following are the primary endpoints provided by this app, under the `/api/users/` prefix:

*   `register/`: `POST` - Creates a new user account. (Public)
*   `me/`: `GET`, `PATCH` - View or update the profile of the currently authenticated user.
*   `delete/`: `DELETE` - Initiates the account anonymization process for the authenticated user.
*   `change-password/`: `PUT` - Allows an authenticated user to change their password.
*   `emergency-contacts/`: `GET`, `POST` - Manages the emergency contacts for the authenticated user.
*   `emergency-contacts/<id>/`: `PATCH`, `DELETE` - Updates or deletes a specific emergency contact.
*   `verify-email/<uidb64>/<token>/`: `GET` - Endpoint hit from the verification email link. (Public)
*   `resend-verification/`: `POST` - Allows a logged-in user to request a new verification email.
*   `password-reset/request/`: `POST` - Allows a user to request a password reset link. (Public)
*   `password-reset/confirm/<uidb64>/<token>/`: `POST` - Allows a user to set a new password using a reset token. (Public)
