import React from 'react';
import { Menu, ConfigProvider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  GlobalOutlined,
  GatewayOutlined,
  DesktopOutlined,
  FileTextOutlined,
  LineChartOutlined,
  AlertOutlined,
  ControlOutlined,
  TeamOutlined,
  AuditOutlined,
  DashboardOutlined,
  SettingOutlined,
  BellOutlined,
  ClusterOutlined,
  FormOutlined,
  BlockOutlined
} from '@ant-design/icons';

const CloudSecondaryNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Determine current section
  let currentSection = 'home';
  if (path.startsWith('/monitor')) currentSection = 'monitor';
  else if (path.startsWith('/devices')) currentSection = 'devices';
  else if (path.startsWith('/rules')) currentSection = 'rules';
  else if (path.startsWith('/report')) currentSection = 'report';
  else if (path.startsWith('/admin')) currentSection = 'admin';

  const getMenuItems = () => {
    if (currentSection === 'home') {
      return [
        { key: '/home/overview', label: 'Overview', icon: <DashboardOutlined />, onClick: () => navigate('/home/overview') },
      ];
    }
    if (currentSection === 'monitor') {
      return [
        { key: '/monitor/overview', label: 'Overview', icon: <DashboardOutlined />, onClick: () => navigate('/monitor/overview') },
        { key: '/monitor/realtime', label: 'Sensor Monitoring', icon: <LineChartOutlined />, onClick: () => navigate('/monitor/realtime') },
        { key: '/monitor/alarm-status', label: 'Alarm & Status', icon: <AlertOutlined />, onClick: () => navigate('/monitor/alarm-status') },
      ];
    }
    if (currentSection === 'devices') {
      return [
        { key: '/devices/gateways', label: 'Gateways', icon: <GatewayOutlined />, onClick: () => navigate('/devices/gateways') },
        { key: '/devices/inventory', label: 'Device Inventory', icon: <DesktopOutlined />, onClick: () => navigate('/devices/inventory') },
        { key: '/devices/models', label: 'Models & Templates', icon: <BlockOutlined />, onClick: () => navigate('/devices/models') },
        { key: '/devices/parameters', label: 'Parameters Library', icon: <FormOutlined />, onClick: () => navigate('/devices/parameters') },
        { key: '/devices/source', label: 'Source Interface', icon: <ClusterOutlined />, onClick: () => navigate('/devices/source') },
      ];
    }
    if (currentSection === 'rules') {
      return [
        { key: '/rules/alarm-center', label: 'Alarm Center', icon: <BellOutlined />, onClick: () => navigate('/rules/alarm-center') },
        { key: '/rules/templates', label: 'Rule Templates', icon: <FileTextOutlined />, onClick: () => navigate('/rules/templates') },
        { key: '/rules/mapping', label: 'Local Rules Mapping', icon: <ControlOutlined />, onClick: () => navigate('/rules/mapping') },
      ];
    }
    if (currentSection === 'report') {
      return [
        { key: '/report/trends', label: 'Trends', icon: <LineChartOutlined />, onClick: () => navigate('/report/trends') },
        { key: '/report/energy', label: 'Energy Report', icon: <GlobalOutlined />, onClick: () => navigate('/report/energy') },
        { key: '/report/comparison', label: 'Site Comparison', icon: <AppstoreOutlined />, onClick: () => navigate('/report/comparison') },
        { key: '/report/scheduled', label: 'Scheduled Reports', icon: <FileTextOutlined />, onClick: () => navigate('/report/scheduled') },
      ];
    }
    if (currentSection === 'admin') {
      return [
        { key: '/admin/tenant', label: 'Tenant Settings', icon: <SettingOutlined />, onClick: () => navigate('/admin/tenant') },
        { key: '/admin/users', label: 'Users & Roles', icon: <TeamOutlined />, onClick: () => navigate('/admin/users') },
        { key: '/admin/notifications', label: 'Notification Policies', icon: <BellOutlined />, onClick: () => navigate('/admin/notifications') },
        { key: '/admin/audit', label: 'Audit Logs', icon: <AuditOutlined />, onClick: () => navigate('/admin/audit') },
      ];
    }
    return [];
  };

  const getBreadcrumb = () => {
    // Simple breadcrumb logic for now
    const sectionName = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
    return `Cloud Platform / ${sectionName}`;
  };

  const items = getMenuItems();
  if (items.length === 0) return null;

  // Find active key
  const activeKey = items.find(item => path.startsWith(item.key))?.key || items[0]?.key;

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
            selectedKeys={[activeKey]}
            items={items}
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
