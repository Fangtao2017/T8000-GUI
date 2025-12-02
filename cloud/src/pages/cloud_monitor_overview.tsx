import React from 'react';
import { Typography, Card } from 'antd';

const CloudMonitorOverview: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Monitor & Control Overview</Typography.Title>
      <Card>
        <p>
          This page gives a summary of monitoring activities across all sites.
          It will show key performance indicators (KPIs) and critical alerts requiring immediate attention.
          Future features will include customizable dashboards for different monitoring needs.
        </p>
      </Card>
    </div>
  );
};

export default CloudMonitorOverview;
