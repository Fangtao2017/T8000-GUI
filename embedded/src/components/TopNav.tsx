import React, { useState, useEffect } from 'react';
import { Flex, Typography, Dropdown, Avatar, ConfigProvider, Tag } from 'antd';
import { 
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ControlOutlined,
  ApiOutlined,
  GlobalOutlined,
  DownOutlined,
  HomeOutlined,
  LineChartOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import tcamLogo from '../assets/tcam-logo.png';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { deviceId } = useParams<{ deviceId: string }>(); // Not needed in embedded
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const getPath = (path: string) => {
    return path;
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'account-details') {
      navigate(getPath('/account/details'));
    } else if (key === 'profile') {
      navigate(getPath('/account'));
    } else if (key === 'user-management') {
      navigate(getPath('/user-management'));
    } else if (key === 'settings') {
      navigate(getPath('/settings'));
    } else if (key === 'logout') {
      // Handle logout logic
      console.log('Logout clicked');
      localStorage.removeItem('currentUser');
      navigate('/login'); // Redirect to login instead of cloud
    }
  };

  const languageMenu: MenuProps['items'] = [
    { key: 'en', label: 'English' },
    { key: 'zh', label: '中文' }
  ];

  const supportMenu: MenuProps['items'] = [
    { key: 'docs', label: 'Documentation' },
    { key: 'support', label: 'Contact Support' }
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-header',
      label: (
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Avatar 
            size={48} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: '#003A70',
              flexShrink: 0,
              marginTop: 2
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography.Text strong style={{ fontSize: 16, lineHeight: 1.2, color: '#001B34' }}>
                {currentUser?.fullName || 'Guest'}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {currentUser?.companyName || 'TCAM Technology'}
              </Typography.Text>
            </div>
            
            <div>
              <Tag 
                color={currentUser?.role === 'admin' ? 'volcano' : 'blue'} 
                style={{ margin: 0, border: 'none', padding: '0 8px', fontSize: 11 }}
              >
                {currentUser?.role?.toUpperCase() || 'VISITOR'}
              </Tag>
            </div>
          </div>
        </div>
      ),
      disabled: true,
      style: { 
        cursor: 'default', 
        opacity: 1, 
        padding: '24px 24px 20px', 
        backgroundColor: '#fff'
      }
    },
    { type: 'divider', style: { margin: '4px 0' } },
    {
      key: 'account-details',
      label: 'Account Details',
      icon: <IdcardOutlined style={{ fontSize: 16, width: 16 }} />,
      style: { padding: '10px 24px', fontSize: 14 }
    },
    {
      key: 'profile',
      label: 'Security Settings',
      icon: <SafetyCertificateOutlined style={{ fontSize: 16, width: 16 }} />,
      style: { padding: '10px 24px', fontSize: 14 }
    },
    ...(currentUser?.role === 'admin' ? [
      {
        key: 'user-management',
        label: 'User Management',
        icon: <UserOutlined style={{ fontSize: 16, width: 16 }} />,
        style: { padding: '10px 24px', fontSize: 14 }
      }
    ] : []),
    { type: 'divider', style: { margin: '4px 0' } },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined style={{ fontSize: 16, width: 16 }} />,
      danger: true,
      style: { padding: '10px 24px', fontSize: 14 }
    },
  ];

  // Determine selected key based on path
  const getSelectedKey = () => {
    const path = location.pathname;
    const effectivePath = path === '' ? '/' : path;

    // Home mapping
    if (effectivePath === '/') {
      return ['home'];
    }

    // Report
    if (effectivePath.startsWith('/analysis') || effectivePath.startsWith('/log')) {
      return ['report'];
    }

    // Sensor Setting (was Device Management)
    if (effectivePath.startsWith('/devices') || effectivePath.startsWith('/settings/modbus') || effectivePath.startsWith('/configuration/add-model') || effectivePath.startsWith('/configuration/add-parameter') || effectivePath.startsWith('/alarms') || effectivePath.startsWith('/rules') || effectivePath.startsWith('/configuration/add-rule') || effectivePath.startsWith('/configuration/add-alarm')) {
      return ['sensor-setting'];
    }
    
    // Monitor & Control (was Logic Management)
    if (effectivePath.startsWith('/monitor') || effectivePath.startsWith('/realtime')) {
      return ['monitor-control'];
    }
    
    // System Configuration
    if (effectivePath.startsWith('/settings')) {
      return ['system-configuration'];
    }

    return [];
  };

  const activeKeys = getSelectedKey();
  const isAccountActive = location.pathname.startsWith('/account') || location.pathname.startsWith('/user-management');

  const renderNavItem = (key: string, label: string, icon: React.ReactNode, path: string) => {
    const isActive = activeKeys.includes(key);
    const color = isActive ? '#8CC63F' : '#ffffff';
    
    const content = (
      <div 
        className="nav-item"
        style={{ 
          padding: '0 16px', 
          height: '56px', // Match navbar height
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          cursor: 'pointer',
          color: color,
          borderBottom: isActive ? '2px solid #8CC63F' : '2px solid transparent',
          transition: 'all 0.3s'
        }}
        onClick={() => {
          navigate(getPath(path));
        }}
      >
        {icon}
        <span style={{ fontWeight: 500, fontSize: 16 }}>{label}</span>
      </div>
    );
  
    return <div key={key}>{content}</div>;
  };

  return (
    <>
      <style>
        {`
          .nav-item:hover {
            color: #8CC63F !important;
            background-color: rgba(255,255,255,0.05);
          }
          .dropdown-trigger {
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.3s;
          }
          .dropdown-trigger:hover {
            background-color: rgba(255,255,255,0.1);
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <Flex align="center" justify="space-between" style={{ 
        height: '100%', 
        backgroundColor: '#001B34',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 1000
      }}>
        <Flex align="center" style={{ flex: 1 }}>
          {/* Fixed Width Left Section for Alignment */}
          <Flex align="center" style={{ width: 420, height: '100%', flexShrink: 0 }}>
            {/* 左侧Logo区域 */}
            <Flex align="center" gap={12} style={{ 
              padding: '0 20px', 
              height: '100%',
              width: 220,
              minWidth: 220,
              transition: 'all 0.2s',
            }}>
              <img 
                src={tcamLogo} 
                alt="TCAM Logo" 
                style={{ 
                  height: 40,
                  width: 40,
                  objectFit: 'contain'
                }} 
              />
              <Typography.Title level={4} style={{ margin: 0, fontWeight: 500, color: '#ffffff' }}>
                T8000 System
              </Typography.Title>
            </Flex>

            {/* Return to Cloud Button - REMOVED for Embedded */}
          </Flex>

          {/* Separator Line */}
          <div style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 16 }} />

          {/* Main Navigation Menu */}
          <Flex style={{ flex: 1, height: '100%' }} align="center" justify="flex-start">
            {renderNavItem('home', 'Home', <HomeOutlined />, '/')}
            {renderNavItem('monitor-control', 'Monitor & Control', <ControlOutlined />, '/realtime')}
            {renderNavItem('sensor-setting', 'Configuration', <ApiOutlined />, '/devices')}
            {renderNavItem('report', 'Report', <LineChartOutlined />, '/analysis')}
            {renderNavItem('system-configuration', 'System', <SettingOutlined />, '/settings/system')}
          </Flex>
        </Flex>
        
        {/* 右侧区域 */}
        <Flex align="center" justify="flex-end" gap={24} style={{ 
          padding: '0 24px',
          height: '100%',
          flexShrink: 0
        }}>
          <ConfigProvider
            theme={{
              token: {
                colorBgElevated: '#001B34',
                colorText: '#ffffff',
              },
              components: {
                Menu: {
                  colorItemBg: '#001B34',
                  colorItemText: '#ffffff',
                  colorItemTextHover: '#ffffff',
                  colorItemBgHover: '#002B54',
                  colorItemBgSelected: '#002B54',
                  colorItemTextSelected: '#ffffff',
                }
              }
            }}
          >
            {/* Language */}
            <Dropdown 
              menu={{ items: languageMenu }} 
              placement="bottomRight"
              onOpenChange={setIsLanguageOpen}
            >
              <Flex align="center" gap={8} className="dropdown-trigger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                <GlobalOutlined />
                <span style={{ fontSize: 16, fontWeight: 500 }}>English</span>
                <DownOutlined style={{ fontSize: 10, transform: isLanguageOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </Flex>
            </Dropdown>

            {/* Support */}
            <Dropdown 
              menu={{ items: supportMenu }} 
              placement="bottomRight"
              onOpenChange={setIsSupportOpen}
            >
              <Flex align="center" gap={8} className="dropdown-trigger" style={{ cursor: 'pointer', color: '#ffffff' }}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>Support</span>
                <DownOutlined style={{ fontSize: 10, transform: isSupportOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </Flex>
            </Dropdown>
          </ConfigProvider>

          {/* Account */}
          <Dropdown 
            menu={{ items: userMenuItems, onClick: handleMenuClick }} 
            placement="bottomRight" 
            arrow
            overlayStyle={{ minWidth: 260 }}
            dropdownRender={(menu) => (
              <div style={{ 
                backgroundColor: '#fff', 
                borderRadius: 12, 
                boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
              }}>
                {React.cloneElement(menu as React.ReactElement<any>, { style: { boxShadow: 'none', borderRadius: 0 } })}
              </div>
            )}
          >
            <div style={{ cursor: 'pointer' }}>
              <Avatar 
                size="default" 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: isAccountActive ? '2px solid #8CC63F' : 'none',
                  boxSizing: 'border-box'
                }} 
              />
            </div>
          </Dropdown>
        </Flex>
      </Flex>
    </>
  );
};

export default TopNav;
