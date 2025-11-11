import React from 'react';
import { Card, Typography } from 'antd';

const DeviceRules: React.FC = () => {
  return (
    <Card>
      <Typography.Title level={5}>Rules & control</Typography.Title>
      <Typography.Paragraph>
        condition_parameter, condition_timer, timer, condition_entity_map, rule, controller_parameter, controller_timer, controller_entity_map, action, rule_action_map
      </Typography.Paragraph>
    </Card>
  );
};

export default DeviceRules;
