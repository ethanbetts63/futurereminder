import { Link } from 'react-router-dom';
import type { Event, UserProfile, EmergencyContact, AppConfig } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/utils';

interface SummaryProps {
  event?: Event;
  user?: UserProfile;
  emergencyContacts?: EmergencyContact[];
  className?: string;
  price?: number; // Accept a direct price
  isPriceLoading?: boolean;
}

const Summary: React.FC<SummaryProps> = ({ event, user, emergencyContacts, className, price, isPriceLoading }) => {

  return (
    <div className={`space-y-4 ${className}`}>
      {event && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event:</span>
                <span className="font-semibold">{event.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-semibold">{formatDate(event.event_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lead Time:</span>
                <span className="font-semibold">{event.weeks_in_advance} {event.weeks_in_advance === 1 ? 'week' : 'weeks'}</span>
              </div>
              {event.notes && (
                  <div className="flex justify-between items-center gap-4">
                      <span className="text-muted-foreground">Notes:</span>
                      <span className="font-semibold italic text-right truncate">
                          "{event.notes.substring(0, 15)}{event.notes.length > 15 ? '...' : ''}"
                      </span>
                  </div>
              )}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between font-bold text-lg pt-2 mt-2">
                <span>Total:</span>
                <span>
                  {isPriceLoading
                    ? '...'
                    : typeof price === 'number'
                      ? `$${price.toFixed(2)}`
                      : 'N/A'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Your Information</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/account">Edit</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-sm">
            {/* Profile Details */}
            <div className="space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Name:</span> <span className="font-semibold">{user.first_name} {user.last_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-semibold">{user.email}</span></div>
                {user.phone && <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span className="font-semibold">{user.phone}</span></div>}
                {user.backup_email && <div className="flex justify-between"><span className="text-muted-foreground">Backup Email:</span> <span className="font-semibold">{user.backup_email}</span></div>}
                {user.backup_phone && <div className="flex justify-between"><span className="text-muted-foreground">Backup Phone:</span> <span className="font-semibold">{user.backup_phone}</span></div>}
                {user.facebook_handle && <div className="flex justify-between"><span className="text-muted-foreground">Facebook:</span> <span className="font-semibold">{user.facebook_handle}</span></div>}
                {user.instagram_handle && <div className="flex justify-between"><span className="text-muted-foreground">Instagram:</span> <span className="font-semibold">{user.instagram_handle}</span></div>}
                {user.snapchat_handle && <div className="flex justify-between"><span className="text-muted-foreground">Snapchat:</span> <span className="font-semibold">{user.snapchat_handle}</span></div>}
                {user.x_handle && <div className="flex justify-between"><span className="text-muted-foreground">X (Twitter):</span> <span className="font-semibold">{user.x_handle}</span></div>}
            </div>

            {/* Emergency Contacts Section (Conditional) */}
            {emergencyContacts && emergencyContacts.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <h4 className="text-sm font-medium text-foreground mb-2">Emergency Contacts</h4>
                <div className="space-y-2">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id}>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-semibold">{contact.first_name} {contact.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-semibold">{contact.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Summary;
