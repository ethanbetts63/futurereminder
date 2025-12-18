// frontend/src/pages/ForgotPasswordPage.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from "sonner";
import apiClient from '@/apiClient';

type EmailFormData = {
  email: string;
};

const ForgotPasswordPage: React.FC = () => {
  const form = useForm<EmailFormData>({
    defaultValues: {
      email: '',
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = form;

  const requestPasswordReset = async (data: EmailFormData) => {
    return apiClient.post('/users/password-reset/request/', data);
  };

  const onSubmit: SubmitHandler<EmailFormData> = async (data) => {
    try {
      const response = await requestPasswordReset(data);
      toast.info(response.data.detail); // Show the generic message from the backend
      reset();
    } catch (err: any) {
      // Per the backend design, this part should ideally not be reached
      // unless there's a network error or a 5xx server error.
      const errorMessage = err.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Forgot Your Password?</h1>
      <p className="mb-6 text-muted-foreground">
        Enter your email address below and we'll send you a link to reset your password.
      </p>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                {...register('email', { required: 'Email address is required' })} 
              />
            </FormControl>
            <FormMessage>{errors.email?.message}</FormMessage>
          </FormItem>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;
