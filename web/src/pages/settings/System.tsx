import React from 'react';
import { Alert } from 'antd';

const SettingsSystem: React.FC = () => {
  return (
    <Alert
      message="System settings"
      description="setting_general, setting_log_limit, FWU"
      type="info"
      showIcon
    />
  );
};

export default SettingsSystem;
