import { Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Tất cả components giờ nằm chung trong containers
import {
  Layout,
  Login,
  Dashboard,
  Users,
  Roles,
  Logs,
  Profile,
  GeminiKeys,
  LibraryPlantList,
  LibraryPlantForm,
  CategoryList,
} from './containers';

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

        {/* Private Routes - Layout của teammate */}
        <Route
          path={path.ADMIN}
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to={path.DASHBOARD} replace />} />

          {/* Dashboard & Quản trị */}
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.USERS} element={<Users />} />
          <Route path={path.ROLES} element={<Roles />} />
          <Route path={path.LOGS} element={<Logs />} />
          <Route path={path.PROFILE} element={<Profile />} />

          {/* Quản lý cây trồng & API Keys */}
          <Route path={path.GEMINI_KEY} element={<GeminiKeys />} />
          <Route path={path.LIBRARY_PLANTS} element={<LibraryPlantList mode="approved" />} />
          <Route path={path.LIBRARY_PLANTS_PENDING} element={<LibraryPlantList mode="pending" />} />
          <Route path={path.LIBRARY_PLANTS_HISTORY} element={<LibraryPlantList mode="history" />} />
          <Route path={path.LIBRARY_PLANTS_ADD} element={<LibraryPlantForm />} />
          <Route path={path.LIBRARY_PLANTS_EDIT} element={<LibraryPlantForm />} />
          <Route path={path.CATEGORIES} element={<CategoryList />} />
        </Route>

        {/* Redirect mặc định về /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App;
