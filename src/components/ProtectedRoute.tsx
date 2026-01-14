import { Navigate } from 'react-router';
import { useIcsDataContext } from '@/context/IcsDataContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { icsUrl, isInitialized } = useIcsDataContext();

  // Wait for initial storage check to complete
  if (!isInitialized) {
    return null;
  }

  if (!icsUrl) {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}
