import React from 'react';
import { Alert } from 'antd';

const SettingsModbus: React.FC = () => {
  return (
    <Alert
      message="Modbus settings"
      description="Configure Modbus master/slave, serial/Ethernet parameters and register mapping."
      type="info"
      showIcon
    />
  );
};

export default SettingsModbus;
