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

// Define the shape of our data
interface WeeklyData {
  weekStart: string;
  profileCreations: number;
  eventCreations: number;
  successfulPayments: number;
}

export function DashboardAnalyticsTable() {
  const [data, setData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await authedFetch('/api/dashboard-analytics/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData: WeeklyData[] = await response.json();
        setData(responseData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Platform Activity</CardTitle>
        <CardDescription>
          Summary of new users, events, and payments for the last four weeks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-center text-muted-foreground">Loading data...</p>}
        {error && <p className="text-center text-destructive">{error}</p>}
        {!loading && !error && data.length === 0 && (
          <p className="text-center text-muted-foreground">No activity data to display for the last four weeks.</p>
        )}
        {!loading && !error && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Week Starting</TableHead>
                <TableHead className="text-center font-semibold">New Users</TableHead>
                <TableHead className="text-center font-semibold">Events Created</TableHead>
                <TableHead className="text-center font-semibold">Payments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.weekStart}>
                  <TableCell>{row.weekStart}</TableCell>
                  <TableCell className="text-center">{row.profileCreations}</TableCell>
                  <TableCell className="text-center">{row.eventCreations}</TableCell>
                  <TableCell className="text-center">{row.successfulPayments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
