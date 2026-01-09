import { Navigate } from 'react-router';
import { getIcsUrl } from '@/lib/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const icsUrl = getIcsUrl();
  
  if (!icsUrl) {
    return <Navigate to="/setup" replace />;
  }
  
  return <>{children}</>;
}
