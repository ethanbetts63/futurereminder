import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ContactDetails: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                        The FutureReminder Elavator Pitch
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        Calendar apps are for meetings. FutureReminder is for consequences. Single reminders get buried, missed or just lost. FutureReminder repeats reminders until they’re acknowledged and it uses multi-channel escalation. From email and text, to calls and emergency contacts. High stakes deadlines such as visa or IUD expiries, trademark or domain renewals and even warranties, patents or business licences, deserve to have a reminder system that treats them as life and death, not just another dentist appointment. So check out FutureReminder today, and find out how it feels to offload the “don’t forget” part of your brain, once and for all.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactDetails;
