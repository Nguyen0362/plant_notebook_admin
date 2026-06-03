import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Avatar, Dropdown, Typography, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import * as actions from '../stores/actions';
import { path } from '../utils/constant';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(actions.logout());
    navigate('/login');
  };

  // Menu items cho Sidebar
  const sidebarMenuItems = [
    {
      key: `${path.ADMIN}/${path.DASHBOARD}`,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: `${path.ADMIN}/${path.USERS}`,
      icon: <UserOutlined />,
      label: 'Quản lý User',
    },
    {
      key: `${path.ADMIN}/${path.ROLES}`,
      icon: <SafetyCertificateOutlined />,
      label: 'Phân quyền',
    },
    {
      key: `${path.ADMIN}/${path.LOGS}`,
      icon: <FileTextOutlined />,
      label: 'Logs',
    },
  ];

  // Dropdown items cho avatar
  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Hồ sơ cá nhân',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
        danger: true,
      },
    ],
    onClick: ({ key }) => {
      if (key === 'logout') {
        handleLogout();
      }
    },
  };

  // Xử lý click menu sidebar
  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  // Lấy selected key dựa trên path hiện tại
  const getSelectedKey = () => {
    const currentPath = location.pathname;
    // Tìm menu item match chính xác nhất
    const matched = sidebarMenuItems.find((item) => currentPath.startsWith(item.key));
    return matched ? matched.key : `${path.ADMIN}/${path.DASHBOARD}`;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ===== SIDEBAR ===== */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #0da487 0%, #009289 50%, #0b8a6f 100%)',
        }}
        theme="dark"
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '20px 8px' : '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            🌱
          </div>
          {!collapsed && (
            <div style={{ marginLeft: 12, overflow: 'hidden' }}>
              <Text
                strong
                style={{
                  color: '#fff',
                  fontSize: 18,
                  whiteSpace: 'nowrap',
                  display: 'block',
                  letterSpacing: '-0.3px',
                }}
              >
                Plant Notebook
              </Text>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                Admin Panel
              </Text>
            </div>
          )}
        </div>

        {/* Sidebar Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={sidebarMenuItems}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            borderRight: 'none',
            marginTop: 12,
          }}
        />
      </Sider>

      {/* ===== MAIN LAYOUT ===== */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 260,
          transition: 'margin-left 0.3s',
        }}
      >
        {/* Header */}
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            height: 64,
          }}
        >
          {/* Toggle Button */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 18,
              width: 48,
              height: 48,
            }}
          />

          {/* Right Side - User Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Dropdown menu={dropdownItems} placement="bottomRight" arrow>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: 8,
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = '#f5f5f5')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <Avatar
                  size={36}
                  style={{
                    background: 'linear-gradient(135deg, #0da487, #009289)',
                  }}
                  icon={<UserOutlined />}
                />
                <div style={{ lineHeight: 1.3 }}>
                  <Text strong style={{ fontSize: 14, display: 'block' }}>
                    {user?.name || 'Admin'}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: 'block' }}
                  >
                    {user?.email || 'admin@plant.com'}
                  </Text>
                </div>
              </div>
            </Dropdown>

            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ fontWeight: 500 }}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
