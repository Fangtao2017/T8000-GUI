import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Account: React.FC = () => {
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 1600, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card>
          <div style={{ maxWidth: 600 }}>
            <Title level={4}>Change Password</Title>
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
        </Card>
      </div>
    </div>
  );
};

export default Account;
