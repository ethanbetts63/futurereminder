import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import type { Event, Tier } from '@/types';
import Seo from '@/components/Seo';
import { activateFreeEvent, getTiers } from '@/api';

const TierChoicePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const event: Event | undefined = location.state?.event;

    useEffect(() => {
        getTiers()
            .then(data => {
                setTiers(data);
                setIsLoading(false);
            })
            .catch(error => {
                toast.error("Failed to load pricing tiers.", { description: error.message });
                setIsLoading(false);
            });
    }, []);

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

    const handlePaidActivation = (targetTierId: number) => {
        navigate('/create-flow/payment', { 
            state: { event, targetTierId } 
        });
    };

    const freeTier = tiers.find(t => t.name === 'Automated');
    const paidTier = tiers.find(t => t.name === 'Full Escalation');

    if (isLoading) {
        return (
            <div className="container mx-auto flex justify-center items-center h-screen">
                <Spinner className="w-8 h-8 mr-2" /> <p>Loading pricing...</p>
            </div>
        );
    }

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
                {freeTier && (
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{freeTier.name}</CardTitle>
                            <CardDescription>{freeTier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-4xl font-bold mb-6">${freeTier.prices[0]?.amount ?? '0.00'}</p>
                            <ul className="space-y-3">
                                {/* Features would be fetched from API in a real scenario */}
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-muted-foreground">Automated emails & texts</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-muted-foreground">Backup notifications</span></li>
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
                )}

                {/* Paid Tier Card */}
                {paidTier && (
                    <Card className="flex flex-col border-2 border-primary shadow-lg">
                        <CardHeader>
                            <CardTitle>{paidTier.name}</CardTitle>
                            <CardDescription>{paidTier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-4xl font-bold mb-6">${paidTier.prices[0]?.amount ?? '5.99'}</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-muted-foreground">Includes everything in Automated</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-muted-foreground">Direct phone calls</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-muted-foreground">Social media & contact outreach</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                size="lg"
                                onClick={() => handlePaidActivation(paidTier.id)}
                                disabled={isSubmitting}
                            >
                                Proceed to Payment
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default TierChoicePage;
