import { useAuth } from "@/contexts/AuthContext";
import { useDeanDashboardQuery } from "../api/dashboardQueries";

export const useDeanDashboard = () => {
  const { user } = useAuth();
  return useDeanDashboardQuery(user?.email);
};
