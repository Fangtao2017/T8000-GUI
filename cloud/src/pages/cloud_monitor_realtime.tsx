import React from 'react';
import { Typography, Card } from 'antd';

const CloudMonitorRealtime: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Sensor Monitoring</Typography.Title>
      <Card>
        <p>
          This page displays real-time data streams from selected devices or gateways.
          It will support multi-device charting and live status updates.
          Users will be able to select specific parameters to monitor in real-time.
        </p>
      </Card>
    </div>
  );
};

export default CloudMonitorRealtime;
