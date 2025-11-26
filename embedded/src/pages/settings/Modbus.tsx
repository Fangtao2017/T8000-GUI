import React from 'react';
import { Card, Typography, Alert } from 'antd';

const { Title } = Typography;

const SettingsModbus: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Alert
        message="Under Development"
        description="This page is currently under development. Features may be incomplete or subject to change."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />
      <Card>
        <Title level={2} style={{ marginTop: 0 }}>Modbus Settings</Title>
        <Alert
          message="Configure Modbus master/slave, serial/Ethernet parameters and register mapping."
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};

export default SettingsModbus;
