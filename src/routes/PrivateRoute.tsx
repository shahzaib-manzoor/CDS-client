import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function PrivateRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optionally, add a spinner or loader
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
