import React from 'react';
import { Typography, Card } from 'antd';

const CloudRulesAlarmCenter: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Alarm Center</Typography.Title>
      <Card>
        <p>
          This page is the central hub for managing all system alarms.
          It provides tools for acknowledging, clearing, and analyzing alarm history.
          Users can set up alarm escalation policies and notification groups.
        </p>
      </Card>
    </div>
  );
};

export default CloudRulesAlarmCenter;
