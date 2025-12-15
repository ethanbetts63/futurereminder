// src/api.ts
import { authedFetch } from '@/apiClient';
import type { ProfileCreationData } from "@/forms/ProfileCreationForm";
import type { AppConfig, AuthResponse, Event, UserProfile, EmergencyContact, FaqItem, Tier, TermsAndConditions } from "@/types";

/**
 * A centralized module for all API interactions.
 */

// --- Helper Functions ---

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


// --- Configuration Endpoints ---

export async function getAppConfig(): Promise<AppConfig> {
  const response = await fetch('/api/products/single-event-price/');
  return handleResponse(response);
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
  const response = await authedFetch('/api/users/claim/', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return handleResponse(response);
}


// --- Legal Endpoints ---

export async function getLatestTermsAndConditions(): Promise<TermsAndConditions> {
    const response = await fetch('/api/terms/latest/');
    return handleResponse(response);
}


// --- FAQ Endpoint ---

export async function getFaqs(page: string): Promise<FaqItem[]> {
    const response = await authedFetch(`/api/faqs/?page=${page}`, {
        method: 'GET',
    });
    return handleResponse(response);
}

// --- Event Endpoints ---

export async function getEvents(): Promise<Event[]> {
    const response = await authedFetch('/api/events/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function getEvent(id: string): Promise<Event> {
    const response = await authedFetch(`/api/events/${id}/`, {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function createAuthenticatedEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await authedFetch('/api/events/', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    const response = await authedFetch(`/api/events/${id}/`, {
        method: 'PATCH', // PATCH is for partial updates
        body: JSON.stringify(eventData),
    });
    return handleResponse(response);
}

export async function deleteEvent(id: number): Promise<void> {
    const response = await authedFetch(`/api/events/${id}/`, {
        method: 'DELETE',
    });
    await handleResponse(response);
}

export async function activateFreeEvent(eventId: number): Promise<Event> {
    const response = await authedFetch(`/api/events/${eventId}/activate/`, {
        method: 'POST',
    });
    return handleResponse(response);
}


// --- User Profile & Settings Endpoints ---

export async function getDashboardAnalytics(): Promise<any[]> {
    const response = await authedFetch('/api/analytics/dashboard/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function getUserProfile(): Promise<UserProfile> {
    const response = await authedFetch('/api/users/me/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await authedFetch('/api/users/me/', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
    });
    return handleResponse(response);
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
    const response = await authedFetch('/api/emergency-contacts/', {
        method: 'GET',
    });
    return handleResponse(response);
}

export async function createEmergencyContact(contactData: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    const response = await authedFetch('/api/emergency-contacts/', {
        method: 'POST',
        body: JSON.stringify(contactData),
    });
    return handleResponse(response);
}

export async function updateEmergencyContact(id: number, contactData: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const response = await authedFetch(`/api/emergency-contacts/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(contactData),
    });
    return handleResponse(response);
}

export async function deleteEmergencyContact(id: number): Promise<void> {
    const response = await authedFetch(`/api/emergency-contacts/${id}/`, {
        method: 'DELETE',
    });
    await handleResponse(response);
}

// --- Payment Endpoints ---

export async function getTiers(): Promise<Tier[]> {
  const response = await authedFetch('/api/tiers/', {
    method: 'GET',
  });
  return handleResponse(response);
}

export async function createPaymentIntent(eventId: number, targetTierId: number): Promise<{ clientSecret: string }> {
  const response = await authedFetch('/api/payments/create-payment-intent/', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId, target_tier_id: targetTierId }),
  });
  return handleResponse(response);
}

export async function deleteAccount(): Promise<void> {
  const response = await authedFetch('/api/users/delete/', {
    method: 'DELETE',
  });
  await handleResponse(response);
}