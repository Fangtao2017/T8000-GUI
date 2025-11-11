import React from 'react';
import { Button, Flex, Typography } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

interface TopNavProps {
  collapsed: boolean;
  onToggle: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ collapsed, onToggle }) => {
  return (
    <Flex align="center" justify="space-between" style={{ padding: '0 24px', height: '100%' }}>
      <Flex align="center" gap={16}>
        <Button
          type="text"
          aria-label="Toggle Sidebar"
          onClick={onToggle}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          style={{ fontSize: 18 }}
        />
        <Typography.Title level={4} style={{ margin: 0, fontWeight: 500 }}>
          T8000 Embedded Web
        </Typography.Title>
      </Flex>
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
        Developer Mode
      </Typography.Text>
    </Flex>
  );
};

export default TopNav;