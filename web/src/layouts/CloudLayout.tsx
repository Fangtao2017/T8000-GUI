import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import CloudSecondaryNav from '../components/CloudSecondaryNav';
import CloudTopNav from '../components/CloudTopNav';

const { Header, Content } = Layout;

const CloudLayout: React.FC = () => {
  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'auto', overflowY: 'hidden', minWidth: 1000 }}>
      <Header style={{ 
        padding: 0, 
        background: '#ffffff', 
        borderBottom: 'none',
        height: 'auto',
        lineHeight: 'normal',
        zIndex: 10,
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ height: 56, flex: '0 0 56px' }}>
          <CloudTopNav />
        </div>
        <CloudSecondaryNav />
      </Header>
      
      <Content style={{ 
        padding: '16px', 
        background: '#ffffff', 
        flex: '1 1 auto', 
        overflow: 'auto',
        position: 'relative'
      }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default CloudLayout;
