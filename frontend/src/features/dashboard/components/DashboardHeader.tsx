import type { ReactNode } from "react";
import type { Role } from "@/types";

const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrator",
  DEAN: "Dean",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

export function DashboardHeader({
  name,
  role,
  subtitle,
  actions,
}: {
  name?: string | null;
  role?: Role;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {role ? ROLE_LABEL[role] : "Dashboard"}
        </div>
        <h1 className="mt-1 truncate text-2xl font-bold tracking-tight">
          {greeting}, {name ?? "there"} 👋
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
