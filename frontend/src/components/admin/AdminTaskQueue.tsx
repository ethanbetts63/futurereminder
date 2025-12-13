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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";

interface AdminTask {
  id: number;
  scheduled_send_time: string;
  channel_display: string;
  recipient_contact_info: string;
  event_name: string;
  user_full_name: string;
}

export function AdminTaskQueue() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await authedFetch('/api/notifications/admin-tasks/');
        if (!response.ok) {
          throw new Error('Failed to fetch admin tasks');
        }
        const data: AdminTask[] = await response.json();
        setTasks(data);
      } catch (err) {
        setError('Could not load tasks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Admin Task Queue</CardTitle>
        <CardDescription>Manual notification tasks scheduled for this week.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-muted-foreground">Loading tasks...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="text-muted-foreground">No manual tasks scheduled for this week.</p>
        )}
        {!loading && !error && tasks.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Due Date</TableHead>
                <TableHead>Task Type</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{formatDate(task.scheduled_send_time)}</TableCell>
                  <TableCell><Badge variant="outline">{task.channel_display}</Badge></TableCell>
                  <TableCell>{task.event_name}</TableCell>
                  <TableCell>{task.user_full_name}</TableCell>
                  <TableCell className="font-mono">{task.recipient_contact_info}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" disabled>
                      Complete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
