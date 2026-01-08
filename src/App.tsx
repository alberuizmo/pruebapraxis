import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedLayout } from "@/components/layouts/ProtectedLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { TokenManager } from "@/lib/auth-tokens";
import { QUERY_KEYS, ROUTES } from "@/constants";
import { env } from "@/config/env";
import type { User, UserRole } from "@/types";

/**
 * Initialize session from stored token
 * 
 * SECURITY: We validate the token before hydrating the cache
 * This prevents using expired or tampered tokens
 */
const getInitialSession = (): User | null => {
  const token = TokenManager.get();
  if (!token) return null;
  
  const payload = TokenManager.decode(token.accessToken);
  if (!payload) {
    // Token invalid or expired, clean up
    TokenManager.clear();
    return null;
  }
  
  return {
    id: payload.userId,
    email: payload.email,
    name: 'Test User',
    role: payload.role as UserRole
  };
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Production settings for security
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

// Hydrate cache with validated session
const initialSession = getInitialSession();
if (initialSession) {
  queryClient.setQueryData(QUERY_KEYS.AUTH.SESSION, initialSession);
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          
          <Route element={<ProtectedLayout />}>
             <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
             {/* Redirect root to dashboard */}
             <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* DevTools only in development */}
      {env.enableDevTools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
