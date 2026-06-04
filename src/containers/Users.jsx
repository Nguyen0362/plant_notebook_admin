import { useState, useEffect } from 'react';
import {
  Typography, Card, Table, Button, Modal, Form,
  Input, Select, Space, Popconfirm, message, Tag
} from 'antd';
import {
  UserOutlined, PlusOutlined, EditOutlined,
  DeleteOutlined, LockOutlined, MailOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { apiGetUsers, apiCreateUser, apiUpdateUser, apiDeleteUser } from '../services/user';
import { apiGetRoles } from '../services/role';

const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Load danh sách users và roles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiGetUsers();
      // Assume API trả về format chuẩn { err: 0, data: [...] }
      const data = res?.data?.data || res?.data || [];
      const usersList = Array.isArray(data) ? data : (data.users || data.rows || []);
      setUsers(usersList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await apiGetRoles();
      const data = res?.data?.data || res?.data || [];
      const rolesList = Array.isArray(data) ? data : (data.roles || data.rows || []);
      setRoles(rolesList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách roles:', error);
    }
  };

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Mở modal sửa
  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      roleId: record.roleId,
      // Không set password khi edit
    });
    setModalVisible(true);
  };

  // Xử lý Xóa
  const handleDelete = async (id) => {
    try {
      await apiDeleteUser(id);
      message.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi xóa user:', error);
    }
  };

  // Xử lý Submit Form (Thêm/Sửa)
  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        // Cập nhật
        await apiUpdateUser(editingUser.id, {
          fullName: values.fullName,
          email: values.email,
          roleId: values.roleId
        });
        message.success('Cập nhật người dùng thành công!');
      } else {
        // Thêm mới
        await apiCreateUser(values);
        message.success('Thêm người dùng thành công!');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi lưu user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Cột cho Table
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      ellipsis: true,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId, record) => {
        const roleName = record.Role?.name || roles.find(r => r.id === roleId)?.name || 'Chưa phân quyền';

        // Check màu theo tên: có chữ "admin" thì cho màu đỏ/cam cảnh báo, còn lại màu xanh
        const isVIP = roleName.toLowerCase().includes('admin');

        return <Tag color={isVIP ? 'volcano' : 'green'}>{roleName}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có, xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];


  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            <UserOutlined style={{ marginRight: 8 }} />
            Quản lý Người dùng
          </Title>
          <Text type="secondary">Quản lý danh sách người dùng trong hệ thống</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ borderRadius: 8, background: '#0da487', fontWeight: 600 }}
          onClick={handleAdd}
        >
          Thêm User
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
        />
      </Card>

      {/* Modal Form Thêm/Sửa */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {editingUser ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới'}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 24 }}
          requiredMark={false}
        >
          <Form.Item
            name="fullName"
            label={<Text strong>Họ và tên</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#0da487' }} />} placeholder="Ví dụ: Nguyễn Văn A" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: '#0da487' }} />} placeholder="admin@example.com" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label={<Text strong>Mật khẩu</Text>}
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined style={{ color: '#0da487' }} />} placeholder="••••••••" size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
          )}

          <Form.Item
            name="roleId"
            label={<Text strong>Chức vụ</Text>}
            rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
          >
            <Select placeholder="Chọn chức vụ" size="large" style={{ borderRadius: 8 }}>
              {roles.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} size="large" style={{ borderRadius: 8 }}>
                Hủy bỏ
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large" style={{ borderRadius: 8, background: '#0da487' }}>
                {editingUser ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
