import React from 'react';
import { Typography, Card } from 'antd';

const CloudReportTrends: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Trends Analysis</Typography.Title>
      <Card>
        <p>
          This page provides tools for analyzing historical data trends.
          Users can select parameters and time ranges to visualize performance over time.
          It supports comparing trends across different devices or sites.
        </p>
      </Card>
    </div>
  );
};

export default CloudReportTrends;
