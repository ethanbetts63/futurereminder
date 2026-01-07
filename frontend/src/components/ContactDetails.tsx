import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const ContactDetails: React.FC = () => {
    const emailAddress = 'ethanbetts63@gmail.com';

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">
                        If there are any questions or concerns or suggestions that you might have please feel free to email me here.
                    </p>
                    <div className="flex items-center">
                        <Mail className="mr-2 h-5 w-5" />
                        <a href={`mailto:${emailAddress}`} className="text-primary hover:underline">
                            {emailAddress}
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactDetails;
