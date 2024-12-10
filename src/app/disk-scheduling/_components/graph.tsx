"use client";

import { CartesianGrid, Line, LineChart, YAxis, XAxis, LabelList } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/chart";
import useDiskStore from "@/stores/disk-scheduling-store";

const Graph = () => {
  const headMovements = useDiskStore((state) => state.headMovements);
  const currentPosition = useDiskStore((state) => state.currentPosition);
  // const trackSize = useDiskStore((state) => state.trackSize);

  // Create data points where each head movement is represented by a single point (just the final position)
  // Filter out consecutive duplicate movements
  const chartData = headMovements.reduce<{ label: number; movement: number }[]>((acc, movement, index) => {
    const [to] = movement.step.split('->').map((s) => parseInt(s.trim(), 10));

    // If it's the first movement, add the initial position (256) as the first data point
    if (index === 0) {
      acc.push({ label: index * 50 + 100, movement: currentPosition });
    }

    // If the 'to' value is different from the last one, push it to the chart data
    if (acc.length === 0 || acc[acc.length - 1].movement !== to) {
      acc.push({ label: index * 50 + 100, movement: to });
    }

    return acc;
  }, []);

  // Chart configuration
  const chartConfig = {
    desktop: {
      label: "Head Position",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disk Scheduling Graph</CardTitle>
        <CardDescription>Head movement Visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              top: 12,
              right: 12,
              bottom: 12,
              left: 20,
            }}
            layout="vertical" // Set layout to vertical for horizontal graph
          >
            <CartesianGrid vertical={true} />
            <YAxis
              dataKey="label" // Y-axis for head position
              type="number" // Ensure Y-axis is set to type number
              tickLine={false}
              axisLine={false} // Hide Y-axis line
              tickMargin={8}
              width={60}
              stroke="none" // Ensure no stroke is shown
              hide={true}
            />
            <XAxis
              dataKey="movement" // X-axis for track requests
              type="number" // Ensure X-axis is set to type number
              tickLine={false}
              axisLine={false} // Hide X-axis line
              tickMargin={8}
              // domain={[0, trackSize - 1]} // Set the domain for the X-axis based on the track size
              stroke="var(--color-desktop)" // Optionally, keep stroke for visual context
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="linear"
              dataKey="movement" // Use track for the X-axis line
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={true}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Graph;
