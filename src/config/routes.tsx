
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "@/pages/Index";
import About from "@/pages/About";
import LearnMore from "@/pages/LearnMore";
import Auth from "@/pages/Auth";
import AcceptInvitation from "@/pages/AcceptInvitation";
import ChangePassword from "@/pages/ChangePassword";
import Dashboard from "@/pages/Dashboard";
import AccountInfo from "@/pages/AccountInfo";
import Favorites from "@/pages/Favorites";
import Reports from "@/pages/Reports";
import Admin from "@/pages/Admin";
import AdvisorManagement from "@/pages/AdvisorManagement";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/NotFound";
import DataManagement from "@/pages/DataManagement";
import IssueReports from "@/pages/IssueReports";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/learn-more" element={<LearnMore />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/accept-invitation" element={<AcceptInvitation />} />
      <Route 
        path="/change-password" 
        element={
          <ErrorBoundary>
            <ChangePassword />
          </ErrorBoundary>
        } 
      />
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <About />
            </ErrorBoundary>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/account-info" 
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <AccountInfo />
            </ErrorBoundary>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/favorites" 
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <Favorites />
            </ErrorBoundary>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <Reports />
            </ErrorBoundary>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <ErrorBoundary>
              <Admin />
            </ErrorBoundary>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/advisors" 
        element={
          <AdminRoute>
            <ErrorBoundary>
              <AdvisorManagement />
            </ErrorBoundary>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <ErrorBoundary>
              <UserManagement />
            </ErrorBoundary>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/data" 
        element={
          <AdminRoute>
            <ErrorBoundary>
              <DataManagement />
            </ErrorBoundary>
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/issues" 
        element={
          <AdminRoute>
            <ErrorBoundary>
              <IssueReports />
            </ErrorBoundary>
          </AdminRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
