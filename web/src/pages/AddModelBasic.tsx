import React from 'react';
import { Form, Input, Select, Space, Row, Col, Typography } from 'antd';
import type { FormInstance } from 'antd/es/form';

const { Title, Text } = Typography;

// Icon options
const iconOptions = [
	{ label: '📟 General', value: '📟' },
	{ label: '👁️ Eye', value: '👁️' },
	{ label: '💡 Light Bulb', value: '💡' },
	{ label: '❄️ Snowflake', value: '❄️' },
	{ label: '💧 Water Drop', value: '💧' },
	{ label: '⚡ Lightning', value: '⚡' },
	{ label: '🌡️ Thermometer', value: '🌡️' },
	{ label: '🔌 Plug', value: '🔌' },
	{ label: '🔥 Fire', value: '🔥' },
	{ label: '💨 Wind', value: '💨' },
	{ label: '🔧 Wrench', value: '🔧' },
	{ label: '🚰 Faucet', value: '🚰' },
	{ label: '👤 Person', value: '👤' },
	{ label: '🚪 Door', value: '🚪' },
	{ label: '💦 Splash', value: '💦' },
	{ label: '🔊 Speaker', value: '🔊' },
	{ label: '🪟 Window', value: '🪟' },
	{ label: '🔐 Lock', value: '🔐' },
	{ label: '🚨 Siren', value: '🚨' },
];

const interfaceOptions = [
	{ label: 'DI', value: 'DI' },
	{ label: 'DO', value: 'DO' },
	{ label: 'AI', value: 'AI' },
	{ label: 'AO', value: 'AO' },
	{ label: 'Modbus RTU', value: 'Modbus RTU' },
	{ label: 'Modbus TCP', value: 'Modbus TCP' },
];

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
				<Col span={12}>
					<Form.Item
						label="Hardware Interface"
						name="interface"
						rules={[
							{ required: true, message: 'Please select an interface' },
						]}
					>
						<Select
							size="large"
							placeholder="Select interface"
							options={interfaceOptions}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item
				label="Icon (Optional)"
				name="icon"
				extra="Choose an icon to represent this model in device selection"
			>
				<Select
					size="large"
					placeholder="Select an icon"
					options={iconOptions}
					optionRender={(option) => (
						<Space>
							<span style={{ fontSize: 18 }}>{option.data.value}</span>
							<span>{option.data.label.replace(/^.*\s/, '')}</span>
						</Space>
					)}
				/>
			</Form.Item>
		</div>
	);
};

export default AddModelBasic;
