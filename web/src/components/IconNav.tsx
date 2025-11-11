import React from 'react';
import { Flex, Tooltip } from 'antd';
import { HomeOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const IconNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current top-level section
  const section = (() => {
    const seg = location.pathname.split('/')[1];
    if (!seg) return 'home';
    if (['devices', 'settings'].includes(seg)) return seg;
    return 'home';
  })();

  const items = [
    { key: 'home', icon: <HomeOutlined />, label: 'Home', path: '/' },
    { key: 'devices', icon: <AppstoreOutlined />, label: 'Devices', path: '/devices' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', path: '/settings' },
  ];

  return (
    <Flex
      vertical
      align="center"
      gap={16}
      style={{
        width: 64,
        background: '#001529',
        paddingTop: 16,
        paddingBottom: 16,
        height: '100vh',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {items.map((item) => {
        const active = section === item.key;
        return (
          <Tooltip key={item.key} title={item.label} placement="right">
            <div
              onClick={() => navigate(item.path)}
              style={{
                fontSize: 24,
                color: active ? '#1677ff' : 'rgba(255,255,255,0.65)',
                cursor: 'pointer',
                padding: 8,
                borderRadius: 4,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: active ? 'rgba(22, 119, 255, 0.1)' : 'transparent',
                transform: active ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {item.icon}
            </div>
          </Tooltip>
        );
      })}
    </Flex>
  );
};

export default IconNav;
