// frontend/src/pages/ResetPasswordConfirmPage.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import apiClient from '@/apiClient';

type PasswordResetFormData = {
  password: string;
  password_confirm: string;
};

const ResetPasswordConfirmPage: React.FC = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const navigate = useNavigate();

  const form = useForm<PasswordResetFormData>({
    defaultValues: {
      password: '',
      password_confirm: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFormError } = form;

  const confirmPasswordReset = (data: PasswordResetFormData) => {
    if (!uid || !token) return Promise.reject("UID or Token is missing.");
    const url = `/users/password-reset/confirm/${uid}/${token}/`;
    return apiClient.post(url, data);
  };

  const onSubmit: SubmitHandler<PasswordResetFormData> = async (data) => {
    // Manual Validation
    if (data.password.length < 8) {
      setFormError('password', { type: 'manual', message: 'Password must be at least 8 characters long.' });
      return;
    }
    if (data.password !== data.password_confirm) {
      setFormError('password_confirm', { type: 'manual', message: "The two password fields didn't match." });
      return;
    }

    try {
      const response = await confirmPasswordReset(data);
      toast.success("Success!", {
        description: response.data.detail,
      });
      navigate('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "An error occurred. Please try again.";
      toast.error("Error", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Set Your New Password</h1>
      <p className="mb-6 text-muted-foreground">
        Please enter and confirm your new password below.
      </p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                {...register('password')} 
              />
            </FormControl>
            <FormMessage>{errors.password?.message}</FormMessage>
          </FormItem>

          <FormItem>
            <FormLabel>Confirm New Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                {...register('password_confirm')} 
              />
            </FormControl>
            <FormMessage>{errors.password_confirm?.message}</FormMessage>
          </FormItem>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordConfirmPage;
