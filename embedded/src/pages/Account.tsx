import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Divider, List } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';

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

  const passwordPolicy = [
    'At least 8 characters long',
    'Contains at least one uppercase letter',
    'Contains at least one number',
    'Contains at least one special character'
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#ffffff', padding: '24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: 12, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
          }}
          bodyStyle={{ padding: '32px 40px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 8, color: '#001B34' }}>Security Settings</Title>
            <Text type="secondary">Manage your password and account security preferences</Text>
          </div>

          <Divider style={{ margin: '24px 0 32px 0' }} />

          <div style={{ maxWidth: 440, margin: '0 auto' }}>
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handlePasswordChange}
              requiredMark={false}
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: 'Please enter current password' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                  placeholder="Enter current password" 
                  size="large" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 8, message: 'Password must be at least 8 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                  placeholder="Enter new password" 
                  size="large" 
                  style={{ borderRadius: 6 }}
                />
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
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                  placeholder="Confirm new password" 
                  size="large" 
                  style={{ borderRadius: 6 }}
                />
              </Form.Item>

              {/* Password Policy Section */}
              <div style={{ 
                backgroundColor: '#fafafa', 
                padding: '16px 20px', 
                borderRadius: 8, 
                marginBottom: 32,
                border: '1px solid #f0f0f0'
              }}>
                <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 12, color: '#595959', letterSpacing: '0.5px' }}>
                  PASSWORD REQUIREMENTS
                </Text>
                <List
                  size="small"
                  split={false}
                  dataSource={passwordPolicy}
                  renderItem={item => (
                    <List.Item style={{ padding: '2px 0', fontSize: 13, color: '#595959', border: 'none' }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 10, fontSize: 14 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </div>

              <Form.Item style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <Button size="large" onClick={() => passwordForm.resetFields()} style={{ borderRadius: 6 }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ borderRadius: 6 }}>
                    Change Password
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Account;
