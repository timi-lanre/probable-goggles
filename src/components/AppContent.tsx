
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BotProtection } from "@/components/BotProtection";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { AppRoutes } from "@/config/routes";

const AppContentInner = () => {
  useInactivityLogout();
  return <AppRoutes />;
};

export const AppContent = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <BotProtection />
          <AppContentInner />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};
