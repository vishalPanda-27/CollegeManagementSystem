import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { AnalyticsCard } from "./AnalyticsCard";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { initials } from "../utils/dashboardHelpers";

export interface RecentItem {
  key: string | number;
  primary: string;
  secondary?: string;
  meta?: string;
  to?: string;
}

export function RecentActivityCard({
  title,
  description,
  items,
  action,
  emptyMessage = "Nothing to show yet.",
}: {
  title: string;
  description?: string;
  items: RecentItem[];
  action?: ReactNode;
  emptyMessage?: string;
}) {
  return (
    <AnalyticsCard title={title} description={description} action={action}>
      {items.length === 0 ? (
        <DashboardEmptyState message={emptyMessage} />
      ) : (
        <ul className="divide-y">
          {items.map((it) => {
            const body = (
              <div className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials(it.primary)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{it.primary}</div>
                  {it.secondary && (
                    <div className="truncate text-xs text-muted-foreground">
                      {it.secondary}
                    </div>
                  )}
                </div>
                {it.meta && (
                  <div className="shrink-0 text-xs text-muted-foreground">
                    {it.meta}
                  </div>
                )}
              </div>
            );
            return (
              <li key={it.key}>
                {it.to ? (
                  <Link to={it.to} className="block hover:bg-muted/40">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      )}
    </AnalyticsCard>
  );
}
