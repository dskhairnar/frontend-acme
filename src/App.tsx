
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/LoginForm";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardOverview from "@/components/DashboardOverview";
import WeightProgress from "@/components/WeightProgress";
import Shipments from "@/components/Shipments";
import Profile from "@/components/Profile";
import NotFound from "@/pages/NotFound";
import { useEffect } from 'react';
import AuthLogoutHandler from "@/contexts/AuthLogoutHandler";
import Medication from "@/pages/Medication";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-500"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardOverview />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/weight-progress" element={
        <ProtectedRoute>
          <DashboardLayout>
            <WeightProgress />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/shipments" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Shipments />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      <Route path="/medications" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Medication />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (AuthProvider as any).onLogout = () => navigate('/login');
    return () => {
      (AuthProvider as any).onLogout = undefined;
    };
  }, [navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AuthLogoutHandler />
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
