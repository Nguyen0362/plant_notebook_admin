import { Typography, Card } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Roles = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          <SafetyCertificateOutlined style={{ marginRight: 8 }} />
          Phân quyền
        </Title>
        <Text type="secondary">Quản lý vai trò và quyền hạn trong hệ thống</Text>
      </div>
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Text type="secondary">Chức năng đang được phát triển...</Text>
      </Card>
    </div>
  );
};

export default Roles;
