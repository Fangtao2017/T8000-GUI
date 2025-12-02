import React from 'react';
import { Typography, Card } from 'antd';

const CloudAdminNotifications: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Notification Policies</Typography.Title>
      <Card>
        <p>
          This page configures global notification rules and channels (Email, SMS, Webhook).
          It allows defining when and how users are notified of system events.
          Users can manage their own notification preferences within these policies.
        </p>
      </Card>
    </div>
  );
};

export default CloudAdminNotifications;
