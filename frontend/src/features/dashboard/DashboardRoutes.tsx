import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import DeanDashboard from "./pages/DeanDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";

export default function DashboardRoutes() {
  const { user } = useAuth();
  switch (user?.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "DEAN":
      return <DeanDashboard />;
    case "TEACHER":
      return <TeacherDashboard />;
    case "STUDENT":
      return <StudentDashboard />;
    default:
      return <Unauthorized />;
  }
}
