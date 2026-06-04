import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Chỉ cho phép truy cập nếu có Token trong localStorage.
 * Nếu không có token → redirect về /login.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
