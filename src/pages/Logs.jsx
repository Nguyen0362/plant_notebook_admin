import { Typography, Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Logs = () => {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          <FileTextOutlined style={{ marginRight: 8 }} />
          Nhật ký hoạt động
        </Title>
        <Text type="secondary">Xem nhật ký các hoạt động trong hệ thống</Text>
      </div>
      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Text type="secondary">Chức năng đang được phát triển...</Text>
      </Card>
    </div>
  );
};

export default Logs;
