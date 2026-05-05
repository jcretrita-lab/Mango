import React, { useEffect } from 'react';
import { HashRouter, useNavigate } from 'react-router-dom';
import AppShellRoutes from './components/AppShellRoutes';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { NotificationProvider } from './context/NotificationContext';
import { setApiTokenGetter } from './hooks/useApiCollections';
import { setApiTokenGetter as setQueriesTokenGetter } from './hooks/useQueries';

/**
 * Wires the JWT token into the API hook layer and listens for 401 events
 * to auto-logout when the session expires.
 */
function ApiTokenBridge() {
  const { token, logout } = useAuth();

  // Keep the API hook's token getter in sync with the auth context
  useEffect(() => {
    setApiTokenGetter(() => token);
    setQueriesTokenGetter(() => token);
  }, [token]);

  // Listen for 401 responses from the API hook and auto-logout
  useEffect(() => {
    const handle = () => {
      logout();
    };
    window.addEventListener('hris:unauthorized', handle);
    return () => window.removeEventListener('hris:unauthorized', handle);
  }, [logout]);

  return null;
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <HashRouter>
            <BreadcrumbProvider>
              <ApiTokenBridge />
              {children}
            </BreadcrumbProvider>
          </HashRouter>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Layout>
        <AppShellRoutes />
      </Layout>
    </AppProviders>
  );
}
