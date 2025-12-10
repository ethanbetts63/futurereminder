// src/types/index.ts

export interface AuthResponse {
    refresh: string;
    access: string;
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}

export interface EventCreationResponse {
    event: {
        name: string;
        event_date: string;
        notes: string | null;
    };
    user: {
        email: string;
    };
}

export interface Event {
    id: number;
    name:string;
    notes: string | null;
    event_date: string;
    weeks_in_advance: number;
    user: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    backup_phone: string | null;
    backup_email: string | null;
    facebook_handle: string | null;
    instagram_handle: string | null;
    snapchat_handle: string | null;
    x_handle: string | null;
}

export interface EmergencyContact {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string | null;
    relationship: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
