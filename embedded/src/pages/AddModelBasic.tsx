import React from 'react';
import { Form, Input, Row, Col, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Title, Text } = Typography;

interface AddModelBasicProps {
	form: FormInstance;
}

const AddModelBasic: React.FC<AddModelBasicProps> = () => {
	return (
		<div style={{ maxWidth: 800, margin: '0 auto' }}>
			<Title level={4}>Step 1: Basic Information</Title>
			<Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
				Define the core identity of the device model.
			</Text>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item
						label="Brand"
						name="brand"
						rules={[
							{ required: true, message: 'Please enter brand name' },
							{ max: 50, message: 'Brand name must be less than 50 characters' },
						]}
					>
						<Input placeholder="e.g., TMAS" size="large" />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label="Model Name"
						name="model"
						rules={[
							{ required: true, message: 'Please enter model name' },
							{ max: 50, message: 'Model name must be less than 50 characters' },
						]}
					>
						<Input placeholder="e.g., T-DIM-001" size="large" />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item
						label="Device Type"
						name="dev_type"
						rules={[
							{ required: true, message: 'Please enter device type' },
							{ max: 50, message: 'Device type must be less than 50 characters' },
						]}
					>
						<Input placeholder="e.g., dimmer" size="large" />
					</Form.Item>
				</Col>
			</Row>
		</div>
	);
};

export default AddModelBasic;
