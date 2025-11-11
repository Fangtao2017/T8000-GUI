import React from 'react';
import { Card, Typography } from 'antd';

const DeviceAdd: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={5}>Add Device</Typography.Title>
      <Typography.Paragraph>
        Placeholder for device creation form (basic info, parameters, mapping, model selection). 
      </Typography.Paragraph>
    </Card>
  );
};

export default DeviceAdd;
