import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute - Chỉ cho phép truy cập nếu đã đăng nhập (isLoggedIn = true trong Redux).
 * Nếu chưa đăng nhập → redirect về /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
