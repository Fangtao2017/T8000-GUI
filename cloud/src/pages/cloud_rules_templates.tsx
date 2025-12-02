import React from 'react';
import { Typography, Card } from 'antd';

const CloudRulesTemplates: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Rule Templates</Typography.Title>
      <Card>
        <p>
          This page allows creating and managing templates for alarm and automation rules.
          Templates can be defined once and applied to multiple sites or devices.
          This ensures consistent logic application across the fleet.
        </p>
      </Card>
    </div>
  );
};

export default CloudRulesTemplates;
