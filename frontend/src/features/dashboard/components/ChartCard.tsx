import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnalyticsCard } from "./AnalyticsCard";
import { CHART_COLORS, STATUS_COLORS } from "../utils/chartHelpers";
import { DashboardEmptyState } from "./DashboardEmptyState";

interface Datum {
  name: string;
  value: number;
}

const height = 260;

export function PieChartCard({
  title,
  description,
  data,
  colorMap,
}: {
  title: string;
  description?: string;
  data: Datum[];
  colorMap?: Record<string, string>;
}) {
  return (
    <AnalyticsCard title={title} description={description}>
      {data.length === 0 ? (
        <DashboardEmptyState message="No data yet." />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={
                    colorMap?.[entry.name] ??
                    STATUS_COLORS[entry.name] ??
                    CHART_COLORS[i % CHART_COLORS.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </AnalyticsCard>
  );
}

export function BarChartCard({
  title,
  description,
  data,
  color,
}: {
  title: string;
  description?: string;
  data: Datum[];
  color?: string;
}) {
  return (
    <AnalyticsCard title={title} description={description}>
      {data.length === 0 ? (
        <DashboardEmptyState message="No data yet." />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" fontSize={11} tickMargin={6} />
            <YAxis fontSize={11} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
              }}
            />
            <Bar
              dataKey="value"
              fill={color ?? CHART_COLORS[0]}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </AnalyticsCard>
  );
}

export function LineChartCard({
  title,
  description,
  data,
  color,
}: {
  title: string;
  description?: string;
  data: Datum[];
  color?: string;
}) {
  return (
    <AnalyticsCard title={title} description={description}>
      {data.length === 0 ? (
        <DashboardEmptyState message="No data yet." />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" fontSize={11} />
            <YAxis fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color ?? CHART_COLORS[0]}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </AnalyticsCard>
  );
}
