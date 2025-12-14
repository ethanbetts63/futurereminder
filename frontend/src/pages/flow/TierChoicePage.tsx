// frontend/src/pages/flow/TierChoicePage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import type { Event } from '@/types';
import Seo from '@/components/Seo';
import { activateFreeEvent } from '@/api';

// --- Hardcoded Data (for now) ---
const tierData = {
  automated: {
    name: 'Automated',
    price: '$0.00',
    description: 'Reliable, automated reminders to ensure you don\'t forget.',
    features: [
      "Automated emails to primary email",
      "Automated texts to primary number",
      "Backup email & SMS notifications",
    ],
  },
  fullEscalation: {
    name: 'Full Escalation',
    price: '$5.99',
    description: 'Our complete outreach hierarchy for absolute peace of mind.',
    features: [
      "Includes everything in Automated",
      "Direct phone calls from an admin",
      "Social media outreach",
      "Emergency contact outreach",
    ],
  }
};
// --- End Hardcoded Data ---

const TierChoicePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const event: Event | undefined = location.state?.event;

    if (!event) {
        toast.error("No event specified.", { description: "You need to create an event first." });
        return <Navigate to="/create-flow/event" replace />;
    }

    const handleFreeActivation = async () => {
        setIsSubmitting(true);
        try {
            await activateFreeEvent(event.id);
            toast.success("Event activated successfully!");
            navigate(`/create-flow/success`, { state: { event } });
        } catch (error: any) {
            toast.error("Failed to activate event", {
                description: error.message || "An unknown error occurred."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaidActivation = () => {
        navigate('/create-flow/payment', { state: { event } });
    };

    return (
        <div className="container mx-auto max-w-4xl py-12">
            <Seo title="Activate Your Event | FutureReminder" />
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight">Activate Your Reminder</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    You've created the event: <span className="font-semibold text-primary">{event.name}</span>.
                    <br />
                    Now, choose your level of security to activate it.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Free Tier Card */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{tierData.automated.name}</CardTitle>
                        <CardDescription>{tierData.automated.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-4xl font-bold mb-6">{tierData.automated.price}</p>
                        <ul className="space-y-3">
                            {tierData.automated.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handleFreeActivation}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Spinner className="mr-2 h-4 w-4" /> : null}
                            Activate Free Plan
                        </Button>
                    </CardFooter>
                </Card>

                {/* Paid Tier Card */}
                <Card className="flex flex-col border-2 border-primary shadow-lg">
                     <CardHeader>
                        <CardTitle>{tierData.fullEscalation.name}</CardTitle>
                        <CardDescription>{tierData.fullEscalation.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-4xl font-bold mb-6">{tierData.fullEscalation.price}</p>
                        <ul className="space-y-3">
                            {tierData.fullEscalation.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handlePaidActivation}
                            disabled={isSubmitting}
                        >
                            Proceed to Payment
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default TierChoicePage;
