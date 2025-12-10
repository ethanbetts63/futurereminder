import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntent, PaymentIntentResult } from '@stripe/stripe-js';

// Define a more specific type that includes the metadata we expect from our backend.
interface PaymentIntentWithMetadata extends PaymentIntent {
  metadata: {
    event_id?: string;
    user_id?: string;
  };
}
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const PaymentStatusPage: React.FC = () => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      setIsProcessing(false);
      setMessage("Error: Payment information not found. Please check your dashboard for the status of your payment.");
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then((result: PaymentIntentResult) => {
      if (result.error) {
        setIsProcessing(false);
        setMessage(result.error.message || 'An error occurred while retrieving payment status.');
        setPaymentSucceeded(false);
        return;
      }

      setIsProcessing(false);
      const paymentIntent = result.paymentIntent as PaymentIntentWithMetadata;

      switch (paymentIntent?.status) {
        case 'succeeded':
          setPaymentSucceeded(true);
          toast.success("Payment successful!", {
            description: "Your event has been activated."
          });
          
          const eventId = paymentIntent.metadata.event_id;
          if (eventId) {
            setMessage('Success! Your payment was received. Redirecting to your confirmation...');
            setTimeout(() => {
              navigate(`/confirmation/${eventId}`);
            }, 2000);
          } else {
            setMessage('Success! Your payment was received, but we could not find the event details. Please check your dashboard.');
          }
          break;
        case 'processing':
          setMessage("Payment processing. We'll update you when payment is received.");
          break;
        case 'requires_payment_method':
          setPaymentSucceeded(false);
          setMessage('Payment failed. Please try another payment method.');
          break;
        default:
          setPaymentSucceeded(false);
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe, navigate]);

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
          <CardDescription>The result of your transaction is shown below.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-10 w-10" />
              <p>Verifying payment status...</p>
            </div>
          ) : (
            <>
              <p className="text-lg mb-6">{message}</p>
              {!paymentSucceeded && (
                <Button asChild>
                  <Link to="/create-flow/payment">Try Payment Again</Link>
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// The page needs to be wrapped in the Elements provider to use the `useStripe` hook.
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  console.error("FATAL: VITE_STRIPE_PUBLISHABLE_KEY is not set in .env file or is not prefixed with VITE_.");
}
// Log a truncated version of the key for debugging, which is safer than logging the whole key.
console.log("Stripe.js is loading with key:", publishableKey ? `${publishableKey.substring(0, 10)}...` : "KEY NOT FOUND");

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const WrappedPaymentStatusPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentStatusPage />
  </Elements>
);

export default WrappedPaymentStatusPage;
