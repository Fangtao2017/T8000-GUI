import React from 'react';
import { Alert } from 'antd';

const SettingsMqtt: React.FC = () => {
  return (
    <Alert
      message="MQTT configuration"
      description="setting_mqtt"
      type="info"
      showIcon
    />
  );
};

export default SettingsMqtt;
