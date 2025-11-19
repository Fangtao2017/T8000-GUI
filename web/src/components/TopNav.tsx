import React from 'react';
import { Flex, Typography, Avatar, Dropdown, Button } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import tcamLogo from '../assets/tcam-logo.png';

interface TopNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') {
      navigate('/account');
    } else if (key === 'settings') {
      navigate('/settings');
    } else if (key === 'logout') {
      // Handle logout logic
      console.log('Logout clicked');
    }
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Overview';
    
    // Monitoring
    if (path.startsWith('/analysis')) return 'Monitoring / Analysis';
    if (path.startsWith('/log')) return 'Monitoring / Log';
    if (path.startsWith('/alarms')) return 'Monitoring / Alarms';
    if (path.startsWith('/rules')) return 'Monitoring / Rules';
    
    // Device Management
    if (path === '/devices/models') return 'Device Management / Model Setting';
    if (path === '/devices') return 'Device Management / Device Setting';
    if (path === '/devices/parameters') return 'Device Management / Parameter Setting';
    if (path === '/settings/modbus') return 'Device Management / Modbus Setting';
    if (path === '/configuration/add-model') return 'Device Management / Add Model';
    if (path === '/devices/add') return 'Device Management / Add Device';
    if (path === '/configuration/add-parameter') return 'Device Management / Supplement Add Parameter';
    
    // Logic Management
    if (path === '/configuration/add-rule') return 'Logic Management / Add Rule';
    if (path === '/configuration/add-alarm') return 'Logic Management / Add Alarm';
    
    // Communication Management
    if (path === '/settings/network') return 'Communication Management / Network Setting';
    if (path === '/settings/system') return 'Communication Management / System Setting';
    if (path === '/settings/mqtt') return 'Communication Management / MQTT Setting';
    if (path.startsWith('/account')) return 'Communication Management / Account Setting';
    
    return 'Overview';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Account Settings',
    },
    {
      key: 'settings',
      label: 'System Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
    },
  ];

  return (
    <Flex align="center" justify="space-between" style={{ 
      height: '100%', 
      backgroundColor: '#001B34',
      borderBottom: '1px solid rgba(255,255,255,0.15)'
    }}>
      <Flex align="center">
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
        <Flex align="center" gap={16} style={{ paddingLeft: 0 }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            style={{
              fontSize: '16px',
              width: 32,
              height: 32,
              color: '#fff',
            }}
          />
          <Typography.Text style={{ fontSize: 16, color: '#ffffff', fontWeight: 400 }}>
            {getBreadcrumb()}
          </Typography.Text>
        </Flex>
      </Flex>
      
      {/* 右侧区域 */}
      <Flex align="center" justify="flex-end" gap={20} style={{ 
        padding: '0 24px',
        height: '100%',
        flex: 1
      }}>
        <Typography.Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>
          Developer Mode
        </Typography.Text>
        
        <div style={{ height: 24, width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        
        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
          <Flex align="center" gap={8} style={{ cursor: 'pointer' }}>
            <Typography.Text style={{ fontSize: 14, color: '#ffffff', fontWeight: 500 }}>
              Admin
            </Typography.Text>
            <Avatar 
              size={32} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#003A70',
                border: '2px solid rgba(255,255,255,0.2)'
              }} 
            />
          </Flex>
        </Dropdown>
      </Flex>
    </Flex>
  );
};

export default TopNav;
