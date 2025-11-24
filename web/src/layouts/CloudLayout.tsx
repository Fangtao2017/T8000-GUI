import React, { useState } from 'react';
import { Layout, Flex, Typography, Avatar, Dropdown, Button } from 'antd';
import { 
  UserOutlined, 
  GlobalOutlined, 
  LogoutOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import tcamLogo from '../assets/tcam-logo.png';

const { Header, Content, Sider } = Layout;

const CloudLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
    },
  ];

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/map',
      icon: <GlobalOutlined />,
      label: 'Map View',
    },
    {
      key: '/tenants',
      icon: <AppstoreOutlined />,
      label: 'Tenants & Sites',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'User Management',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Platform Settings',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: '#001529', 
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <Flex align="center" gap={16} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={tcamLogo} alt="Logo" style={{ height: 32 }} />
          <Typography.Title level={4} style={{ margin: 0, color: '#fff', fontWeight: 500 }}>
            T8000 Cloud Platform
          </Typography.Title>
        </Flex>

        <Flex align="center" gap={24}>
          <Button type="text" icon={<GlobalOutlined />} style={{ color: '#fff' }}>
            Global Map
          </Button>
          
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)' }} />
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Flex align="center" gap={8} style={{ cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
              <div style={{ lineHeight: 1.2 }}>
                <Typography.Text style={{ color: '#fff', display: 'block' }}>Admin User</Typography.Text>
                <Typography.Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>National University of Singapore</Typography.Text>
              </div>
            </Flex>
          </Dropdown>
        </Flex>
      </Header>
      
      <Layout>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          width={220}
          style={{ background: '#001B34' }}
          trigger={null}
        >
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 8, 
            paddingTop: 16, 
            paddingBottom: 16,
            height: '100%',
            background: '#001B34',
            borderRight: '1px solid rgba(255,255,255,0.1)'
          }}>
            {menuItems.map((item) => {
              const active = location.pathname === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => {
                    if (item.key === '/') navigate('/');
                    // For demo purposes
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 12,
                    padding: collapsed ? '12px 0' : '12px 16px',
                    margin: '0 8px',
                    borderRadius: 4,
                    color: active ? '#8CC63F' : 'rgba(255,255,255,0.85)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: active ? 'rgba(140, 198, 63, 0.15)' : 'transparent',
                    position: 'relative',
                    fontSize: 14,
                    fontWeight: active ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                </div>
              );
            })}
          </div>
        </Sider>
        <Content style={{ background: '#f0f2f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CloudLayout;
