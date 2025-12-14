import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { EmergencyContact } from '@/types';
import { createEmergencyContact, updateEmergencyContact, deleteEmergencyContact } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ManagerProps {
    initialContacts: EmergencyContact[];
    onContactsChange: (contacts: EmergencyContact[]) => void;
    isAnonymous?: boolean;
}

type ContactFormData = Omit<EmergencyContact, 'id' | 'user'>;

const tempId = () => -Math.floor(Math.random() * 1000000);

// --- Sub-component for the "Add New Contact" form ---
const AddContactForm: React.FC<{
    onAddContact: (data: ContactFormData) => Promise<void>,
    hasConfirmedConsent: boolean,
    onConsentChange: (checked: boolean) => void,
}> = ({ onAddContact, hasConfirmedConsent, onConsentChange }) => {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormData>();

    const handleFormSubmit = async (data: ContactFormData) => {
        await onAddContact(data);
        reset({ first_name: '', last_name: '', relationship: '', phone: '', email: '' });
    };

    return (
        <div className="w-full">
            <h4 className="text-base font-semibold mb-4 border-t pt-6">Add a New Contact (optional)</h4>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
                    <Input {...register("first_name", { required: true })} placeholder="First Name" />
                    <Input {...register("last_name", { required: true })} placeholder="Last Name" />
                    <Input {...register("relationship")} placeholder="Relationship (Optional)" />
                    <Input {...register("phone", { required: true })} placeholder="Phone" />
                    <Input {...register("email")} placeholder="Email (Optional)" />
                    <Button type="submit" disabled={isSubmitting || !hasConfirmedConsent} className="w-full">
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
                <div className="mt-4 flex items-center space-x-2">
                    <Checkbox
                        id="consent"
                        checked={hasConfirmedConsent}
                        onCheckedChange={onConsentChange}
                    />
                    <label
                        htmlFor="consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                        I confirm that any emergency contact I add has been informed, understands, and has agreed to being contacted.
                    </label>
                </div>
            </form>
        </div>
    );
};


export const EmergencyContactsManager: React.FC<ManagerProps> = ({ initialContacts, onContactsChange, isAnonymous = false }) => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [contactToDelete, setContactToDelete] = useState<EmergencyContact | null>(null);
    const [hasConfirmedConsent, setHasConfirmedConsent] = useState(false);

    const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm<ContactFormData>();

    useEffect(() => {
        setContacts(initialContacts);
    }, [initialContacts]);
    
    // --- Edit Handlers ---
    const handleUpdate = async (data: ContactFormData) => {
        if (!editingId) return;

        if (!isAnonymous && user) {
            try {
                const updatedContact = await updateEmergencyContact(editingId, data);
                const newContacts = contacts.map(c => c.id === editingId ? updatedContact : c);
                setContacts(newContacts);
                onContactsChange(newContacts);
                toast.success("Contact updated.");
            } catch (error) {
                toast.error("Failed to update contact.");
            }
        } else { // Anonymous flow for editing
            const newContacts = contacts.map(c => c.id === editingId ? { ...data, id: editingId } : c);
            setContacts(newContacts);
            onContactsChange(newContacts);
        }
        setEditingId(null);
    };

    // --- Add Handler ---
    const handleAdd = async (data: ContactFormData) => {
        if (!isAnonymous && user) {
            try {
                const newContact = await createEmergencyContact(data);
                const newContacts = [...contacts, newContact];
                setContacts(newContacts);
                onContactsChange(newContacts);
                toast.success("Contact added.");
            } catch (error) {
                toast.error("Failed to add contact.");
                throw error; // Re-throw to prevent form reset on failure
            }
        } else { // Anonymous flow for adding
            const newContact: EmergencyContact = { ...data, id: tempId() };
            const newContacts = [...contacts, newContact];
            setContacts(newContacts);
            onContactsChange(newContacts);
        }
    };
    
    // --- Delete Handlers ---
    const handleDeleteConfirm = async () => {
        if (!contactToDelete) return;
        
        if (!isAnonymous && user && contactToDelete.id > 0) {
            try {
                await deleteEmergencyContact(contactToDelete.id);
                toast.success("Contact deleted.");
            } catch (error) {
                toast.error("Failed to delete contact.");
                setContactToDelete(null);
                return;
            }
        }
        
        const newContacts = contacts.filter(c => c.id !== contactToDelete.id);
        setContacts(newContacts);
        onContactsChange(newContacts);
        setContactToDelete(null);
    };

    const startEditing = (contact: EmergencyContact) => {
        setEditingId(contact.id);
        resetEdit(contact);
    };

    const cancelEditing = () => {
        setEditingId(null);
        resetEdit();
    };
    
    // --- Render Methods ---
    const renderEditFormRow = () => (
        <TableRow>
            <TableCell><Input {...registerEdit("first_name", { required: true })} placeholder="First Name" /></TableCell>
            <TableCell><Input {...registerEdit("last_name", { required: true })} placeholder="Last Name" /></TableCell>
            <TableCell><Input {...registerEdit("relationship")} placeholder="Relationship" /></TableCell>
            <TableCell><Input {...registerEdit("phone", { required: true })} placeholder="Phone" /></TableCell>
            <TableCell><Input {...registerEdit("email")} placeholder="Email (Optional)" /></TableCell>
            <TableCell className="flex gap-2">
                <Button onClick={handleSubmitEdit(handleUpdate)}>Save</Button>
                <Button variant="ghost" onClick={cancelEditing}>Cancel</Button>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="w-full">
            <Table>
                <TableHeader><TableRow><TableHead className="text-black">First Name</TableHead><TableHead className="text-black">Last Name</TableHead><TableHead className="text-black">Relationship</TableHead><TableHead className="text-black">Phone</TableHead><TableHead className="text-black">Email</TableHead><TableHead className="text-black">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                    {contacts.map(contact => (
                        editingId === contact.id ? renderEditFormRow() : (
                            <TableRow key={contact.id}>
                                <TableCell>{contact.first_name}</TableCell>
                                <TableCell>{contact.last_name}</TableCell>
                                <TableCell>{contact.relationship}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button size="sm" onClick={() => startEditing(contact)}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => setContactToDelete(contact)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        )
                    ))}
                     {contacts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No emergency contacts added yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="mt-6">
                <AddContactForm
                    onAddContact={handleAdd}
                    hasConfirmedConsent={hasConfirmedConsent}
                    onConsentChange={setHasConfirmedConsent}
                />
            </div>

            <AlertDialog open={contactToDelete !== null} onOpenChange={() => setContactToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the contact.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};