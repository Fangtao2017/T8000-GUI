import React from 'react';
import { Typography, Card } from 'antd';

const CloudAdminTenant: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Tenant Settings</Typography.Title>
      <Card>
        <p>
          This page manages global settings for the tenant organization.
          It includes branding, default preferences, and subscription details.
          Admins can configure system-wide policies here.
        </p>
      </Card>
    </div>
  );
};

export default CloudAdminTenant;
