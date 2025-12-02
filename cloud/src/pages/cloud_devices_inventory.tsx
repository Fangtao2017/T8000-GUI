import React from 'react';
import { Typography, Card } from 'antd';

const CloudDevicesInventory: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Device Inventory</Typography.Title>
      <Card>
        <p>
          This page lists all sensors and devices connected through the gateways.
          It provides a comprehensive inventory with search and filter capabilities.
          Users can view device details, assign them to sites, and manage their lifecycle.
        </p>
      </Card>
    </div>
  );
};

export default CloudDevicesInventory;
