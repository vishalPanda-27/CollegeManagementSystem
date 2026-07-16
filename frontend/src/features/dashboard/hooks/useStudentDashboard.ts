import { useAuth } from "@/contexts/AuthContext";
import { useStudentDashboardQuery } from "../api/dashboardQueries";

export const useStudentDashboard = () => {
  const { user } = useAuth();
  return useStudentDashboardQuery(user?.email);
};
