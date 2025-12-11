import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface CheckoutFormProps {
  eventId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ eventId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment-status?event_id=${eventId}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } else {
      setErrorMessage("An unexpected error occurred.");
    }
    
    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      
      <Button disabled={isProcessing || !stripe || !elements} className="w-full mt-6">
        {isProcessing ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Processing...
          </>
        ) : (
          "Pay now"
        )}
      </Button>

      {/* Show any error or success messages */}
      {errorMessage && <div id="payment-message" className="text-red-500 mt-2">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
