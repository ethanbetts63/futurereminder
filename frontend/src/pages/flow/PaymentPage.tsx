import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Appearance } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

import CheckoutForm from '../../forms/CheckoutForm';
import PaymentSummary from '../../components/PaymentSummary'; // Import the new component
import { createPaymentIntent } from '@/api';
import type { Event } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51RRCzbPH0oVkn2F1ZCB43p08cHzPiROnrVDvRbggNjvm4WAsDHhNy8gzd00qhxCItqk5Y8yhtRi9BJSIlt8dr8x100D0oG7sKC");

export default function PaymentPage() {
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
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
    return <Navigate to="/dashboard/events" replace />;
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

  return (
    <div className="container mx-auto px-4 py-8">
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
              <CardTitle className="text-3xl">Payment Details</CardTitle>
              <CardDescription className="text-black">Enter your card information below.</CardDescription>
              <div className="text-center text-sm text-muted-foreground pt-2">
                <p>Powered by <span className="font-bold">Stripe</span></p>
              </div>
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

        {/* Right Column (Order Summary) */}
        <div className="order-1 md:order-2 w-full mb-8 md:mb-0">
          <PaymentSummary event={event} />
        </div>
      </div>
    </div>
  );
}
