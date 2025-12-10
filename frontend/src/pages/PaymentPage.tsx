import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

import CheckoutForm from '../components/checkout/CheckoutForm';
import { createPaymentIntent } from '@/api';
import type { Event } from '@/types';
import { Spinner } from '@/components/ui/spinner';

// Use the test publishable key from Stripe's documentation.
// This should be loaded from an environment variable in a real production app.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51RRCzbPH0oVkn2F1ZCB43p08cHzPiROnrVDvRbggNjvm4WAsDHhNy8gzd00qhxCItqk5Y8yhtRi9BJSIlt8dr8x100D0oG7sKC");


export default function PaymentPage() {
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // The event object is passed from the previous page
  const event: Event | undefined = location.state?.event;

  useEffect(() => {
    if (event?.id) {
      createPaymentIntent(event.id)
        .then(data => {
          setClientSecret(data.clientSecret);
        })
        .catch(error => {
          toast.error("Failed to initialize payment", {
            description: error.message || "Could not connect to the payment service."
          });
        });
    }
  }, [event]);

  if (!event) {
    // If the user lands here without an event, redirect them.
    return <Navigate to="/dashboard/events" replace />;
  }
  
  const appearance: Appearance = {
    theme: 'stripe',
  };

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Complete Your Payment</h1>
      <p className="mb-8">
        Please enter your payment details for the event: <strong>{event.name}</strong>
      </p>
      <div className="max-w-md mx-auto">
        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        ) : (
          <div className="flex justify-center items-center h-48">
            <Spinner className="h-12 w-12" />
            <p className="ml-4 text-lg">Initializing payment gateway...</p>
          </div>
        )}
      </div>
    </div>
  );
}
