import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import StudentsPage from "@/pages/StudentsPage";
import TeachersPage from "@/pages/TeachersPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import DepartmentDetailsPage from "@/pages/DepartmentDetailsPage";
import ProgramsPage from "@/features/program/pages/ProgramsPage";
import CoursesPage from "@/features/course/pages/CoursesPage";
import SubjectsPage from "./features/subject/pages/SubjectsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";

function HomeRedirect() {
  const { isAuthenticated } = useAuth();

  return (
    <Navigate
      to={isAuthenticated ? "/dashboard" : "/login"}
      replace
    />
  );
}

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route
            path="/departments/:id"
            element={<DepartmentDetailsPage />}
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}