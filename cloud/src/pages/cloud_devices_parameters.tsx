import React from 'react';
import { Typography, Card } from 'antd';

const CloudDevicesParameters: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Parameters Library</Typography.Title>
      <Card>
        <p>
          This page maintains a library of standard parameters used across devices.
          It ensures that parameter naming and definitions are consistent throughout the platform.
          Users can define new parameters and their properties here.
        </p>
      </Card>
    </div>
  );
};

export default CloudDevicesParameters;
