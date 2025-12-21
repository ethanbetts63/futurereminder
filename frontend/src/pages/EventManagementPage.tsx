import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateEventLink } from "@/components/CreateEventLink";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import * as api from "@/api";
import type { Event, Tier } from "@/types";
import { formatDate } from "@/utils/utils";
import Seo from "@/components/Seo";


function EventManagementPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedEvents, fetchedTiers] = await Promise.all([
            api.getEvents(),
            api.getTiers()
        ]);
        setEvents(fetchedEvents);
        setTiers(fetchedTiers);
      } catch (error) {
        toast.error("Failed to fetch page data.", { description: (error as Error).message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers ---
  const handleEdit = (event: Event) => {
    setEditingEvent({ ...event });
  };

  const handleCancel = () => {
    setEditingEvent(null);
  };

  const handleUpgrade = (event: Event) => {
    if (!event.tier) {
        toast.error("Cannot determine the event's current tier.");
        return;
    }

    const currentTier = tiers.find(t => t.id === event.tier.id);
    if (!currentTier) {
        toast.error("Could not verify the current tier's details.");
        return;
    }
    
    // Assuming prices array is sorted or the first price is the relevant one
    const currentPrice = currentTier.prices[0]?.amount ?? 0;

    const availableUpgrades = tiers
        .filter(t => (t.prices[0]?.amount ?? 0) > currentPrice)
        .sort((a, b) => (a.prices[0]?.amount ?? 0) - (b.prices[0]?.amount ?? 0));

    if (availableUpgrades.length === 0) {
        toast.info("You are already on the highest available tier.");
        return;
    }

    if (availableUpgrades.length === 1) {
        // Only one path, go straight to payment
        navigate('/create-flow/payment', { 
            state: { event, targetTier: availableUpgrades[0] } 
        });
    } else {
        // Multiple options, go to the choice page
        navigate(`/events/${event.id}/activate`, { 
            state: { event, currentTier } 
        });
    }
  };

  const handleSave = async () => {
    if (!editingEvent?.id) return;

    try {
      const updatedEvent = await api.updateEvent(editingEvent.id, editingEvent);
      setEvents(events.map((e: Event) => e.id === updatedEvent.id ? updatedEvent : e));
      toast.success("Event updated successfully!");
      setEditingEvent(null);
    } catch (error) {
      toast.error("Failed to update event", { description: (error as Error).message });
    }
  };

  const handleDelete = async () => {
    if (deleteCandidateId === null) return;

    try {
      await api.deleteEvent(deleteCandidateId);
      setEvents(events.filter((e: Event) => e.id !== deleteCandidateId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete event", { description: (error as Error).message });
    } finally {
      setDeleteCandidateId(null);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Event) => {
    if (editingEvent) {
      setEditingEvent({ ...editingEvent, [field]: e.target.value });
    }
  };


  // --- Render Logic ---
  if (isLoading) {
    return <p>Loading events...</p>; // Or a spinner component
  }

  return (
    <div className="space-y-4">
      <Seo title="Manage Events | FutureReminder" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">
            View, create, and manage your reminder events.
          </p>
        </div>
        <CreateEventLink>Create New Event</CreateEventLink>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Weeks in Advance</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map((event: Event) => {
              const isEditing = editingEvent?.id === event.id;
              return (
                <TableRow key={event.id}>
                  <TableCell>
                    {isEditing ? (
                      <Input value={editingEvent?.name} onChange={(e) => handleInputChange(e, 'name')} />
                    ) : (
                      event.name
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {isEditing ? (
                        <Textarea value={editingEvent?.notes ?? ''} onChange={(e) => handleInputChange(e, 'notes')} />
                    ) : (
                        <p className="truncate whitespace-normal">{event.notes}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input type="date" value={formatDate(editingEvent?.event_date, 'YYYY-MM-DD')} onChange={(e) => handleInputChange(e, 'event_date')} />
                    ) : (
                      formatDate(event.event_date)
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input type="number" value={editingEvent?.weeks_in_advance} onChange={(e) => handleInputChange(e, 'weeks_in_advance')} />
                    ) : (
                      event.weeks_in_advance
                    )}
                  </TableCell>
                  <TableCell>
                    {event.tier ? (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            event.tier.name === 'Full Escalation' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                            {event.tier.name}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                        <Button size="sm" onClick={handleSave}>Save</Button>
                      </>
                    ) : (
                      <>
                        {event.tier?.name !== 'Full Escalation' && (
                            <Button 
                                size="sm" 
                                onClick={() => handleUpgrade(event)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Upgrade
                            </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteCandidateId(event.id)}>Delete</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No events found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteCandidateId !== null} onOpenChange={() => setDeleteCandidateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default EventManagementPage;