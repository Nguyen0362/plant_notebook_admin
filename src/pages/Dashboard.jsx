import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography, Space } from 'antd';
import {
  UserOutlined,
  ExperimentOutlined,
  HomeOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { apiGetDashboard } from '../services/dashboard';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await apiGetDashboard();
        setStats(result.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Cấu hình các thẻ thống kê
  const statCards = [
    {
      key: 'totalUsers',
      title: 'Tổng Người Dùng',
      value: stats?.totalUsers || 0,
      icon: <UserOutlined />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadowColor: 'rgba(102,126,234,0.4)',
      bgIcon: 'rgba(255,255,255,0.15)',
    },
    {
      key: 'totalPlants',
      title: 'Tổng Cây Trồng',
      value: stats?.totalPlants || 0,
      icon: <ExperimentOutlined />,
      gradient: 'linear-gradient(135deg, #0da487 0%, #009289 100%)',
      shadowColor: 'rgba(13,164,135,0.4)',
      bgIcon: 'rgba(255,255,255,0.15)',
    },
    {
      key: 'totalGardenPlants',
      title: 'Cây Trong Vườn',
      value: stats?.totalGardenPlants || 0,
      icon: <HomeOutlined />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      shadowColor: 'rgba(245,87,108,0.4)',
      bgIcon: 'rgba(255,255,255,0.15)',
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          📊 Dashboard
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Tổng quan về hệ thống Plant Notebook
        </Text>
      </div>

      {/* Statistic Cards */}
      <Row gutter={[24, 24]}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} lg={8} key={card.key}>
            <Card
              bordered={false}
              hoverable
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: `0 8px 24px ${card.shadowColor}`,
                background: card.gradient,
                cursor: 'default',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              styles={{
                body: { padding: '28px 24px' },
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${card.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${card.shadowColor}`;
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <Text
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: 14,
                      fontWeight: 500,
                      display: 'block',
                      marginBottom: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {card.title}
                  </Text>
                  <Statistic
                    value={card.value}
                    valueStyle={{
                      color: '#fff',
                      fontSize: 36,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  />
                  <div
                    style={{
                      marginTop: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <ArrowUpOutlined
                      style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 12,
                      }}
                    >
                      Cập nhật realtime
                    </Text>
                  </div>
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: card.bgIcon,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    color: '#fff',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Welcome Section */}
      <Card
        bordered={false}
        style={{
          marginTop: 32,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          boxShadow: '0 4px 16px rgba(252,182,159,0.3)',
        }}
        styles={{
          body: { padding: '32px' },
        }}
      >
        <Space direction="vertical" size={8}>
          <Title level={4} style={{ margin: 0, color: '#4a3020' }}>
            🌿 Chào mừng bạn quay trở lại!
          </Title>
          <Text style={{ color: '#6b4a3a', fontSize: 15 }}>
            Đây là bảng điều khiển quản trị hệ thống Plant Notebook. 
            Bạn có thể quản lý người dùng, phân quyền, và xem nhật ký hoạt động từ menu bên trái.
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
