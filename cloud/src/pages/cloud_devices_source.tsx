import React from 'react';
import { Typography, Card } from 'antd';

const CloudDevicesSource: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Source Interface</Typography.Title>
      <Card>
        <p>
          This page configures the communication interfaces for data ingestion (e.g., Modbus, MQTT).
          It allows defining how data is mapped from the source to the cloud platform.
          Future features will include interface testing and debugging tools.
        </p>
      </Card>
    </div>
  );
};

export default CloudDevicesSource;
