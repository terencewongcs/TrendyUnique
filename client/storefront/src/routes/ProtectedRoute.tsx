import { Navigate } from 'react-router-dom';
import { FC, ReactNode } from 'react';
import { useAppSelector } from '../app/hooks';

interface Props {
  children: ReactNode;
  role?: string;
}

const ProtectedRoute: FC<Props> = ({ children, role }) => {
  const user = useAppSelector((state) => state.user);

  if (!user.token) return <Navigate to="/signin" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
