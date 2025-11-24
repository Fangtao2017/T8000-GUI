import React, { useState } from 'react';
import { Flex, Typography, Dropdown, Avatar, Button } from 'antd';
import { 
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ControlOutlined,
  ApiOutlined,
  GlobalOutlined,
  DownOutlined,
  HomeOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { MenuProps } from 'antd';
import tcamLogo from '../assets/tcam-logo.png';

import NavMegaMenu from './NavMegaMenu';
import type { MenuSectionType } from './NavMegaMenu';

const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deviceId } = useParams<{ deviceId: string }>();
  const [activeMegaMenu, setActiveMegaMenu] = useState<MenuSectionType | null>(null);

  const getPath = (path: string) => {
    if (!deviceId) return path;
    return `/device/${deviceId}${path}`;
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      navigate(getPath('/account'));
    } else if (key === 'settings') {
      navigate(getPath('/settings'));
    } else if (key === 'logout') {
      // Handle logout logic
      console.log('Logout clicked');
      navigate('/'); // Go back to cloud dashboard on logout
    }
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    // Remove the /device/:deviceId prefix for matching
    const relativePath = deviceId ? path.replace(`/device/${deviceId}`, '') : path;
    const effectivePath = relativePath === '' ? '/' : relativePath;

    if (effectivePath === '/') return 'Overview';
    
    // Monitoring
    if (effectivePath.startsWith('/analysis')) return 'Monitoring / Analysis';
    if (effectivePath.startsWith('/log')) return 'Monitoring / Log';
    if (effectivePath.startsWith('/alarms')) return 'Monitoring / Alarms';
    if (effectivePath.startsWith('/rules')) return 'Monitoring / Rules';
    
    // Device Management
    if (effectivePath === '/devices/models') return 'Device Management / Model Setting';
    if (effectivePath === '/devices') return 'Device Management / Device Setting';
    if (effectivePath === '/devices/parameters') return 'Device Management / Parameter Setting';
    if (effectivePath === '/settings/modbus') return 'Device Management / Modbus Setting';
    if (effectivePath === '/configuration/add-model') return 'Device Management / Add Model';
    if (effectivePath === '/devices/add') return 'Device Management / Add Device';
    if (effectivePath === '/configuration/add-parameter') return 'Device Management / Supplement Add Parameter';
    
    // Logic Management
    if (effectivePath === '/configuration/add-rule') return 'Logic Management / Add Rule';
    if (effectivePath === '/configuration/add-alarm') return 'Logic Management / Add Alarm';
    
    // System Setting
    if (effectivePath === '/settings/network') return 'System Setting / Network Setting';
    if (effectivePath === '/settings/system') return 'System Setting / Firmware Settings';
    if (effectivePath === '/settings/mqtt') return 'System Setting / MQTT Setting';
    if (effectivePath.startsWith('/account')) return 'System Setting / Account Setting';
    
    return 'Overview';
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
      key: 'user-info',
      label: (
        <div style={{ padding: '4px 0', minWidth: 150 }}>
          <Typography.Text strong style={{ display: 'block', fontSize: 14 }}>Admin User</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>Administrator</Typography.Text>
        </div>
      ),
      disabled: true,
      style: { cursor: 'default', opacity: 1 }
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      label: 'Account Settings',
      icon: <SettingOutlined />
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />
    },
  ];

  // Determine selected key based on path
  const getSelectedKey = () => {
    const path = location.pathname;
    const relativePath = deviceId ? path.replace(`/device/${deviceId}`, '') : path;
    const effectivePath = relativePath === '' ? '/' : relativePath;

    // Home mapping
    if (effectivePath === '/' || effectivePath.startsWith('/analysis') || effectivePath.startsWith('/log') || effectivePath.startsWith('/monitor')) {
      return ['home'];
    }

    // Device Management
    if (effectivePath.startsWith('/devices') || effectivePath.startsWith('/settings/modbus') || effectivePath.startsWith('/configuration/add-model') || effectivePath.startsWith('/configuration/add-parameter')) {
      return ['device-management'];
    }
    
    // Logic Management
    if (effectivePath.startsWith('/alarms') || effectivePath.startsWith('/rules') || effectivePath.startsWith('/configuration/add-rule') || effectivePath.startsWith('/configuration/add-alarm')) {
      return ['logic-management'];
    }
    
    // System Configuration
    if (effectivePath.startsWith('/settings') || effectivePath.startsWith('/account')) {
      return ['communication-management'];
    }

    return [];
  };

  const activeKeys = getSelectedKey();

  const handleNavClick = (section: MenuSectionType, defaultPath: string) => {
    navigate(getPath(defaultPath));
    setActiveMegaMenu(section);
  };

  const renderNavItem = (key: string, label: string, icon: React.ReactNode, section?: MenuSectionType, path?: string) => {
    const isActive = activeKeys.includes(key);
    const color = isActive ? '#8CC63F' : '#ffffff';
    
    const content = (
      <div 
        style={{ 
          padding: '0 16px', 
          height: '64px', // Match navbar height
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          cursor: 'pointer',
          color: color,
          borderBottom: isActive ? '2px solid #8CC63F' : '2px solid transparent',
          transition: 'all 0.3s'
        }}
        onClick={() => {
          if (section && path) {
            handleNavClick(section, path);
          } else if (path) {
            navigate(getPath(path));
            setActiveMegaMenu(null);
          }
        }}
      >
        {icon}
        <span style={{ fontWeight: 500 }}>{label}</span>
      </div>
    );
  
    return <div key={key}>{content}</div>;
  };

  return (
    <>
      <style>
        {`
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

          {/* Toggle Button and Breadcrumb */}
          <Flex align="center" gap={16} style={{ paddingLeft: 0, marginRight: 24, minWidth: 400 }}>
            <Typography.Text style={{ fontSize: 16, color: '#ffffff', fontWeight: 400 }}>
              {getBreadcrumb()}
            </Typography.Text>
          </Flex>

          {/* Return to Cloud Button */}
          <Button 
            type="text" 
            icon={<CloudOutlined />} 
            style={{ color: '#ffffff', marginRight: 16 }}
            onClick={() => navigate('/')}
          >
            Return to Cloud
          </Button>

          {/* Separator Line */}
          <div style={{ width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 16 }} />

          {/* Main Navigation Menu */}
          <Flex style={{ flex: 1, height: '100%' }} align="center">
            {renderNavItem('home', 'Home', <HomeOutlined />, undefined, '/')}
            {renderNavItem('device-management', 'Connected Sensor', <SettingOutlined />, 'device-management', '/devices')}
            {renderNavItem('logic-management', 'Logic Configuration', <ControlOutlined />, 'logic-management', '/alarms')}
            {renderNavItem('communication-management', 'System Configuration', <ApiOutlined />, 'communication-management', '/settings/network')}
          </Flex>
        </Flex>
        
        {/* 右侧区域 */}
        <Flex align="center" justify="flex-end" gap={24} style={{ 
          padding: '0 24px',
          height: '100%',
          flexShrink: 0
        }}>
          {/* Language */}
          <Dropdown menu={{ items: languageMenu }} placement="bottomRight">
            <Flex align="center" gap={8} style={{ cursor: 'pointer', color: '#ffffff' }}>
              <GlobalOutlined />
              <span style={{ fontSize: 14 }}>English</span>
              <DownOutlined style={{ fontSize: 10 }} />
            </Flex>
          </Dropdown>

          {/* Support */}
          <Dropdown menu={{ items: supportMenu }} placement="bottomRight">
            <Flex align="center" gap={8} style={{ cursor: 'pointer', color: '#ffffff' }}>
              <span style={{ fontSize: 14 }}>Support</span>
              <DownOutlined style={{ fontSize: 10 }} />
            </Flex>
          </Dropdown>

          {/* Account */}
          <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
            <div style={{ cursor: 'pointer' }}>
              <Avatar size="default" icon={<UserOutlined />} style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
            </div>
          </Dropdown>
        </Flex>
      </Flex>

      {/* Mega Menu Overlay */}
      {activeMegaMenu && (
        <>
          {/* Backdrop to close on click outside */}
          <div 
            style={{ 
              position: 'fixed', 
              top: '64px', 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              zIndex: 998,
              animation: 'fadeIn 0.3s ease-out'
            }}
            onClick={() => setActiveMegaMenu(null)}
          />

          <div style={{ 
            position: 'absolute', 
            top: '64px', // Height of TopNav
            left: 0, 
            right: 0, 
            zIndex: 999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            animation: 'slideDown 0.3s ease-out',
            transformOrigin: 'top center'
          }}>
            <NavMegaMenu 
              section={activeMegaMenu} 
              deviceId={deviceId} 
              onNavigate={(p) => {
                navigate(p);
                setActiveMegaMenu(null);
              }}
              onClose={() => setActiveMegaMenu(null)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TopNav;
