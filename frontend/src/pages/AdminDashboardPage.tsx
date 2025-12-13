import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Seo from '@/components/Seo';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { DashboardAnalyticsTable } from '@/components/admin/DashboardAnalyticsChart';
import { AutomatedNotificationStats } from '@/components/admin/AutomatedNotificationStats';
import { AdminTaskQueue } from '@/components/admin/AdminTaskQueue';

const AdminDashboardPage: React.FC = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex h-full justify-center items-center">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Seo title="Admin Dashboard | FutureReminder" description="Admin dashboard for managing FutureReminder." />
      <div className="flex h-full">
        {/* Vertical Nav */}
        <aside className="w-64 flex-shrink-0 border-r p-4">
          <nav className="flex flex-col space-y-2">
            <h2 className="text-lg font-semibold tracking-tight mb-2">Admin Menu</h2>
            <Button variant="ghost" className="w-full justify-start">
              Dashboard Home
            </Button>
            {/* Future admin links can be added here */}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow border-l p-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome, {user.first_name || user.email}. Here's what's happening on the platform.
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <DashboardAnalyticsTable />
            <AutomatedNotificationStats />
            <AdminTaskQueue />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboardPage;
