"use client"

import { useState, useEffect } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
    date: string;
    scheduled: number;
    completed: number;
}

interface NotificationHistoryChartProps {
    dataUrl: string;
    title: string;
    description: string;
}

const chartConfig = {
  scheduled: {
    label: "Scheduled",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function NotificationHistoryChart({ dataUrl, title, description }: NotificationHistoryChartProps) {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await authedFetch(dataUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch chart data from ${dataUrl}`);
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
    }, [dataUrl]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
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
                        <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
                                }}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Line dataKey="scheduled" type="monotone" stroke="var(--color-scheduled)" strokeWidth={2} dot={false} />
                            <Line dataKey="completed" type="monotone" stroke="var(--color-completed)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
