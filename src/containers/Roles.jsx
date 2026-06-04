import { useState, useEffect } from 'react';
import {
  Typography, Card, Table, Button, Modal, Form,
  Input, Space, Popconfirm, message, Tag, Checkbox, Row, Col, Divider
} from 'antd';
import {
  SafetyCertificateOutlined, PlusOutlined, EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { apiGetRoles, apiCreateRole, apiUpdateRole, apiDeleteRole } from '../services/role';
import { apiGetPermissions } from '../services/permission';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await apiGetRoles();
      const data = res?.data?.data || res?.data || [];
      const rolesList = Array.isArray(data) ? data : (data.roles || data.rows || []);
      setRoles(rolesList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách chức vụ:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await apiGetPermissions();
      const data = res?.data?.data || res?.data || [];
      const permsList = Array.isArray(data) ? data : (data.permissions || data.rows || []);
      setPermissions(permsList);
    } catch (error) {
      console.error('Lỗi khi tải danh sách quyền:', error);
    }
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRole(record);
    const permissionIds = (record.permissions || record.Permissions || []).map(p => p.id);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      permissionIds: permissionIds,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteRole(id);
      message.success('Xóa chức vụ thành công!');
      fetchRoles();
    } catch (error) {
      console.error('Lỗi khi xóa chức vụ:', error);
    }
  };

  const handleFinish = async (values) => {
    setSubmitting(true);
    try {
      if (editingRole) {
        await apiUpdateRole(editingRole.id, values);
        message.success('Cập nhật chức vụ thành công!');
      } else {
        await apiCreateRole(values);
        message.success('Thêm chức vụ thành công!');
      }
      setModalVisible(false);
      fetchRoles();
    } catch (error) {
      console.error('Lỗi khi lưu chức vụ:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        const isVIP = text?.toLowerCase().includes('admin');
        return <Tag color={isVIP ? 'volcano' : 'blue'} style={{ fontSize: 14, padding: '4px 8px' }}>{text}</Tag>;
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
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
      render: (_, record) => {
        const isAdmin = record.name?.toLowerCase().includes('admin');
        return (
          <Space size="middle">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
            {isAdmin ? (
               <Button disabled danger icon={<DeleteOutlined />} size="small" title="Không thể xóa Admin" />
            ) : (
              <Popconfirm
                title="Xóa chức vụ"
                description="Bạn có chắc chắn muốn xóa chức vụ này không?"
                onConfirm={() => handleDelete(record.id)}
                okText="Có, xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<DeleteOutlined />} size="small" />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  // Nhóm các quyền theo module (lấy từ trường resource)
  const groupPermissions = () => {
    const groups = {};
    permissions.forEach(perm => {
      // Trong model Permission có trường 'resource' và 'action'
      let moduleName = perm.resource || 'Khác';
      
      if (!groups[moduleName]) {
        groups[moduleName] = [];
      }
      groups[moduleName].push(perm);
    });
    return groups;
  };

  const groupedPermissions = groupPermissions();

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            <SafetyCertificateOutlined style={{ marginRight: 8 }} />
            Quản lý Chức vụ
          </Title>
          <Text type="secondary">Quản lý các vai trò và phân quyền trong hệ thống</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ borderRadius: 8, background: '#0da487', fontWeight: 600 }}
          onClick={handleAdd}
        >
          Thêm Chức vụ
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
        />
      </Card>

      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {editingRole ? 'Cập nhật Chức vụ' : 'Thêm Chức vụ mới'}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        centered
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          style={{ marginTop: 24 }}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={<Text strong>Tên chức vụ</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập tên chức vụ!' }]}
          >
            <Input placeholder="Ví dụ: Manager" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="description"
            label={<Text strong>Mô tả</Text>}
          >
            <TextArea placeholder="Mô tả quyền hạn của chức vụ này..." rows={3} style={{ borderRadius: 8 }} />
          </Form.Item>

          <Form.Item
            name="permissionIds"
            label={<Text strong>Phân quyền</Text>}
            style={{ marginBottom: 0 }}
          >
            <Checkbox.Group style={{ width: '100%' }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                {Object.keys(groupedPermissions).map((groupName, index) => (
                  <div key={index} style={{ marginBottom: 16 }}>
                    <Text strong style={{ color: '#0da487', textTransform: 'uppercase', fontSize: 13 }}>
                      Module: {groupName}
                    </Text>
                    <Divider style={{ margin: '8px 0' }} />
                    <Row gutter={[16, 16]}>
                      {groupedPermissions[groupName].map(perm => {
                        // Tạo label dễ đọc, ví dụ: 'read' -> 'Đọc', 'write' -> 'Ghi', 'delete' -> 'Xóa'
                        let actionLabel = perm.action;
                        if (actionLabel === 'read') actionLabel = 'Xem (Read)';
                        if (actionLabel === 'write') actionLabel = 'Thêm/Sửa (Write)';
                        if (actionLabel === 'delete') actionLabel = 'Xóa (Delete)';
                        
                        return (
                          <Col span={12} key={perm.id}>
                            <Checkbox value={perm.id}>
                              {actionLabel} ({perm.resource}:{perm.action})
                            </Checkbox>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} size="large" style={{ borderRadius: 8 }}>
                Hủy bỏ
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large" style={{ borderRadius: 8, background: '#0da487' }}>
                {editingRole ? 'Lưu thay đổi' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;
