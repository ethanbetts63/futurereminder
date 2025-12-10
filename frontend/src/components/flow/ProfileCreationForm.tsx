// frontend/src/components/flow/ProfileCreationForm.tsx
import React from 'react';
import { useForm, type Resolver, type FieldErrors } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Manually define the data type, removing the dependency on Zod
export interface ProfileCreationData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
    backup_email?: string;
    backup_phone?: string;
    facebook_handle?: string;
    instagram_handle?: string;
    snapchat_handle?: string;
    x_handle?: string;
}

// Custom resolver to replace Zod
const profileFormResolver: Resolver<ProfileCreationData> = async (data) => {
    const errors: FieldErrors<ProfileCreationData> = {};

    // First Name validation
    if (!data.first_name) {
        errors.first_name = { type: 'required', message: 'First name is required.' };
    }

    // Last Name validation
    if (!data.last_name) {
        errors.last_name = { type: 'required', message: 'Last name is required.' };
    }

    // Email validation
    if (!data.email) {
        errors.email = { type: 'required', message: 'Email is required.' };
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = { type: 'pattern', message: 'Please enter a valid email.' };
    }

    // Phone validation
    if (!data.phone) {
        errors.phone = { type: 'required', message: 'Phone number is required.' };
    }
    
    // Password validation
    if (!data.password) {
        errors.password = { type: 'required', message: 'Password is required.' };
    } else if (data.password.length < 8) {
        errors.password = { type: 'minLength', message: 'Password must be at least 8 characters.' };
    }

    // Confirm Password validation
    if (data.password && data.confirmPassword !== data.password) {
        errors.confirmPassword = { type: 'validate', message: 'Passwords do not match.' };
    }

    // Backup Email validation
    if (data.backup_email && !/\S+@\S+\.\S+/.test(data.backup_email)) {
        errors.backup_email = { type: 'pattern', message: 'Invalid email format.' };
    }

    return {
        values: Object.keys(errors).length > 0 ? {} : data,
        errors: errors,
    };
};


interface ProfileCreationFormProps {
    initialData: Partial<ProfileCreationData>;
    onSubmit: (data: ProfileCreationData) => void;
}

export const ProfileCreationForm: React.FC<ProfileCreationFormProps> = ({ initialData, onSubmit }) => {
    const form = useForm<ProfileCreationData>({
        resolver: profileFormResolver, // Use the custom resolver
        defaultValues: initialData,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="first_name" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="last_name" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input {...field} type="password" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                        <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input {...field} type="password" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                
                <h3 className="text-lg font-medium border-t pt-4">Contact & Social (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="backup_email" render={({ field }) => (
                        <FormItem><FormLabel>Backup Email</FormLabel><FormControl><Input {...field} value={field.value || ''} type="email" /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="backup_phone" render={({ field }) => (
                        <FormItem><FormLabel>Backup Phone</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="facebook_handle" render={({ field }) => (
                        <FormItem><FormLabel>Facebook</FormLabel><FormControl><Input placeholder="your.profile" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="instagram_handle" render={({ field }) => (
                        <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="@yourhandle" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="snapchat_handle" render={({ field }) => (
                        <FormItem><FormLabel>Snapchat</FormLabel><FormControl><Input placeholder="yourhandle" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="x_handle" render={({ field }) => (
                        <FormItem><FormLabel>X (Twitter)</FormLabel><FormControl><Input placeholder="@yourhandle" {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <Button type="submit" id="profile-creation-submit" className="hidden" />
            </form>
        </Form>
    );
};