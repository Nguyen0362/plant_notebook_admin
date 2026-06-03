import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography, Space, Table, Tag, Avatar } from 'antd';
import {
  UserOutlined,
  ExperimentOutlined,
  HomeOutlined,
  ArrowUpOutlined,
  ShopOutlined,
  BellOutlined,
  HeartOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import dayjs from 'dayjs';
import { apiGetDashboard, apiGetTimeseries, apiGetAnalytics } from '../services/dashboard';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [timeseries, setTimeseries] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, timeseriesRes, analyticsRes] = await Promise.allSettled([
          apiGetDashboard(),
          apiGetTimeseries(30),
          apiGetAnalytics(),
        ]);

        if (summaryRes.status === 'fulfilled') setStats(summaryRes.value.data);
        if (timeseriesRes.status === 'fulfilled') setTimeseries(timeseriesRes.value.data);
        if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ========== STAT CARDS CONFIG ==========
  const statCards = [
    {
      key: 'totalUsers',
      title: 'Tổng Người Dùng',
      value: stats?.totalUsers || 0,
      weekChange: stats?.newUsersThisWeek || 0,
      icon: <UserOutlined />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadowColor: 'rgba(102,126,234,0.35)',
    },
    {
      key: 'totalPlants',
      title: 'Thư Viện Cây Trồng',
      value: stats?.totalPlants || 0,
      icon: <ExperimentOutlined />,
      gradient: 'linear-gradient(135deg, #0da487 0%, #009289 100%)',
      shadowColor: 'rgba(13,164,135,0.35)',
    },
    {
      key: 'totalGardenPlants',
      title: 'Cây Trong Vườn',
      value: stats?.totalGardenPlants || 0,
      weekChange: stats?.newGardenPlantsThisWeek || 0,
      icon: <HomeOutlined />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      shadowColor: 'rgba(245,87,108,0.35)',
    },
    {
      key: 'totalStores',
      title: 'Cửa Hàng / Vườn Ươm',
      value: stats?.totalStores || 0,
      icon: <ShopOutlined />,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      shadowColor: 'rgba(250,112,154,0.35)',
    },
    {
      key: 'totalReminders',
      title: 'Lời Nhắc',
      value: stats?.totalReminders || 0,
      icon: <BellOutlined />,
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      shadowColor: 'rgba(161,140,209,0.35)',
    },
    {
      key: 'totalCareHistories',
      title: 'Lịch Sử Chăm Sóc',
      value: stats?.totalCareHistories || 0,
      icon: <HeartOutlined />,
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      shadowColor: 'rgba(252,182,159,0.35)',
      textColor: '#6b4a3a',
    },
  ];

  // ========== LINE CHART: User Growth ==========
  const buildLineData = () => {
    if (!timeseries) return [];
    const result = [];
    const userMap = {};
    const plantMap = {};

    (timeseries.userTimeseries || timeseries || []).forEach(item => {
      userMap[item.date] = item.count;
    });
    (timeseries.gardenPlantTimeseries || []).forEach(item => {
      plantMap[item.date] = item.count;
    });

    // Build continuous date range for last 30 days
    for (let i = 29; i >= 0; i--) {
      const d = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      result.push({ date: d, count: userMap[d] || 0, type: 'Người dùng mới' });
      result.push({ date: d, count: plantMap[d] || 0, type: 'Cây mới trồng' });
    }
    return result;
  };

  const lineConfig = {
    data: buildLineData(),
    xField: 'date',
    yField: 'count',
    colorField: 'type',
    smooth: true,
    height: 320,
    axis: {
      x: {
        labelFormatter: (v) => dayjs(v).format('DD/MM'),
      },
    },
    style: {
      lineWidth: 2.5,
    },
    point: {
      shapeField: 'circle',
      sizeField: 3,
    },
    interaction: {
      tooltip: {
        marker: true,
      },
    },
    scale: {
      color: {
        range: ['#667eea', '#0da487'],
      },
    },
  };

  // ========== PIE CHART: Plants by Category ==========
  const pieConfig = {
    data: analytics?.plantsByCategory || [],
    angleField: 'count',
    colorField: 'category',
    height: 300,
    innerRadius: 0.6,
    label: {
      text: 'category',
      position: 'outside',
      style: { fontSize: 12 },
    },
    legend: {
      position: 'bottom',
    },
    interaction: {
      elementHighlight: true,
    },
    statistic: {
      title: { content: 'Phân loại' },
      content: {
        content: String((analytics?.plantsByCategory || []).reduce((s, d) => s + d.count, 0)),
      },
    },
  };

  // ========== COLUMN CHART: Care by Type ==========
  const careColumnConfig = {
    data: analytics?.careByType || [],
    xField: 'type',
    yField: 'count',
    height: 300,
    style: {
      radiusTopLeft: 8,
      radiusTopRight: 8,
      fill: (datum) => {
        const colors = ['#667eea', '#0da487', '#f5576c', '#fa709a', '#fbc2eb', '#fee140'];
        const idx = (analytics?.careByType || []).indexOf(datum);
        return colors[idx % colors.length];
      },
    },
    label: {
      text: 'count',
      position: 'inside',
      style: { fill: '#fff', fontWeight: 600 },
    },
    axis: {
      y: { title: 'Số lần' },
      x: { title: 'Loại chăm sóc' },
    },
  };

  // ========== COLUMN CHART: Plants by Status ==========
  const statusColumnConfig = {
    data: analytics?.plantsByStatus || [],
    xField: 'status',
    yField: 'count',
    height: 300,
    style: {
      radiusTopLeft: 8,
      radiusTopRight: 8,
    },
    colorField: 'status',
    label: {
      text: 'count',
      position: 'inside',
      style: { fill: '#fff', fontWeight: 600 },
    },
    axis: {
      y: { title: 'Số lượng' },
      x: { title: 'Trạng thái' },
    },
  };

  // ========== RECENT USERS TABLE ==========
  const recentUserColumns = [
    {
      title: '',
      key: 'avatar',
      width: 48,
      render: (_, record) => (
        <Avatar
          size={32}
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
          icon={<UserOutlined />}
        />
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
      render: (text) => <Text strong>{text || '—'}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (text) => (
        <Space size={4}>
          <MailOutlined style={{ color: '#0da487', fontSize: 12 }} />
          <Text style={{ fontSize: 13 }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (date) => (
        <Space size={4}>
          <CalendarOutlined style={{ color: '#999', fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '—'}
          </Text>
        </Space>
      ),
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
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Spin size="large" />
        <Text type="secondary">Đang tải dữ liệu dashboard...</Text>
      </div>
    );
  }

  return (
    <div>
      {/* ===== Page Header ===== */}
      <div style={{ marginBottom: 28 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          Dashboard
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Tổng quan về hệ thống Plant Notebook
        </Text>
      </div>

      {/* ===== Stat Cards ===== */}
      <Row gutter={[20, 20]}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} lg={8} key={card.key}>
            <Card
              bordered={false}
              hoverable
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: `0 6px 20px ${card.shadowColor}`,
                background: card.gradient,
                cursor: 'default',
                transition: 'transform 0.3s, box-shadow 0.3s',
              }}
              styles={{ body: { padding: '24px 20px' } }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${card.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${card.shadowColor}`;
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
                      color: card.textColor ? card.textColor : 'rgba(255,255,255,0.8)',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {card.title}
                  </Text>
                  <Statistic
                    value={card.value}
                    valueStyle={{
                      color: card.textColor || '#fff',
                      fontSize: 32,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  />
                  {card.weekChange > 0 && (
                    <div
                      style={{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <ArrowUpOutlined
                        style={{
                          color: card.textColor ? card.textColor : 'rgba(255,255,255,0.85)',
                          fontSize: 12,
                        }}
                      />
                      <Text
                        style={{
                          color: card.textColor ? card.textColor : 'rgba(255,255,255,0.85)',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        +{card.weekChange} tuần này
                      </Text>
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: card.textColor || '#fff',
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

      {/* ===== Line Chart: Growth Trend ===== */}
      <Card
        bordered={false}
        style={{
          marginTop: 24,
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <Title level={5} style={{ margin: '0 0 4px', fontWeight: 700 }}>
          Xu hướng tăng trưởng 30 ngày
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Số lượng người dùng mới và cây mới được trồng theo ngày
        </Text>
        <div style={{ marginTop: 20 }}>
          {buildLineData().length > 0 ? (
            <Line {...lineConfig} />
          ) : (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <Text type="secondary">Chưa có dữ liệu</Text>
            </div>
          )}
        </div>
      </Card>

      {/* ===== Charts Row: Pie + Column ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Pie: Plants by Category */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Title level={5} style={{ margin: '0 0 4px', fontWeight: 700 }}>
              <AppstoreOutlined style={{ marginRight: 8, color: '#0da487' }} />
              Phân loại cây trồng
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Cây trong vườn theo danh mục
            </Text>
            <div style={{ marginTop: 16 }}>
              {(analytics?.plantsByCategory || []).length > 0 ? (
                <Pie {...pieConfig} />
              ) : (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <Text type="secondary">Chưa có dữ liệu phân loại</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Column: Plants by Status */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Title level={5} style={{ margin: '0 0 4px', fontWeight: 700 }}>
              🌱 Trạng thái cây trồng
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Phân bổ trạng thái cây trong vườn
            </Text>
            <div style={{ marginTop: 16 }}>
              {(analytics?.plantsByStatus || []).length > 0 ? (
                <Column {...statusColumnConfig} />
              ) : (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <Text type="secondary">Chưa có dữ liệu trạng thái</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* ===== Charts Row: Care History + Stores ===== */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Column: Care by Type */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Title level={5} style={{ margin: '0 0 4px', fontWeight: 700 }}>
              <HeartOutlined style={{ marginRight: 8, color: '#f5576c' }} />
              Hoạt động chăm sóc
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Phân bổ các loại hoạt động chăm sóc cây
            </Text>
            <div style={{ marginTop: 16 }}>
              {(analytics?.careByType || []).length > 0 ? (
                <Column {...careColumnConfig} />
              ) : (
                <div style={{ textAlign: 'center', padding: 60 }}>
                  <Text type="secondary">Chưa có dữ liệu chăm sóc</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Recent Users */}
        <Col xs={24} lg={12}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              height: '100%',
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <Title level={5} style={{ margin: '0 0 4px', fontWeight: 700 }}>
              <UserOutlined style={{ marginRight: 8, color: '#667eea' }} />
              Người dùng mới nhất
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              5 người dùng đăng ký gần đây nhất
            </Text>
            <div style={{ marginTop: 16 }}>
              <Table
                columns={recentUserColumns}
                dataSource={analytics?.recentUsers || []}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{
                  emptyText: <Text type="secondary">Chưa có người dùng</Text>,
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* ===== Store Types (if data) ===== */}
      {(analytics?.storesByType || []).length > 0 && (
        <Card
          bordered={false}
          style={{
            marginTop: 24,
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <Title level={5} style={{ margin: '0 0 16px', fontWeight: 700 }}>
            <ShopOutlined style={{ marginRight: 8, color: '#fa709a' }} />
            Phân loại cửa hàng
          </Title>
          <Row gutter={24}>
            {analytics.storesByType.map((item, idx) => (
              <Col key={idx} xs={12} sm={8} md={6}>
                <Card
                  bordered={false}
                  style={{
                    borderRadius: 12,
                    background: idx === 0
                      ? 'linear-gradient(135deg, #e0f7fa, #b2ebf2)'
                      : 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
                    textAlign: 'center',
                  }}
                  styles={{ body: { padding: '20px 16px' } }}
                >
                  <Statistic
                    title={<Text style={{ fontWeight: 600, fontSize: 13 }}>{item.type}</Text>}
                    value={item.count}
                    valueStyle={{ fontSize: 28, fontWeight: 800 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
