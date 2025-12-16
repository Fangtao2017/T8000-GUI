import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Avatar, Row, Col, Space, Button } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  BankOutlined, 
  SafetyCertificateOutlined,
  IdcardOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface User {
  id: string;
  username: string;
  fullName: string;
  companyName?: string;
  role: string;
  lastLoginTime?: string;
  password?: string;
}

const AccountDetails: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const InfoItem = ({ label, value, icon }: { label: string, value: React.ReactNode, icon?: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <Text type="secondary" style={{ fontSize: 13, display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
        {label}
      </Text>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#1f1f1f', minHeight: 24, display: 'flex', alignItems: 'center' }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', backgroundColor: '#ffffff', padding: '24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: 12, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
          bodyStyle={{ padding: 0 }}
        >
          {/* Header Section */}
          <div style={{ 
            padding: '32px 40px', 
            background: 'linear-gradient(to right, #fff, #fcfcfc)',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: '#003A70',
                  boxShadow: '0 4px 12px rgba(0, 58, 112, 0.15)'
                }} 
              />
              <div>
                <Title level={3} style={{ margin: '0 0 4px 0', color: '#001B34' }}>
                  {currentUser.fullName}
                </Title>
                <Space size={16} align="center" style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    <BankOutlined style={{ marginRight: 6 }} />
                    {currentUser.companyName || 'TCAM Technology'}
                  </Text>
                  <Tag 
                    color={currentUser.role === 'admin' ? 'volcano' : 'blue'} 
                    style={{ margin: 0, border: 'none', padding: '0 10px' }}
                  >
                    {currentUser.role?.toUpperCase()}
                  </Tag>
                </Space>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, color: '#8c8c8c' }}>
                    <ClockCircleOutlined style={{ marginRight: 6 }} />
                    Last Login: {currentUser.lastLoginTime || 'N/A'}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ padding: '40px' }}>
            <Row gutter={64}>
              {/* Left Column: Profile Information */}
              <Col span={12}>
                <Title level={5} style={{ marginBottom: 24, color: '#003A70', fontSize: 16 }}>
                  Profile Information
                </Title>
                
                <InfoItem 
                  label="Full Name" 
                  value={currentUser.fullName}
                  icon={<IdcardOutlined />}
                />
                
                <InfoItem 
                  label="Company / Organization" 
                  value={currentUser.companyName || 'TCAM Technology'}
                  icon={<BankOutlined />}
                />
                
                <InfoItem 
                  label="System Role" 
                  value={
                    <Space>
                      <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
                      <span>{currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}</span>
                      <Tag style={{ marginLeft: 8 }}>{currentUser.role?.toUpperCase()}</Tag>
                    </Space>
                  }
                />
              </Col>

              {/* Right Column: Account & Security */}
              <Col span={12}>
                <Title level={5} style={{ marginBottom: 24, color: '#003A70', fontSize: 16 }}>
                  Account & Security
                </Title>

                <InfoItem 
                  label="Account Username" 
                  value={currentUser.username}
                  icon={<UserOutlined />}
                />

                <InfoItem 
                  label="Account Password" 
                  value={
                    <Space>
                      <span style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 2 }}>
                        {showPassword ? (currentUser.password || 'password123') : '••••••••'}
                      </span>
                      <Button 
                        type="text" 
                        icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
                        onClick={() => setShowPassword(!showPassword)}
                        size="small"
                        style={{ color: '#8c8c8c' }}
                      />
                    </Space>
                  }
                  icon={<LockOutlined />}
                />

                <div style={{ marginTop: 32 }}>
                  <Button 
                    onClick={() => navigate('/account')}
                    style={{ paddingLeft: 0, color: '#1890ff' }} 
                    type="link"
                  >
                    Change Password →
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountDetails;
