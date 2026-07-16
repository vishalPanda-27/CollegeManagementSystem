export const CHART_COLORS = [
  "hsl(var(--primary))",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
];

export const STATUS_COLORS: Record<string, string> = {
  PRESENT: "#10b981",
  ABSENT: "#ef4444",
  LATE: "#f59e0b",
  LEAVE: "#6366f1",
  PASS: "#10b981",
  FAIL: "#ef4444",
  ACTIVE: "#10b981",
  INACTIVE: "#94a3b8",
  GRADUATED: "#6366f1",
  SUSPENDED: "#ef4444",
  ENROLLED: "#3b82f6",
  COMPLETED: "#10b981",
  DROPPED: "#94a3b8",
  WITHDRAWN: "#f59e0b",
  AVAILABLE: "#10b981",
  OCCUPIED: "#f59e0b",
  MAINTENANCE: "#ef4444",
};

export const groupCount = <T>(items: T[], keyFn: (i: T) => string) => {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = keyFn(it) || "—";
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
};
