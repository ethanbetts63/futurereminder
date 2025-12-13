// src/pages/EventManagementPage.tsx
import { useState, useEffect } from "react";
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
import type { Event } from "@/types";
import { formatDate } from "@/utils/utils";
import Seo from "@/components/Seo";


function EventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await api.getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        toast.error("Failed to fetch events", { description: (error as Error).message });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- Handlers ---
  const handleEdit = (event: Event) => {
    setEditingEvent({ ...event });
  };

  const handleCancel = () => {
    setEditingEvent(null);
  };

  const handleSave = async () => {
    if (!editingEvent?.id) return;

    try {
      const updatedEvent = await api.updateEvent(editingEvent.id, editingEvent);
      setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
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
      setEvents(events.filter(e => e.id !== deleteCandidateId));
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
      <Seo title="Manage Your Events | FutureReminder" />
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length > 0 ? (
            events.map(event => {
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
                  <TableCell className="text-right space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                        <Button size="sm" onClick={handleSave}>Save</Button>
                      </>
                    ) : (
                      <>
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
              <TableCell colSpan={5} className="text-center h-24">
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