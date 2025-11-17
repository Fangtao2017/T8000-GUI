import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const AddParameter: React.FC = () => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
			<Card bordered>
				<Title level={2}>Add Parameter</Title>
				<Paragraph type="secondary">
					This page is for adding new device parameters. Content will be designed later.
				</Paragraph>
			</Card>
		</div>
	);
};

export default AddParameter;
