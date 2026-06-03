import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Flex } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axiosInstance from '../utils/axios';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Nếu đã đăng nhập rồi thì redirect về dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Xử lý submit form
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/admin/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { data } = response.data;

      // Lưu token và user vào localStorage
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      message.success('Đăng nhập thành công!');
      navigate('/admin/dashboard');
    } catch (error) {
      // Error đã được xử lý bởi axios interceptor
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e8f5f1 0%, #ffffff 50%, #e0f2ec 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,164,135,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -120,
          left: -120,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13,164,135,0.06) 0%, transparent 70%)',
        }}
      />

      <Card
        bordered={false}
        style={{
          width: 440,
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
        styles={{
          body: { padding: 0 },
        }}
      >
        {/* Header với gradient */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0da487 0%, #0b9576 100%)',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 32,
              backdropFilter: 'blur(10px)',
            }}
          >
            🌱
          </div>
          <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 700 }}>
            Plant Notebook
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
            Hệ thống quản trị cây trồng
          </Text>
        </div>

        {/* Form Login */}
        <div style={{ padding: '32px 32px 40px' }}>
          <Title
            level={4}
            style={{
              textAlign: 'center',
              marginBottom: 28,
              color: '#333',
              fontWeight: 600,
            }}
          >
            Đăng nhập Admin
          </Title>

          <Form
            name="login"
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#0da487' }} />}
                placeholder="admin@example.com"
                style={{ borderRadius: 8, height: 48 }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>}
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#0da487' }} />}
                placeholder="••••••••"
                style={{ borderRadius: 8, height: 48 }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: 48,
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 16,
                  background: 'linear-gradient(135deg, #0da487, #0b9576)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(13,164,135,0.35)',
                }}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
