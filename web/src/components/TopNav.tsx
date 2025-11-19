import React from 'react';
import { Flex, Typography, Avatar, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import tcamLogo from '../assets/tcam-logo.png';

interface TopNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

const TopNav: React.FC<TopNavProps> = () => {
  const navigate = useNavigate();

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
      {/* 左侧Logo区域 */}
      <Flex align="center" gap={12} style={{ 
        padding: '0 20px', 
        height: '100%',
        minWidth: 220,
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
