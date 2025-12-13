import React from 'react';
import { NotificationHistoryChart } from '@/components/admin/NotificationHistoryChart';
import Seo from '@/components/Seo';

const ManualNotificationsPage: React.FC = () => {
  return (
    <>
      <Seo
        title="Manual Notifications Analytics | Admin"
        description="Analytics for manual admin notification tasks."
      />
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Manual Notification Tasks</h1>
          <p className="text-muted-foreground mt-2">
            History and forecast of scheduled vs. completed manual tasks (Admin Calls, Social Media, etc.).
          </p>
        </div>
        <NotificationHistoryChart
          dataUrl="/api/analytics/manual-notifications/"
          title="Manual Task Trends"
          description="Number of manual tasks scheduled for each day versus the number marked as completed."
        />
        {/* Potentially other components could go here, like a data table of tasks */}
      </div>
    </>
  );
};

export default ManualNotificationsPage;
