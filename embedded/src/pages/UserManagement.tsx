import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Table, Tag, Modal, Select, Space, Dropdown, Row, Col } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined, 
  SearchOutlined,
  ExclamationCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { mockUsers } from '../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const UserManagement: React.FC = () => {
  const [userForm] = Form.useForm();
  
  // User Management State
  const [users, setUsers] = useState(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  // User Management Handlers
  const handleAddUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    userForm.setFieldsValue({ companyName: 'TCAM Technology' });
    setIsModalVisible(true);
  };

  const handleEditUser = (record: any) => {
    setEditingUser(record);
    userForm.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (id: string) => {
    confirm({
      title: 'Delete User',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: 'Are you sure you want to permanently delete this user? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        setUsers(users.filter(u => u.id !== id));
        message.success('User deleted successfully');
      },
    });
  };

  const handleSaveConfirmation = () => {
    userForm.validateFields().then(values => {
      confirm({
        title: editingUser ? 'Save Changes' : 'Create User',
        icon: <ExclamationCircleOutlined style={{ color: '#1890ff' }} />,
        content: editingUser ? 'Are you sure you want to save changes to this user?' : 'Are you sure you want to create this new user?',
        okText: 'Save',
        cancelText: 'Cancel',
        onOk: () => {
          handleUserModalOk(values);
        },
      });
    });
  };

  const handleUserModalOk = (values: any) => {
    if (editingUser) {
      // Edit
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...values } : u));
      message.success('User updated successfully');
    } else {
      // Add
      const newUser = {
        ...values,
        id: `user-${Date.now()}`,
        permissions: values.role === 'admin' ? ['all'] : (values.role === 'operator' ? ['read', 'control'] : ['read'])
      };
      setUsers([...users, newUser]);
      message.success('User added successfully');
    }
    setIsModalVisible(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) || 
      user.username.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: '#bfbfbf' }} />
          <Text strong style={{ color: '#262626' }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role: string) => {
        let color = 'green';
        if (role === 'admin') color = 'volcano';
        if (role === 'operator') color = 'blue';
        return (
          <Tag 
            color={color} 
            key={role} 
            style={{ 
              width: 80, 
              textAlign: 'center', 
              margin: 0,
              fontWeight: 500
            }}
          >
            {role.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Edit User',
            icon: <EditOutlined />,
            onClick: () => handleEditUser(record),
          },
          ...(record.username !== 'admin' ? [{
            key: 'delete',
            label: 'Delete User',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDeleteUser(record.id),
          }] : []),
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#ffffff', padding: '24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: 8, 
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)' 
          }}
          bodyStyle={{ padding: '24px 32px' }}
        >
          {/* Header Section */}
          <div style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col>
                <Title level={4} style={{ margin: '0 0 4px 0', color: '#001B34' }}>User Management</Title>
                <Text type="secondary">Manage all users, roles and permissions.</Text>
              </Col>
              <Col>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser} size="large">
                  Add Account
                </Button>
              </Col>
            </Row>
            
            <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Input 
                placeholder="Search by name or username" 
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                style={{ width: 320 }}
                size="large"
                allowClear
                onChange={e => setSearchText(e.target.value)}
              />
              <Select
                placeholder="Filter by Role"
                style={{ width: 180 }}
                size="large"
                allowClear
                onChange={setRoleFilter}
              >
                <Option value="admin">Admin</Option>
                <Option value="operator">Operator</Option>
                <Option value="readonly">Read Only</Option>
              </Select>
            </div>
          </div>

          <Table 
            columns={columns} 
            dataSource={filteredUsers} 
            rowKey="id" 
            pagination={{ 
              pageSize: 10,
              showTotal: (total) => `Total ${total} users`,
              showSizeChanger: false
            }}
          />
          
          <Modal
              title={editingUser ? "Edit User" : "Add User"}
              open={isModalVisible}
              onOk={handleSaveConfirmation}
              onCancel={() => setIsModalVisible(false)}
              okText="Save"
              cancelText="Cancel"
              centered
              width={480}
          >
              <Form form={userForm} layout="vertical" style={{ marginTop: 24 }}>
              <Form.Item name="fullName" label="User Name" rules={[{ required: true }]}>
                  <Input size="large" />
              </Form.Item>
              <Form.Item name="username" label="Account" rules={[{ required: true }]}>
                  <Input size="large" />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: !editingUser }]}>
                  <Input.Password size="large" placeholder={editingUser ? "Leave blank to keep current" : ""} />
              </Form.Item>
              <Form.Item name="companyName" label="Company Name">
                  <Input disabled size="large" />
              </Form.Item>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                  <Select disabled={editingUser?.role === 'admin'} size="large">
                    {editingUser?.role === 'admin' && <Option value="admin">Admin</Option>}
                    <Option value="operator">Operator</Option>
                    <Option value="readonly">Read Only</Option>
                  </Select>
              </Form.Item>
              </Form>
          </Modal>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
