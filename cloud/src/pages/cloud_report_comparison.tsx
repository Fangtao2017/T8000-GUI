import React from 'react';
import { Typography, Card } from 'antd';

const CloudReportComparison: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Site Comparison</Typography.Title>
      <Card>
        <p>
          This page allows side-by-side comparison of different sites or assets.
          It helps in benchmarking performance and identifying underperforming units.
          Users can customize the metrics used for comparison.
        </p>
      </Card>
    </div>
  );
};

export default CloudReportComparison;
