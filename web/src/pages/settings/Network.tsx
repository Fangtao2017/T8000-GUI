import React from 'react';
import { Alert } from 'antd';

const SettingsNetwork: React.FC = () => {
  return (
    <Alert
      message="Network settings"
      description="Configure network parameters of the device (IP, gateway, DNS, etc.)."
      type="info"
      showIcon
    />
  );
};

export default SettingsNetwork;
