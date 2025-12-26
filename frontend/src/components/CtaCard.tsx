import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from 'lucide-react';
import logo from '../assets/logo.webp';
import logo320 from '../assets/logo-320w.webp';
import logo640 from '../assets/logo-640w.webp';
import logo768 from '../assets/logo-768w.webp';
import logo1024 from '../assets/logo-1024w.webp';
import logo1280 from '../assets/logo-1280w.webp';
import { CreateEventLink } from './CreateEventLink';

const tierData = {
  automated: {
    name: 'Automated',
    price: '$0.00',
    features: [
      "Primary emails",
      "Secondary emails",
      "Text via primary mobile",
    ],
  },
  advanced: {
    name: 'Advanced',
    price: '$4.99',
    features: [
      "Everything in Automated",
      "Secondary phone number",
      "Emergency contact",
      "Phone calls",
    ],
  },
  fullEscalation: {
    name: 'Full Escalation',
    price: '$8.99',
    features: [
      "Everything in Advanced",
      "Manual admin outreach via social media"
    ],
  }
};


export const CtaCard: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<'automated' | 'advanced' | 'fullEscalation'>('advanced');

  const currentTier = tierData[selectedTier];

  return (
    <Card className="w-full bg-white text-gray-900">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-3 mb-4">
            <div className="flex items-center justify-center h-12 w-12 bg-primary rounded-lg">
                    <img
                        width="367"
                        height="367"
                        src={logo}
                        srcSet={`${logo320} 320w, ${logo640} 640w, ${logo768} 768w, ${logo1024} 1024w, ${logo1280} 1280w`}
                        sizes="48px"
                        alt="Future Reminder Logo"
                        className="h-full w-full object-contain"
                    />
            </div>
            <h2 className="text-3xl leading-none font-semibold"><span className="bg-primary text-primary-foreground px-2 py-1 rounded-md italic underline">FutureReminder</span></h2>
        </div>

        {/* Tier Switcher */}
        <div className="flex justify-center bg-muted p-1 rounded-md">
          <button 
            onClick={() => setSelectedTier('automated')}
            className={`w-1/3 px-4 py-2 text-sm font-bold rounded ${selectedTier === 'automated' ? 'bg-primary text-primary-foreground' : 'text-white'}`}
          >
            Automated
          </button>
          <button
            onClick={() => setSelectedTier('advanced')}
            className={`w-1/3 px-4 py-2 text-sm font-bold rounded ${selectedTier === 'advanced' ? 'bg-primary text-primary-foreground' : 'text-white'}`}
          >
            Advanced
          </button>
          <button 
            onClick={() => setSelectedTier('fullEscalation')}
            className={`w-1/3 px-4 py-2 text-sm font-bold rounded ${selectedTier === 'fullEscalation' ? 'bg-primary text-primary-foreground' : 'text-white'}`}
          >
            Full Escalation
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="flex flex-col gap-4">
            <p className="text-center text-3xl font-bold mt-2">
              {currentTier.price}
              {(selectedTier === 'advanced' || selectedTier === 'fullEscalation') && (
                <span className="text-base font-normal text-grey-600 ml-2">
                  (per event)
                </span>
              )}
            </p>
            <div>
                <h3 className="font-semibold text-md mb-2">What’s included?</h3>
                <ul className="space-y-2 text-sm">
                    {currentTier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <Check className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-md mb-2">How does it work?</h3>
                <p className="text-sm">
                    We need as many ways to contact you as possible, the name and date of the event and when you want the reminders to start.
                </p>
            </div>
            <CreateEventLink className="w-full h-12 text-lg mt-2">
              Secure Your Reminder
            </CreateEventLink>
        </div>
      </CardContent>
    </Card>
  );
};
