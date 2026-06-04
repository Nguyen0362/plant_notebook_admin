import { Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Logs from './pages/Logs';
import Profile from './pages/Profile';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Route path constants
import { path } from './utils/constant';

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#0da487',
          borderRadius: 8,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: 'rgba(255,255,255,0.15)',
            darkItemHoverBg: 'rgba(255,255,255,0.08)',
            darkItemSelectedColor: '#fff',
            itemHeight: 48,
            iconSize: 18,
          },
          Button: {
            primaryShadow: '0 2px 8px rgba(13,164,135,0.35)',
          },
        },
      }}
    >
      <Routes>
        {/* Public Route - Login */}
        <Route path={path.LOGIN} element={<Login />} />

        {/* Private Routes - Admin */}
        <Route
          path={path.ADMIN}
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={path.DASHBOARD} replace />} />
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.USERS} element={<Users />} />
          <Route path={path.ROLES} element={<Roles />} />
          <Route path={path.LOGS} element={<Logs />} />
          <Route path={path.PROFILE} element={<Profile />} />
        </Route>

        {/* Redirect mặc định về /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
