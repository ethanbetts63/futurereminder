import React from 'react';
import { NotificationHistoryChart } from '@/components/admin/NotificationHistoryChart';
import Seo from '@/components/Seo';

const AutomatedNotificationsPage: React.FC = () => {
  return (
    <>
      <Seo
        title="Automated Notifications Analytics | Admin"
        description="Analytics for automated notifications including email and SMS."
      />
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Automated Notifications</h1>
          <p className="text-muted-foreground mt-2">
            History and forecast of scheduled vs. sent automated notifications (Email & SMS).
          </p>
        </div>
        <NotificationHistoryChart
          dataUrl="/api/analytics/automated-notifications/"
          title="Automated Notification Trends"
          description="Number of notifications scheduled for each day versus the number actually sent."
        />
        {/* Potentially other components could go here, like a data table of notifications */}
      </div>
    </>
  );
};

export default AutomatedNotificationsPage;
