import React from 'react';
import { Typography, Card } from 'antd';

const CloudReportEnergy: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Energy Report</Typography.Title>
      <Card>
        <p>
          This page focuses on energy consumption and efficiency reports.
          It aggregates energy data to show usage patterns and identify potential savings.
          Standard energy KPIs and baselines will be visualized here.
        </p>
      </Card>
    </div>
  );
};

export default CloudReportEnergy;
