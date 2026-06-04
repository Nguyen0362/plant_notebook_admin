import { useState, useEffect } from 'react';
import {
  Typography, Card, Avatar, Descriptions, Tag, Spin,
  Divider, Space, List
} from 'antd';
import {
  UserOutlined, MailOutlined, IdcardOutlined,
  SafetyCertificateOutlined, CalendarOutlined,
  KeyOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy thông tin user từ localStorage (đã lưu khi login)
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Text type="secondary">Không tìm thấy thông tin người dùng</Text>
      </div>
    );
  }

  const roleName = user.Role?.name || user.role || 'Chưa phân quyền';
  const permissions = user.Role?.permissions || [];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          <IdcardOutlined style={{ marginRight: 8, color: '#0da487' }} />
          Hồ sơ cá nhân
        </Title>
        <Text type="secondary">Thông tin tài khoản quản trị của bạn</Text>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Card avatar + tên */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            flex: '0 0 300px',
            textAlign: 'center',
          }}
          styles={{ body: { padding: '40px 24px' } }}
        >
          <Avatar
            size={100}
            style={{
              background: 'linear-gradient(135deg, #0da487, #009289)',
              fontSize: 40,
              marginBottom: 20,
              boxShadow: '0 8px 24px rgba(13,164,135,0.3)',
            }}
            icon={<UserOutlined />}
          />
          <Title level={4} style={{ margin: '0 0 4px', fontWeight: 700 }}>
            {user.fullName || 'Admin'}
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {user.email}
          </Text>
          <div style={{ marginTop: 16 }}>
            <Tag
              color={roleName.toLowerCase().includes('admin') ? 'volcano' : 'green'}
              style={{
                fontSize: 13,
                fontWeight: 600,
                padding: '4px 16px',
                borderRadius: 20,
              }}
            >
              {roleName}
            </Tag>
          </div>
        </Card>

        {/* Card thông tin chi tiết */}
        <Card
          bordered={false}
          style={{
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            flex: 1,
            minWidth: 400,
          }}
          styles={{ body: { padding: 32 } }}
        >
          <Title level={5} style={{ margin: '0 0 20px', fontWeight: 700 }}>
            Thông tin tài khoản
          </Title>

          <Descriptions
            column={1}
            labelStyle={{
              fontWeight: 600,
              color: '#555',
              width: 160,
              fontSize: 14,
            }}
            contentStyle={{ fontSize: 14 }}
          >
            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined style={{ color: '#0da487' }} />
                  <span>Họ và tên</span>
                </Space>
              }
            >
              {user.fullName || '—'}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined style={{ color: '#0da487' }} />
                  <span>Email</span>
                </Space>
              }
            >
              {user.email || '—'}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined style={{ color: '#0da487' }} />
                  <span>ID</span>
                </Space>
              }
            >
              <Text copyable style={{ fontSize: 13, fontFamily: 'monospace' }}>
                {user.id || '—'}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <SafetyCertificateOutlined style={{ color: '#0da487' }} />
                  <span>Chức vụ</span>
                </Space>
              }
            >
              <Tag
                color={roleName.toLowerCase().includes('admin') ? 'volcano' : 'green'}
                style={{ borderRadius: 6 }}
              >
                {roleName}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          {/* Danh sách Quyền */}
          {permissions.length > 0 && (
            <>
              <Divider style={{ margin: '20px 0' }} />
              <Title level={5} style={{ margin: '0 0 12px', fontWeight: 700 }}>
                <KeyOutlined style={{ marginRight: 8, color: '#0da487' }} />
                Quyền hạn ({permissions.length})
              </Title>
              <List
                size="small"
                dataSource={permissions}
                renderItem={(perm) => (
                  <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Space>
                      <Tag color="blue" style={{ borderRadius: 4, fontWeight: 600 }}>
                        {perm.action?.toUpperCase() || '—'}
                      </Tag>
                      <Text>{perm.resource || perm.name || '—'}</Text>
                    </Space>
                    {perm.description && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {perm.description}
                      </Text>
                    )}
                  </List.Item>
                )}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
