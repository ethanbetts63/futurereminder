// src/api.ts
import { csrfFetch } from "@/utils/utils";
import type { ProfileCreationData } from "@/components/flow/ProfileCreationForm";
import type { AuthResponse, Event, UserProfile, EmergencyContact, FaqItem } from "@/types";

/**
 * A centralized module for all API interactions.
 */

// --- Helper Functions ---

/**
 * Creates the authorization headers for a JWT authenticated request.
 * @returns A Headers object with the Authorization bearer token.
 */
function getAuthHeaders(): Headers {
    const token = localStorage.getItem('accessToken');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
}

/**
 * A helper function to handle common API response logic.
 * It handles JSON parsing and throws a structured error on failure.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Handle successful but empty responses (e.g., from a DELETE request)
  if (response.status === 204) {
    return Promise.resolve(null as T);
  }

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.detail || 'An unknown API error occurred.');
    (error as any).data = data; // Attach the full error data for more specific handling
    throw error;
  }
  return data as T;
}


// --- Auth & Registration Endpoints ---

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });
  return handleResponse(response);
}

export async function registerUser(userData: ProfileCreationData): Promise<AuthResponse> {
  const response = await fetch('/api/users/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function claimAccount(password: string): Promise<{ detail: string }> {
  const response = await csrfFetch('/api/users/claim/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return handleResponse(response);
}


// --- FAQ Endpoint ---

export async function getFaqs(page: string): Promise<FaqItem[]> {
    const response = await fetch(`/api/faqs/?page=${page}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
}

// --- Event Endpoints ---

export async function getEvents(): Promise<Event[]> {
    const response = await fetch('/api/events/', {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
}

export async function createAuthenticatedEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await fetch('/api/events/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`/api/events/${id}/`, {
        method: 'PATCH', // PATCH is for partial updates
        headers: getAuthHeaders(),
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function deleteEvent(id: number): Promise<void> {
    const response = await fetch(`/api/events/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    await handleResponse(response);
}


// --- User Profile & Settings Endpoints ---

export async function getUserProfile(): Promise<UserProfile> {
    const response = await fetch('/api/users/me/', {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch('/api/users/me/', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
    });
    return handleResponse(response);
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
    const response = await fetch('/api/emergency-contacts/', {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
}

export async function createEmergencyContact(contactData: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    const response = await fetch('/api/emergency-contacts/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(contactData),
    });
    return handleResponse(response);
}

export async function updateEmergencyContact(id: number, contactData: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const response = await fetch(`/api/emergency-contacts/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(contactData),
    });
    return handleResponse(response);
}

export async function deleteEmergencyContact(id: number): Promise<void> {
    const response = await fetch(`/api/emergency-contacts/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    await handleResponse(response);
}

// --- Payment Endpoints ---

export async function createPaymentIntent(eventId: number): Promise<{ clientSecret: string }> {
  const response = await fetch('/api/payments/create-payment-intent/', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ event_id: eventId }),
  });
  return handleResponse(response);
}