import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, Space, Typography, Divider, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CameraOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;

const Account: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  // 初始用户数据
  const initialValues = {
    username: 'Admin',
    email: 'admin@t8000.com',
    phone: '+1 234 567 8900',
    fullName: 'System Administrator',
    department: 'IT Operations',
  };

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Profile updated successfully');
      console.log('Updated profile:', values);
    } catch (error) {
      message.error('Update failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Password changed successfully');
      passwordForm.resetFields();
      console.log('Password changed', values);
    } catch (error) {
      message.error('Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG files');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB');
        return false;
      }
      
      // Preview image
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
        message.success('Avatar uploaded successfully');
      };
      
      return false; // Prevent auto upload
    },
  };

  const profileTab = (
    <div style={{ maxWidth: 600 }}>
      {/* Avatar section */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Avatar 
            size={120} 
            icon={<UserOutlined />}
            src={avatarUrl}
            style={{ 
              backgroundColor: '#003A70',
              border: '4px solid #f0f0f0'
            }} 
          />
          <Upload {...uploadProps}>
            <Button
              type="primary"
              shape="circle"
              icon={<CameraOutlined />}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
            />
          </Upload>
        </div>
        <div style={{ marginTop: 16 }}>
          <Title level={4} style={{ margin: 0 }}>{initialValues.username}</Title>
          <Text type="secondary">{initialValues.department}</Text>
        </div>
      </div>

      <Divider />

      {/* Profile form */}
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleProfileUpdate}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter username' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please enter full name' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
        >
          <Input prefix={<PhoneOutlined />} placeholder="Phone" size="large" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="department"
        >
          <Input placeholder="Department" size="large" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Save Changes
            </Button>
            <Button onClick={() => form.resetFields()} size="large">
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );

  const securityTab = (
    <div style={{ maxWidth: 600 }}>
      <Title level={5}>Change Password</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        For account security, we recommend changing your password regularly
      </Text>

      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordChange}
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter current password' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Current Password" size="large" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter new password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="New Password" size="large" />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" size="large" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              Change Password
            </Button>
            <Button onClick={() => passwordForm.resetFields()} size="large">
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );

  const tabItems = [
    {
      key: 'profile',
      label: 'Profile',
      children: profileTab,
    },
    {
      key: 'security',
      label: 'Security',
      children: securityTab,
    },
  ];

  return (
    <div style={{ padding: '0 8px' }}>
      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default Account;
