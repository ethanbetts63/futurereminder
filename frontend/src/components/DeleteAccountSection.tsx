import React, { useState } from 'react';
import { deleteAccount } from '@/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DeleteAccountSection: React.FC = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteAccount();
            
            // Clear the JWT tokens from storage to log the user out on the client side.
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            // Redirect to the homepage. The user is now logged out.
            window.location.href = '/'; 

        } catch (err: any) {
            setDeleteError(err.message || 'Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <Card className="border-destructive">
            <CardContent className="flex justify-between items-center">
                <div className="flex flex-col">
                    <p className="font-semibold">Delete Your Account</p>
                    <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. All of your data, including events and contacts, will be permanently removed.</p>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove all your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                Yes, delete my account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </CardContent>
            {deleteError && (
                 <CardContent>
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Deletion Failed</AlertTitle>
                        <AlertDescription>{deleteError}</AlertDescription>
                    </Alert>
                </CardContent>
            )}
        </Card>
    );
};

export default DeleteAccountSection;
