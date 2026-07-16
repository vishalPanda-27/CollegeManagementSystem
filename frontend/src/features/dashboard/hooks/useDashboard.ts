import { useAuth } from "@/contexts/AuthContext";

export function useDashboard() {
  const { user } = useAuth();
  return { user, role: user?.role, email: user?.email };
}
