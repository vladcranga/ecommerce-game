import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
