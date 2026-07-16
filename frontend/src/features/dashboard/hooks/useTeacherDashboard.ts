import { useAuth } from "@/contexts/AuthContext";
import { useTeacherDashboardQuery } from "../api/dashboardQueries";

export const useTeacherDashboard = () => {
  const { user } = useAuth();
  return useTeacherDashboardQuery(user?.email);
};
