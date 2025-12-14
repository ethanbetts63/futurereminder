import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

import CheckoutForm from '../../forms/CheckoutForm';
import Summary from '../../components/Summary';
import { createPaymentIntent, getUserProfile, getEmergencyContacts } from '@/api';
import type { Event, UserProfile, EmergencyContact, Tier } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Seo from '@/components/Seo';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51RRCzbPH0oVkn2F1ZCB43p08cHzPiROnrVDvRbggNjvm4WAsDHhNy8gzd00qhxCItqk5Y8yhtRi9BJSIlt8dr8x100D0oG7sKC");

export default function PaymentPage() {
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [, setIsLoading] = useState(true);
  
  const event: Event | undefined = location.state?.event;
  const targetTier: Tier | undefined = location.state?.targetTier;

  useEffect(() => {
    // Fetch user profile and contacts
    Promise.all([getUserProfile(), getEmergencyContacts()])
      .then(([userProfile, emergencyContacts]) => {
        setProfile(userProfile);
        setContacts(emergencyContacts);
      })
      .catch(error => {
        toast.error("Failed to load user data", {
          description: error.message || "Could not fetch profile and contact details."
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Fetch payment intent
    if (event?.id && targetTier?.id) {
      createPaymentIntent(event.id, targetTier.id)
        .then(data => {
          setClientSecret(data.clientSecret);
        })
        .catch(error => {
          toast.error("Failed to initialize payment", {
            description: error.message || "Could not connect to the payment service."
          });
        });
    }
  }, [event, targetTier]);

  if (!event || !targetTier) {
    // If we land here without an event or a target tier, the flow is broken.
    // Send user back to the start of the creation flow.
    toast.error("Invalid state", { description: "Missing event or tier information for payment."});
    return <Navigate to="/create-flow/event" replace />;
  }
  
  const appearance: Appearance = {
    theme: 'stripe',
    rules: {
      '.Label': {
        color: 'var(--background)',
      },
    }
  };

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance,
  };

  const price = targetTier.prices.find(p => p.type === 'one_time')?.amount;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo title="Secure Payment | FutureReminder" />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Complete Your Payment</h1>
        <p className="text-muted-foreground">
          Secure your reminder for <strong>{event.name}</strong>.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:gap-12">
        {/* Left Column (Payment Form) */}
        <div className="order-2 md:order-1 w-full">
          <Card className="bg-foreground text-background">
            <CardHeader>
              <div className="text-center text-sm text-muted-foreground pb-2">
                <p>Powered by <span className="font-bold">Stripe</span></p>
              </div>
              <CardTitle className="text-3xl">Payment Details</CardTitle>
              <CardDescription className="text-black">Enter your card information below.</CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm eventId={event.id.toString()} />
                </Elements>
              ) : (
                <div className="flex justify-center items-center h-48">
                  <Spinner className="h-12 w-12" />
                  <p className="ml-4 text-lg">Initializing payment gateway...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Summary) */}
        <div className="order-1 md:order-2 w-full mb-8 md:mb-0">
          <Summary 
            event={event} 
            user={profile || undefined} 
            emergencyContacts={contacts} 
            price={price}
            isPriceLoading={!price && !clientSecret}
          />
        </div>
      </div>
    </div>
  );
}
