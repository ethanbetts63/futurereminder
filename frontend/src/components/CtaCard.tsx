import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from 'lucide-react';
import logo from '../assets/logo.webp';
import logo320 from '../assets/logo-320w.webp';
import logo640 from '../assets/logo-640w.webp';
import logo768 from '../assets/logo-768w.webp';
import logo1024 from '../assets/logo-1024w.webp';
import logo1280 from '../assets/logo-1280w.webp';
import { CreateEventLink } from './CreateEventLink';
import { useConfig } from '@/context/ConfigContext';

const includedFeatures = [
  "Access for one event",
  "Full notification hierarchy",
  "Customizable notification schedule",
  "No subscriptions or hidden fees",
];

export const CtaCard: React.FC = () => {
  const { config, isLoading } = useConfig();

  return (
    <Card className="w-full bg-white text-gray-900">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-3 mb-2">
            <div className="flex items-center justify-center h-12 w-12 bg-primary rounded-lg">
              <img src={logo} alt=" Logo" className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl"><span className="bg-primary text-primary-foreground px-2 py-1 rounded-md italic underline">FutureReminder</span></CardTitle>
        </div>
        <p className="text-3xl font-bold">
          {isLoading ? '...' : config ? `$${config.amount.toFixed(2)}` : '$--.--'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
            <div>
                <h4 className="font-semibold text-md mb-2">What’s included?</h4>
                <ul className="space-y-2 text-sm">
                    {includedFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <Check className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-md mb-2">How does it work?</h4>
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
