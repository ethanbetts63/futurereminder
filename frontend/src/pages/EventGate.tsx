// frontend/src/pages/EventGate.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '../components/Seo';

/**
 * This component acts as a gatekeeper for the event creation flow.
 * It checks the user's authentication status and redirects them to the
 * appropriate starting point.
 * - Authenticated users are sent directly to the event creation form.
 * - Anonymous users are sent to the beginning of the multi-step profile creation flow.
 */
const EventGate: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Don't do anything until the auth status is definitively known
        if (isLoading) {
            return;
        }

        if (isAuthenticated) {
            // Logged-in users jump straight to the final step
            navigate('/create-flow/event', { replace: true });
        } else {
            // Anonymous users start at the beginning of the wizard
            navigate('/create-flow/profile', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Render a loading indicator while we determine the auth state
    return (
        <div className="container mx-auto flex justify-center items-center h-screen">
            <Seo
                title="Create a Long-Term Reminder Event | FutureReminder"
                description="Start here to create a new persistent, long-term reminder. We'll guide you through setting up your event and notification preferences."
                canonicalPath="/event-gate"
                noindex={true}
            />
            <div className="text-center">
                <p className="text-lg font-semibold">Preparing your workspace...</p>
                <p className="text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
};

export default EventGate;