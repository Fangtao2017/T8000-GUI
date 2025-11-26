import React from 'react';
import { Menu, ConfigProvider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  GlobalOutlined,
  FileTextOutlined,
  AlertOutlined,
} from '@ant-design/icons';

const CloudSecondaryNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define menu items for the "Home" section of Cloud Page
  const items = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Overview',
    },
    {
      key: '/map',
      icon: <GlobalOutlined />,
      label: 'Map',
    },
    {
      key: '/batch-log',
      icon: <FileTextOutlined />,
      label: 'Batch Log',
    },
    {
      key: '/alarm-status',
      icon: <AlertOutlined />,
      label: 'Alarm Status',
    },
  ];

  // Determine selected key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return ['/'];
    if (path.startsWith('/map')) return ['/map'];
    if (path.startsWith('/batch-log')) return ['/batch-log'];
    if (path.startsWith('/alarm-status')) return ['/alarm-status'];
    return ['/'];
  };

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Cloud Platform / Home / Overview';
    if (path.startsWith('/map')) return 'Cloud Platform / Home / Map';
    if (path.startsWith('/batch-log')) return 'Cloud Platform / Home / Batch Log';
    if (path.startsWith('/alarm-status')) return 'Cloud Platform / Home / Alarm Status';
    return 'Cloud Platform / Home / Overview';
  };

  return (
    <div style={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center',
        padding: '0 0',
        height: 48,
        position: 'relative'
      }}>
        {/* Left Section - Fixed Width to align with TopNav */}
        <div style={{ 
          width: 420, 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          flexShrink: 0,
          fontSize: 16, 
          fontWeight: 500, 
          color: '#001B34',
          boxSizing: 'border-box'
        }}>
          {getBreadcrumb()}
        </div>

        {/* Separator Line - Aligned with TopNav separator */}
        <div style={{ width: 1, height: 24, backgroundColor: '#001B34', marginRight: 16 }} />

        <ConfigProvider
          theme={{
            components: {
              Menu: {
                colorPrimary: '#001B34',
                itemSelectedColor: '#001B34',
                itemHoverColor: '#001B34',
              },
            },
          }}
        >
          <Menu
            mode="horizontal"
            selectedKeys={getSelectedKey()}
            items={items}
            onClick={({ key }) => navigate(key)}
            style={{ 
              borderBottom: 'none', 
              lineHeight: '46px',
              flex: 1,
              background: 'transparent',
              fontSize: 16,
              fontWeight: 500,
              marginLeft: 0
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default CloudSecondaryNav;
