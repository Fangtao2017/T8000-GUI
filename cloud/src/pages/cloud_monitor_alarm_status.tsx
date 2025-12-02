import React from 'react';
import { Typography, Card } from 'antd';

const CloudMonitorAlarmStatus: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Alarm & Status</Typography.Title>
      <Card>
        <p>
          This page shows the current status of all active alarms and device states.
          It will allow filtering by severity, site, or device type.
          Future interactions include acknowledging alarms and viewing detailed alarm history.
        </p>
      </Card>
    </div>
  );
};

export default CloudMonitorAlarmStatus;
