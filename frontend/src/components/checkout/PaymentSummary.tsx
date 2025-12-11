import type { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/utils';

interface PaymentSummaryProps {
  event: Event;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ event }) => {
  const price = 10.00; // As per current hardcoded price

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Event:</span>
            <span className="font-semibold">{event.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-semibold">{formatDate(event.event_date)}</span>
          </div>
        </div>
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${price.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Powered by <span className="font-bold">Stripe</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
