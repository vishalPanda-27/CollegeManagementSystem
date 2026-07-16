import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DashboardGrid({
  children,
  cols = 4,
  className,
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}) {
  const map = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  } as const;
  return (
    <div className={cn("grid gap-4", map[cols], className)}>{children}</div>
  );
}

export function DashboardSection({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mt-6", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
