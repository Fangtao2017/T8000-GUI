import React from 'react';
import { Typography, Card } from 'antd';

const CloudHomeOverview: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Cloud Overview</Typography.Title>
      <Card>
        <p>
          This page provides a high-level dashboard of the entire cloud platform.
          It will display aggregated data from all sites and gateways, including total device counts,
          active alarms, and system health status.
          Future interactions will include map-based navigation and global status widgets.
        </p>
      </Card>
    </div>
  );
};

export default CloudHomeOverview;
