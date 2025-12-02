import React from 'react';
import { Typography, Card } from 'antd';

const CloudDevicesGateways: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Gateways Management</Typography.Title>
      <Card>
        <p>
          This page manages the T8000 gateways connected to the cloud.
          It will list all gateways, their connection status, and firmware versions.
          Users can add new gateways, configure settings, and perform remote updates.
        </p>
      </Card>
    </div>
  );
};

export default CloudDevicesGateways;
