import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedLayout } from "@/components/layouts/ProtectedLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { TokenManager } from "@/lib/auth-tokens";
import type { User } from "@/features/auth/services/auth.service";

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
    role: payload.role as 'admin' | 'user'
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
  queryClient.setQueryData(['auth', 'session'], initialSession);
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedLayout />}>
             <Route path="/dashboard" element={<DashboardPage />} />
             {/* Redirect root to dashboard */}
             <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
