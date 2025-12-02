import React from 'react';
import { Typography, Card } from 'antd';

const CloudReportScheduled: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Scheduled Reports</Typography.Title>
      <Card>
        <p>
          This page manages the configuration of automated scheduled reports.
          Users can define report templates, schedules, and recipient lists.
          Generated reports can be emailed or stored for later download.
        </p>
      </Card>
    </div>
  );
};

export default CloudReportScheduled;
