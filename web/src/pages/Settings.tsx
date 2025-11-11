import React from 'react';
import { Card, Typography } from 'antd';
import { Outlet } from 'react-router-dom';


const Settings: React.FC = () => {
	return (
			<Card>
				<Typography.Title level={4}>Settings</Typography.Title>
				<Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
					Select a specific option from the left menu.
				</Typography.Paragraph>
				{/* Child routes will render here */}
				<Outlet />
			</Card>
	);
};


export default Settings;