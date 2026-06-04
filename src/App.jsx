import { Route, Routes, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages (Cấu trúc mới chuẩn chỉnh)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Logs from './pages/Logs';
import Profile from './pages/Profile';

// Components của phần Quản lý cây trồng và API Key (Bốc từ nhánh tính năng qua)
import { 
  LibraryPlantList, 
  LibraryPlantForm, 
  CategoryList,
  Product, 
  AddProduct, 
  GeminiKeys 
} from "./containers/public";

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
<Route path={path.PRODUCT} element={<Product />} />
          <Route path={path.PRODUCT_ADD} element={<AddProduct />} />
          <Route path={path.GEMINI_KEY} element={<GeminiKeys />} />
          <Route path={path.LIBRARY_PLANTS} element={<LibraryPlantList mode="approved" />} />
          <Route path={path.LIBRARY_PLANTS_PENDING} element={<LibraryPlantList mode="pending" />} />
          <Route path={path.LIBRARY_PLANTS_HISTORY} element={<LibraryPlantList mode="history" />} />
          <Route path={path.LIBRARY_PLANTS_ADD} element={<LibraryPlantForm />} />
          <Route path={path.LIBRARY_PLANTS_EDIT} element={<LibraryPlantForm />} />
          <Route path={path.CATEGORIES} element={<CategoryList />} />
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
