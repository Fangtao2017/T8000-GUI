import React from 'react';
import { Typography, Card } from 'antd';

const CloudRulesMapping: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Local Rules Mapping</Typography.Title>
      <Card>
        <p>
          This page manages the mapping of cloud rules to local gateway execution.
          It ensures that critical rules can run locally on the gateway even if cloud connectivity is lost.
          Users can view synchronization status and resolve conflicts.
        </p>
      </Card>
    </div>
  );
};

export default CloudRulesMapping;
