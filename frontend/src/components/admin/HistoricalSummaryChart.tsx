"use client"

import { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { authedFetch } from '@/apiClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Loader2 } from 'lucide-react';

interface ChartDataPoint {
    month: string;
    users: number;
    events: number;
    payments: number;
}

const chartConfig = {
  users: {
    label: "New Users",
    color: "var(--chart-1)",
  },
  events: {
    label: "Events Created",
    color: "var(--chart-2)",
  },
  payments: {
    label: "Payments",
    color: "var(--chart-3)",
  }
} satisfies ChartConfig

export function HistoricalSummaryChart() {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await authedFetch('/api/data/analytics/historical-summary/');
                if (!response.ok) {
                    throw new Error(`Failed to fetch chart data`);
                }
                const data = await response.json();
                setChartData(data);
                setError(null);
            } catch (err) {
                setError("Could not load chart data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>12-Month Platform Growth</CardTitle>
                <CardDescription>New users, events, and payments over the last year.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex justify-center items-center h-72">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {error && <p className="text-destructive text-center">{error}</p>}
                {!loading && !error && (
                    <ChartContainer config={chartConfig} className="h-72">
                        <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => {
                                    const date = new Date(`${value}-02`); // Add day to avoid timezone issues
                                    return date.toLocaleDateString('en-US', { month: 'short' });
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickCount={6}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Area dataKey="users" type="monotone" fill="var(--color-users)" fillOpacity={0.4} stroke="var(--color-users)" />
                            <Area dataKey="events" type="monotone" fill="var(--color-events)" fillOpacity={0.4} stroke="var(--color-events)" />
                            <Area dataKey="payments" type="monotone" fill="var(--color-payments)" fillOpacity={0.4} stroke="var(--color-payments)" />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
