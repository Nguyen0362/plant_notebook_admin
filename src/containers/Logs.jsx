import { useState, useEffect, useCallback } from 'react';
import {
  Typography, Card, Table, Tag, Input, Select,
  Space, Empty, Tooltip
} from 'antd';
import {
  HistoryOutlined, SearchOutlined, ReloadOutlined,
  ClockCircleOutlined, UserOutlined, ApiOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { apiGetLogs } from '../services/log';

const { Title, Text } = Typography;

// Map màu cho từng HTTP method
const METHOD_TAG_CONFIG = {
  GET:    { color: 'blue',    label: 'GET' },
  POST:   { color: 'green',   label: 'POST' },
  PUT:    { color: 'orange',  label: 'PUT' },
  PATCH:  { color: 'gold',    label: 'PATCH' },
  DELETE: { color: 'volcano', label: 'DELETE' },
};

const Logs = () => {
  const [allLogs, setAllLogs] = useState([]); // Toàn bộ logs đã parse
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterMethod, setFilterMethod] = useState(null);

  // Parse 1 Winston JSON log line thành object hiển thị
  const parseLogEntry = (record, index) => {
    // Winston log line: { level, message (JSON string hoặc Morgan string), timestamp }
    let parsed = {};
    let isMorganLog = false;

    if (typeof record.message === 'string') {
      // Thử parse JSON (audit log từ audit.middleware)
      try {
        parsed = JSON.parse(record.message);
      } catch {
        // Nếu không phải JSON → có thể là Morgan HTTP access log
        // Format: "127.0.0.1 - - [date] \"GET /path HTTP/1.1\" 200 size ..."
        const morganMatch = record.message.match(
          /^[\d.:]+ - .+ "(\w+)\s+([^\s]+)\s+HTTP\/[\d.]+" (\d+)/
        );
        if (morganMatch) {
          isMorganLog = true;
          parsed = {
            method: morganMatch[1],   // GET, POST, PUT, DELETE
            endpoint: morganMatch[2], // /admin/users
            message: record.message,
          };
        }
      }
    }

    return {
      _key: `log-${index}`,
      user:      parsed.user     || record.user     || record.userId || (isMorganLog ? 'System' : '—'),
      method:    parsed.method   || record.method   || record.action || '—',
      endpoint:  parsed.endpoint || record.endpoint || record.resource || '—',
      detail:    parsed.message  || record.message   || '—',
      timestamp: record.timestamp || record.createdAt || null,
      level:     record.level    || 'info',
    };
  };

  // Fetch toàn bộ logs từ API (limit cao để lấy hết, backend đã sắp xếp mới nhất trước)
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGetLogs({ page: 1, limit: 500 });
      const result = res?.data?.data || {};
      const rawLogs = result.logs || [];
      // Parse tất cả logs một lần
      const parsed = rawLogs.map((log, idx) => parseLogEntry(log, idx));
      setAllLogs(parsed);
    } catch (error) {
      console.error('Lỗi khi tải nhật ký:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lọc client-side (search + filter method)
  const filteredLogs = allLogs.filter(item => {
    // Filter theo method
    if (filterMethod && item.method !== filterMethod) return false;
    // Search theo user, endpoint, detail
    if (searchText) {
      const keyword = searchText.toLowerCase();
      const haystack = `${item.user} ${item.endpoint} ${item.detail}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });

  // Cấu hình cột
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 65,
      align: 'center',
      render: (_text, _record, index) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {index + 1}
        </Text>
      ),
    },
    {
      title: (
        <Space size={4}>
          <ApiOutlined />
          <span>Hành động</span>
        </Space>
      ),
      key: 'method',
      dataIndex: 'method',
      width: 120,
      align: 'center',
      render: (method) => {
        const config = METHOD_TAG_CONFIG[method] || { color: 'default', label: method };
        return (
          <Tag
            color={config.color}
            style={{
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 0.5,
              borderRadius: 6,
              padding: '2px 10px',
            }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: (
        <Space size={4}>
          <UserOutlined />
          <span>Tài khoản</span>
        </Space>
      ),
      key: 'user',
      dataIndex: 'user',
      width: 220,
      ellipsis: true,
      render: (user) => (
        <Tooltip title={user}>
          <Text style={{ fontSize: 13 }}>{user}</Text>
        </Tooltip>
      ),
    },
    {
      title: (
        <Space size={4}>
          <InfoCircleOutlined />
          <span>Chi tiết</span>
        </Space>
      ),
      key: 'detail',
      ellipsis: true,
      render: (_text, record) => {
        const { endpoint, detail } = record;
        // Ưu tiên hiển thị message mô tả, fallback endpoint
        const displayText = detail !== '—' ? detail : endpoint;
        return (
          <Tooltip title={displayText}>
            <div>
              <Text style={{ fontSize: 13 }}>{displayText}</Text>
              {detail !== '—' && endpoint !== '—' && (
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>{endpoint}</Text>
                </div>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: (
        <Space size={4}>
          <ClockCircleOutlined />
          <span>Thời gian</span>
        </Space>
      ),
      key: 'timestamp',
      dataIndex: 'timestamp',
      width: 180,
      align: 'center',
      render: (timestamp) => {
        if (!timestamp) return <Text type="secondary">—</Text>;
        return (
          <Text style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
            {dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss')}
          </Text>
        );
      },
    },
  ];

  return (
    <div>
      {/* === Header === */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          <HistoryOutlined style={{ marginRight: 8, color: '#0da487' }} />
          Nhật ký hệ thống
        </Title>
        <Text type="secondary">Theo dõi các hoạt động quản trị trong hệ thống</Text>
      </div>

      {/* === Thanh filter / tìm kiếm === */}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          marginBottom: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <Space wrap size="middle" style={{ width: '100%' }}>
          <Input
            placeholder="Tìm kiếm theo user, endpoint..."
            prefix={<SearchOutlined style={{ color: '#0da487' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300, borderRadius: 8 }}
          />
          <Select
            placeholder="Lọc theo method"
            value={filterMethod}
            onChange={(value) => setFilterMethod(value)}
            allowClear
            style={{ width: 160, borderRadius: 8 }}
          >
            {Object.entries(METHOD_TAG_CONFIG).map(([method, cfg]) => (
              <Select.Option key={method} value={method}>
                <Tag color={cfg.color} style={{ borderRadius: 4, marginRight: 4 }}>
                  {cfg.label}
                </Tag>
              </Select.Option>
            ))}
          </Select>
          <Tooltip title="Tải lại">
            <ReloadOutlined
              onClick={() => fetchLogs()}
              style={{
                fontSize: 18,
                color: '#0da487',
                cursor: 'pointer',
                padding: 8,
                borderRadius: 8,
                transition: 'background 0.2s',
              }}
            />
          </Tooltip>
          {/* Tổng số bản ghi */}
          <Text type="secondary" style={{ fontSize: 13 }}>
            Tổng cộng: <Text strong>{filteredLogs.length}</Text> bản ghi
          </Text>
        </Space>
      </Card>

      {/* === Bảng Log === */}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="_key"
          loading={loading}
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 15,
            showSizeChanger: true,
            pageSizeOptions: ['15', '20', '50', '100'],
            showTotal: (total, range) => (
              <Text type="secondary" style={{ fontSize: 13 }}>
                Hiển thị {range[0]}-{range[1]} / {total} bản ghi
              </Text>
            ),
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text type="secondary">Chưa có nhật ký hoạt động nào</Text>
                }
              />
            ),
          }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Logs;
