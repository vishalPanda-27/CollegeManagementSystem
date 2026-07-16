import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Settings,
  Layers,
  Library,
  DoorOpen,
  CalendarClock,
  ClipboardList,
  CalendarDays,
  ClipboardCheck,
  GraduationCap as Logo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";
import type { LucideIcon } from "lucide-react";
interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  roles?: Role[];
}
const ALL_NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: GraduationCap },
  { to: "/teachers", label: "Teachers", icon: Users },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/subjects", label: "Subjects", icon: Library },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/programs", label: "Programs", icon: Layers },
  { to: "/classrooms", label: "Classrooms", icon: DoorOpen },
  { to: "/enrollments", label: "Enrollments", icon: ClipboardList },
  { to: "/timetable", label: "Timetable", icon: CalendarClock },
  { to: "/schedules", label: "Class Schedule", icon: CalendarDays },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/results", label: "Results", icon: GraduationCap },
  { to: "/users", label: "Users", icon: Users, roles: ["ADMIN"] },
  { to: "/students", label: "Students", icon: GraduationCap, roles: ["ADMIN", "DEAN"] },
  { to: "/teachers", label: "Teachers", icon: Users, roles: ["ADMIN", "DEAN"] },
  { to: "/courses", label: "Courses", icon: BookOpen, roles: ["ADMIN", "DEAN", "TEACHER"] },
  { to: "/subjects", label: "Subjects", icon: Library, roles: ["ADMIN", "DEAN", "TEACHER"] },
  { to: "/departments", label: "Departments", icon: Building2, roles: ["ADMIN"] },
  { to: "/programs", label: "Programs", icon: Layers, roles: ["ADMIN"] },
  { to: "/classrooms", label: "Classrooms", icon: DoorOpen, roles: ["ADMIN"] },
  { to: "/enrollments", label: "Enrollments", icon: ClipboardList, roles: ["ADMIN"] },
  { to: "/enrollments/students", label: "My Courses", icon: BookOpen, roles: ["STUDENT"] },
  { to: "/timetable", label: "Timetable", icon: CalendarClock, roles: ["ADMIN", "TEACHER", "STUDENT"] },
  { to: "/schedules", label: "Class Schedule", icon: CalendarDays, roles: ["ADMIN"] },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck, roles: ["ADMIN", "DEAN", "TEACHER"] },
  { to: "/attendance/student", label: "My Attendance", icon: ClipboardCheck, roles: ["STUDENT"] },
  { to: "/results", label: "Results", icon: GraduationCap, roles: ["ADMIN", "DEAN", "TEACHER"] },
  { to: "/results/transcript", label: "My Results", icon: GraduationCap, roles: ["STUDENT"] },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const role = user?.role;
  const nav = ALL_NAV.filter((item) => !item.roles || (role && item.roles.includes(role)));
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Logo className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Campus OS</span>
            <span className="text-xs text-muted-foreground">
              {role ? role.charAt(0) + role.slice(1).toLowerCase() + " Console" : "Console"}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          v1.0.0 · College MS
        </div>
      </aside>
    </>
  );
}
