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
    const currentTierForUpgrade: Tier | undefined = location.state?.currentTier;

    useEffect(() => {
        getTiers()
            .then(data => {
                let displayTiers = data;
                if (currentTierForUpgrade) {
                    const currentPrice = currentTierForUpgrade.prices[0]?.amount ?? 0;
                    displayTiers = data.filter(t => (t.prices[0]?.amount ?? 0) > currentPrice);
                }
                setTiers(displayTiers);
                setIsLoading(false);
            })
            .catch(error => {
                toast.error("Failed to load pricing tiers.", { description: error.message });
                setIsLoading(false);
            });
    }, [currentTierForUpgrade]);

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

    const handlePaidActivation = (targetTier: Tier) => {
        navigate('/create-flow/payment', { 
            state: { event, targetTier } 
        });
    };

    const automatedTier = tiers.find(t => t.name === 'Automated');
    const advancedTier = tiers.find(t => t.name === 'Advanced');
    const fullEscalationTier = tiers.find(t => t.name === 'Full Escalation');

    if (isLoading) {
        return (
            <div className="container mx-auto flex justify-center items-center h-screen">
                <Spinner className="w-8 h-8 mr-2" /> <p>Loading pricing...</p>
            </div>
        );
    }

    const isUpgradeFlow = currentTierForUpgrade !== undefined;

    return (
        <div className="container mx-auto max-w-6xl py-12 px-4">
            <Seo title={isUpgradeFlow ? "Upgrade Event | FutureReminder" : "Activate Your Event | FutureReminder"} />
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-tight">
                    {isUpgradeFlow ? 'Upgrade Your Reminder' : 'Activate Your Reminder'}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    {isUpgradeFlow
                        ? `You are currently on the "${currentTierForUpgrade.name}" tier for:`
                        : "You've created the event:"
                    }
                    <span className="font-semibold text-primary"> {event.name}</span>.
                    <br />
                    {isUpgradeFlow
                        ? "Please choose your new level of security."
                        : "Now, choose your level of security to activate it."
                    }
                </p>
            </div>
            
            <div className="flex flex-col-reverse md:flex-row md:justify-center gap-8">
                {/* Automated Tier Card */}
                {automatedTier && (
                    <Card className="flex flex-col h-full md:w-96">
                        <CardHeader>
                            <CardTitle>{automatedTier.name}</CardTitle>
                            <CardDescription>{automatedTier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-4xl font-bold mb-6">${automatedTier.prices[0]?.amount ?? '0.00'}</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Primary emails</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Secondary emails</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Text via primary mobile</span></li>
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

                {/* Advanced Tier Card */}
                {advancedTier && (
                    <Card className="flex flex-col h-full border-2 border-primary shadow-lg md:w-96">
                        <CardHeader>
                            <CardTitle>{advancedTier.name}</CardTitle>
                            <CardDescription>{advancedTier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-4xl font-bold mb-6">${advancedTier.prices[0]?.amount ?? '4.99'}</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Everything in Automated</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Secondary phone number</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Emergency contact</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Phone calls</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                size="lg"
                                onClick={() => handlePaidActivation(advancedTier)}
                                disabled={isSubmitting}
                            >
                                Proceed to Payment
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Full Escalation Tier Card */}
                {fullEscalationTier && (
                    <Card className="flex flex-col h-full md:w-96">
                        <CardHeader>
                            <CardTitle>{fullEscalationTier.name}</CardTitle>
                            <CardDescription>{fullEscalationTier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-4xl font-bold mb-6">${fullEscalationTier.prices[0]?.amount ?? '8.99'}</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Everything in Advanced</span></li>
                                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /><span className="text-foreground">Manual admin outreach via social media</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                size="lg"
                                onClick={() => handlePaidActivation(fullEscalationTier)}
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
