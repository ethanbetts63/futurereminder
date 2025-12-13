"use client"

import { useState, useEffect } from 'react';
import { authedFetch } from '@/apiClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCounter {
  [key: string]: number;
}

interface NotificationStats {
  sent: StatsCounter;
  failed: StatsCounter;
}

const channelDisplayName: { [key: string]: string } = {
  'primary_email': 'Primary Email',
  'primary_sms': 'Primary SMS',
  'backup_email': 'Backup Email',
  'backup_sms': 'Backup SMS',
};

export function AutomatedNotificationStats() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await authedFetch('/api/notifications/stats/');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data: NotificationStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const renderStats = (counter: StatsCounter, variant: "default" | "destructive") => {
    const entries = Object.entries(counter);
    if (entries.length === 0) {
      return <p className="text-sm text-muted-foreground">None in the last 7 days.</p>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {entries.map(([channel, count]) => (
          <Badge key={channel} variant={variant} className="text-sm">
            {channelDisplayName[channel] || channel}: {count}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Notifications</CardTitle>
        <CardDescription>Activity in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-base">Sent Successfully</h4>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : stats && renderStats(stats.sent, "default")}
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-base">Failed to Send</h4>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : stats && renderStats(stats.failed, "destructive")}
        </div>
      </CardContent>
    </Card>
  );
}
