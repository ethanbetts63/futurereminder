import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Heart, Calendar, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { getUserProfile, getEmergencyContacts } from '@/api';
import type { UserProfile, EmergencyContact, EventCreationResponse } from '@/types';

const ConfirmationPage = () => {
  const location = useLocation() as { state: { values: EventCreationResponse } };
  const { values: eventCreationData } = location.state || {};

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, contactsData] = await Promise.all([
          getUserProfile(),
          getEmergencyContacts(),
        ]);
        setProfile(profileData);
        setContacts(contactsData);
        setError(null);
      } catch (err) {
        setError('Failed to load your account details. Please refresh the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!eventCreationData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">No information to display.</h1>
        <p>It looks like you navigated to this page directly. Please create an event first.</p>
      </div>
    );
  }
  
  const eventDate = new Date(eventCreationData.event.event_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <Card className="text-center w-full bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <div className="flex justify-center items-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl">Your Reminder is Locked In!</CardTitle>
            <CardDescription>
              Here is a summary of the information we've recorded. You can manage these details from your account page.
            </CardDescription>
          </CardHeader>
        </Card>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading your details...</p>
          </div>
        )}

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader className="flex flex-row items-center space-x-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <CardTitle>Error</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {/* Payment Details Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-4">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <CardTitle>Payment Details</CardTitle>
                  </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Payment processing is not yet enabled. Your event has been created free of charge.</p>
              </CardContent>
            </Card>

            {/* Profile Details Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <User className="h-6 w-6 text-primary" />
                  <CardTitle>Your Profile</CardTitle>
                </div>
                <Button asChild size="sm">
                  <Link to="/account/profile">Edit Profile</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Phone:</strong> {profile?.phone}</p>
              </CardContent>
            </Card>

            {/* Emergency Contacts Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Heart className="h-6 w-6 text-primary" />
                  <CardTitle>Emergency Contacts</CardTitle>
                </div>
                <Button asChild size="sm">
                  <Link to="/account/contacts">Edit Contacts</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {contacts.length > 0 ? (
                  <ul className="space-y-2">
                    {contacts.map(contact => (
                      <li key={contact.id} className="p-2 border-b last:border-b-0">
                        <p><strong>Name:</strong> {contact.first_name} {contact.last_name}</p>
                        <p className="text-sm text-muted-foreground"><strong>Relationship:</strong> {contact.relationship}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No emergency contacts were added.</p>
                )}
              </CardContent>
            </Card>
            
            {/* Event Details Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Calendar className="h-6 w-6 text-primary" />
                        <CardTitle>Event Details</CardTitle>
                    </div>
                    <Button asChild size="sm">
                        <Link to="/events">Manage Events</Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Event Name:</strong> {eventCreationData.event.name}</p>
                    <p><strong>Event Date:</strong> {eventDate}</p>
                    {eventCreationData.event.notes && <p><strong>Notes:</strong> {eventCreationData.event.notes}</p>}
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;