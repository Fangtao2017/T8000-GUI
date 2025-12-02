import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Table, Tag, Modal, Select, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockUsers } from '../data/mockData';

const { Title } = Typography;
const { Option } = Select;

const UserManagement: React.FC = () => {
  const [userForm] = Form.useForm();
  
  // User Management State
  const [users, setUsers] = useState(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // User Management Handlers
  const handleAddUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    setIsModalVisible(true);
  };

  const handleEditUser = (record: any) => {
    setEditingUser(record);
    userForm.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDeleteUser = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: () => {
        setUsers(users.filter(u => u.id !== id));
        message.success('User deleted successfully');
      },
    });
  };

  const handleUserModalOk = () => {
    userForm.validateFields().then(values => {
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
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'green';
        if (role === 'admin') color = 'volcano';
        if (role === 'operator') color = 'blue';
        return (
          <Tag color={color} key={role}>
            {role.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)}>Edit</Button>
          {record.username !== 'admin' && (
             <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteUser(record.id)}>Delete</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 1600, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>User Management</Title>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
              Add Account
              </Button>
          </div>
          <Table columns={columns} dataSource={users} rowKey="id" />
          
          <Modal
              title={editingUser ? "Edit User" : "Add User"}
              open={isModalVisible}
              onOk={handleUserModalOk}
              onCancel={() => setIsModalVisible(false)}
          >
              <Form form={userForm} layout="vertical">
              <Form.Item name="fullName" label="Name" rules={[{ required: true }]}>
                  <Input />
              </Form.Item>
              <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                  <Input />
              </Form.Item>
              <Form.Item name="password" label="Password" rules={[{ required: !editingUser }]}>
                  <Input.Password />
              </Form.Item>
              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                  <Select>
                  <Option value="admin">Admin</Option>
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
