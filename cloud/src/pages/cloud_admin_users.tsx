import React from 'react';
import { Typography, Card } from 'antd';

const CloudAdminUsers: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Users & Roles</Typography.Title>
      <Card>
        <p>
          This page handles user management and role-based access control (RBAC).
          Admins can invite users, assign roles, and define permission sets.
          It ensures secure access to platform resources.
        </p>
      </Card>
    </div>
  );
};

export default CloudAdminUsers;
