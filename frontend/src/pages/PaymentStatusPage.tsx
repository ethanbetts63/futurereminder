import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntent } from '@stripe/stripe-js';
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

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: { paymentIntent?: PaymentIntent }) => {
      setIsProcessing(false);
      switch (paymentIntent?.status) {
        case 'succeeded':
          setPaymentSucceeded(true);
          toast.success("Payment successful!", {
            description: "Your event has been activated."
          });
          setMessage('Success! Your payment was received. Redirecting to your confirmation...');
          setTimeout(() => {
            navigate('/confirmation');
          }, 2000);
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51RRCzbPH0oVkn2F1ZCB43p08cHzPiROnrVDvRbggNjvm4WAsDHhNy8gzd00qhxCItqk5Y8yhtRi9BJSIlt8dr8x100D0oG7sKC");

const WrappedPaymentStatusPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentStatusPage />
  </Elements>
);

export default WrappedPaymentStatusPage;
