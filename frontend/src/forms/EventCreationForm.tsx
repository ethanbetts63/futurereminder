// frontend/src/components/flow/EventCreationForm.tsx
import React from 'react';
import { useForm, type Resolver, type FieldErrors } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Manually define the data type, removing the dependency on Zod
export interface EventCreationData {
    name: string;
    event_date: string;
    notes?: string;
    weeks_in_advance: number;
}

// Custom resolver to replace Zod
const eventFormResolver: Resolver<EventCreationData> = async (data) => {
    const errors: FieldErrors<EventCreationData> = {};

    if (!data.name || data.name.trim().length === 0) {
        errors.name = { type: 'required', message: 'Event name is required.' };
    }

    if (!data.event_date) {
        errors.event_date = { type: 'required', message: 'Event date is required.' };
    } else {
        const eventDate = new Date(data.event_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day
        const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 50));

        if (eventDate < oneWeekFromNow) {
            errors.event_date = { type: 'min', message: 'Event must be at least one week in the future.' };
        } else if (eventDate > maxDate) {
            errors.event_date = { type: 'max', message: 'Event cannot be more than 50 years in the future.' };
        }
    }
    
    const weeksNum = Number(data.weeks_in_advance);
    if (isNaN(weeksNum) || weeksNum < 1) {
        errors.weeks_in_advance = { type: 'min', message: 'Must be at least 1 week.' };
    }

    // This check must happen after event_date is also valid
    if (!errors.event_date && !errors.weeks_in_advance) {
        const eventDate = new Date(data.event_date);
        const today = new Date();
        const weeksUntilEvent = (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7);
        if (weeksNum >= weeksUntilEvent) {
             errors.weeks_in_advance = { type: 'max', message: 'Weeks in advance must be less than the time until the event.' };
        }
    }


    return {
        values: Object.keys(errors).length > 0 ? {} : { ...data, weeks_in_advance: weeksNum },
        errors: errors,
    };
};


interface EventCreationFormProps {
    initialData: Partial<EventCreationData>;
    onSubmit: (data: EventCreationData) => void;
}

export const EventCreationForm: React.FC<EventCreationFormProps> = ({ initialData, onSubmit }) => {
    const form = useForm<EventCreationData>({
        resolver: eventFormResolver,
        defaultValues: {
            weeks_in_advance: 4,
            ...initialData,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Event Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Warranty renewal for solar panels..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="event_date" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Event Date</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-black">Notes (Optional)</FormLabel>
                        <FormControl><Textarea placeholder="Add any details to jog your memory, like a policy number or a link to the website..." {...field} /></FormControl>
                        <FormDescription className="text-black">A paragraph or two to help you remember the specifics of this event.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="weeks_in_advance" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-black">Weeks in Advance</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormDescription className="text-black">How many weeks in advance should we start sending notifications?</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <Button type="submit" id="event-creation-submit" className="hidden" />
            </form>
        </Form>
    );
};
