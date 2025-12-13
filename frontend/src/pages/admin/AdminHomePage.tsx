import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardAnalyticsTable } from '@/components/admin/DashboardAnalyticsChart';
import { AutomatedNotificationStats } from '@/components/admin/AutomatedNotificationStats';
import { AdminTaskQueue } from '@/components/admin/AdminTaskQueue';

const AdminHomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome, {user?.first_name || user?.email}. Here's what's happening on the platform.
      </p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <DashboardAnalyticsTable />
        <AutomatedNotificationStats />
        <AdminTaskQueue />
      </div>
    </>
  );
};

export default AdminHomePage;