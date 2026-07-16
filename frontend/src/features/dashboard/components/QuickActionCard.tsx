import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface QuickAction {
  label: string;
  to: string;
  icon: LucideIcon;
  description?: string;
}

export function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = action.icon;
  return (
    <Link to={action.to}>
      <Card className="group relative h-full overflow-hidden p-4 transition-all hover:border-primary/40 hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium">{action.label}</div>
            {action.description && (
              <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {action.description}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {actions.map((a) => (
        <QuickActionCard key={a.label} action={a} />
      ))}
    </div>
  );
}
