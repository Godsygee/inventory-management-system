import { createBrowserRouter, Navigate } from 'react-router';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Inventory from './pages/inventory';
import SalesHistory from './pages/saleshistory';
import Analytics from './pages/analytics';
import { isAuthenticated } from './utils/storage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function Protected({ element }: { element: React.ReactNode }) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/dashboard', element: <Protected element={<Dashboard />} /> },
  { path: '/inventory', element: <Protected element={<Inventory />} /> },
  { path: '/sales', element: <Protected element={<SalesHistory />} /> },
  { path: '/analytics', element: <Protected element={<Analytics />} /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
