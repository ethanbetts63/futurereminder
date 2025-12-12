import React from 'react';
import { CreateEventLink } from './CreateEventLink';
import { CheckCircle, XCircle } from 'lucide-react';
import { useConfig } from '@/context/ConfigContext';

const features = [
  "Access for one event",
  "Full notification hierarchy",
  "Customizable notification schedule",
  "No subscriptions or hidden fees",
];

const included = [
  "Notifications via Email, SMS, Calls and social media",
  "Emergency contact outreach from an admin",
  "Customizable notification schedule",
];

const avoided = [
  "Missed Deadlines & Fees",
  "Expired Warranties & Patents",
  "Forgotten Appointments",
  "The Stress of Remembering",
];

const Pricing: React.FC = () => {
  const { config, isLoading } = useConfig();

  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 mt-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground">A Single, <span className= "italic underline">Simple Price</span>.</h2>
          <p className="mt-4 text-lg text-primary-foreground max-w-2xl mx-auto">
            No subscriptions, no hidden fees, no tiers to worry about. Just a single one-time payment for a single one-time event.
          </p>
        </div>
        {/* Grid container for the two cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Pricing Card */}
          <div className="bg-white border rounded-xl shadow-lg flex flex-col">
            <div className="p-8 flex-grow">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">One-Time Payment</div>
              <p className="block mt-1 text-5xl leading-tight font-bold text-black">
                {isLoading ? '...' : config ? `$${config.amount.toFixed(2)}` : '$--.--'}
              </p>
              <p className="mt-2 text-gray-500">A single, unforgettable event deserves a single, simple price.</p>
              
              <ul className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 pt-0">
              <CreateEventLink className="w-full h-12 text-lg">
                Secure Your Reminder
              </CreateEventLink>
            </div>
          </div>

          {/* Value Proposition Card */}
          <div className="bg-white border rounded-xl shadow-lg flex flex-col">
            <div className="p-8 flex-grow">
              {/* Included List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">What's Included:</h3>
                <ul className="mt-4 space-y-3">
                  {included.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Avoided List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800">What You'll Avoid:</h3>
                <ul className="mt-4 space-y-3">
                  {avoided.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <XCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pricing;