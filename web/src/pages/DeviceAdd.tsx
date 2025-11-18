import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Steps, Row, Col, Tag, Typography, Divider, message, Table } from 'antd';
import { PlusOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface DeviceTemplate {
	model: string;
	type: string;
	brand: string;
	parameters: string[];
	description: string;
	icon: string;
}

// 预定义的设备模板（内置 Model）
const deviceTemplates: Record<string, DeviceTemplate> = {
	'T-OXM-001': {
		model: 'T-OXM-001',
		type: 'occup_lux_snsr',
		brand: 'TUAS',
		parameters: ['occupancy', 'lux_level', 'temperature', 'battery_level'],
		description: 'Occupancy and light sensor',
		icon: '👁️'
	},
	'T-DIM-001': {
		model: 'T-DIM-001',
		type: 'dimmer',
		brand: 'TUAS',
		parameters: ['brightness', 'power_state', 'fade_rate', 'load_current'],
		description: 'Lighting dimmer control',
		icon: '💡'
	},
	'T-PM-001': {
		model: 'T-PM-001',
		type: 'aircon_panel',
		brand: 'TUAS',
		parameters: ['temperature', 'setpoint', 'fan_speed', 'mode', 'power_state'],
		description: 'Air conditioning control panel',
		icon: '❄️'
	},
	'T-IR-001': {
		model: 'T-IR-001',
		type: 'tank',
		brand: 'TUAS',
		parameters: ['level', 'volume', 'flow_rate', 'alarm_status'],
		description: 'Water tank level sensor',
		icon: '💧'
	},
	'T-SP-001': {
		model: 'T-SP-001',
		type: 'elec_meter',
		brand: 'TUAS',
		parameters: ['voltage', 'current', 'power', 'energy_total', 'frequency', 'pwr_factor'],
		description: 'Single phase electric meter',
		icon: '⚡'
	},
	'T-EMS-002': {
		model: 'T-EMS-002',
		type: '3p_ct_energy_mtr',
		brand: 'TUAS',
		parameters: ['voltage_l1', 'voltage_l2', 'voltage_l3', 'current_l1', 'current_l2', 'current_l3', 'power_total', 'energy_total'],
		description: '3-phase energy meter',
		icon: '⚡'
	},
	'T-TEM-001': {
		model: 'T-TEM-001',
		type: 'temp_snsr',
		brand: 'TUAS',
		parameters: ['temperature', 'humidity', 'dew_point'],
		description: 'Temperature and humidity sensor',
		icon: '🌡️'
	},
	'T-RELAY-001': {
		model: 'T-RELAY-001',
		type: 'relay_module',
		brand: 'TUAS',
		parameters: ['relay_state', 'trigger_mode', 'delay_time', 'fault_status'],
		description: 'Multi-channel relay module',
		icon: '🔌'
	},
	'T-SMOKE-001': {
		model: 'T-SMOKE-001',
		type: 'smoke_detector',
		brand: 'TUAS',
		parameters: ['smoke_level', 'alarm_state', 'battery_voltage', 'self_test'],
		description: 'Smoke and fire detector',
		icon: '🔥'
	},
	'T-CO2-001': {
		model: 'T-CO2-001',
		type: 'co2_sensor',
		brand: 'TUAS',
		parameters: ['co2_level', 'temperature', 'humidity', 'alarm_threshold'],
		description: 'Carbon dioxide sensor',
		icon: '💨'
	},
	'T-PRESS-001': {
		model: 'T-PRESS-001',
		type: 'pressure_sensor',
		brand: 'TUAS',
		parameters: ['pressure', 'temperature', 'max_pressure', 'min_pressure'],
		description: 'Industrial pressure sensor',
		icon: '🔧'
	},
	'T-VALVE-001': {
		model: 'T-VALVE-001',
		type: 'smart_valve',
		brand: 'TUAS',
		parameters: ['valve_position', 'flow_rate', 'control_mode', 'status'],
		description: 'Motorized control valve',
		icon: '🚰'
	},
	'T-PIR-001': {
		model: 'T-PIR-001',
		type: 'motion_sensor',
		brand: 'TUAS',
		parameters: ['motion_detected', 'sensitivity', 'detection_range', 'battery_level'],
		description: 'Passive infrared motion sensor',
		icon: '👤'
	},
	'T-DOOR-001': {
		model: 'T-DOOR-001',
		type: 'door_sensor',
		brand: 'TUAS',
		parameters: ['door_state', 'open_count', 'tamper_alert', 'battery_voltage'],
		description: 'Magnetic door/window sensor',
		icon: '🚪'
	},
	'T-LEAK-001': {
		model: 'T-LEAK-001',
		type: 'water_leak_sensor',
		brand: 'TUAS',
		parameters: ['leak_detected', 'water_present', 'alarm_state', 'battery_level'],
		description: 'Water leak detection sensor',
		icon: '💦'
	},
	'T-SOUND-001': {
		model: 'T-SOUND-001',
		type: 'sound_sensor',
		brand: 'TUAS',
		parameters: ['noise_level', 'peak_db', 'average_db', 'alarm_threshold'],
		description: 'Sound level monitoring sensor',
		icon: '🔊'
	},
	'T-BLIND-001': {
		model: 'T-BLIND-001',
		type: 'blind_controller',
		brand: 'TUAS',
		parameters: ['blind_position', 'tilt_angle', 'control_mode', 'motor_status'],
		description: 'Motorized blind/curtain controller',
		icon: '🪟'
	},
	'T-LOCK-001': {
		model: 'T-LOCK-001',
		type: 'smart_lock',
		brand: 'TUAS',
		parameters: ['lock_state', 'access_code', 'battery_level', 'unlock_history'],
		description: 'Electronic smart lock',
		icon: '🔐'
	},
	'T-SIREN-001': {
		model: 'T-SIREN-001',
		type: 'alarm_siren',
		brand: 'TUAS',
		parameters: ['siren_state', 'volume_level', 'pattern', 'battery_backup'],
		description: 'Alarm siren and strobe',
		icon: '🚨'
	}
};

const DeviceAdd: React.FC = () => {
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedModel, setSelectedModel] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [unlinkedParameters, setUnlinkedParameters] = useState<string[]>([]);

	// 获取选中模板的参数列表
	const selectedTemplate = selectedModel ? deviceTemplates[selectedModel] : null;

	const handleModelChange = (model: string) => {
		setSelectedModel(model);
		setUnlinkedParameters([]); // Reset unlinked parameters when model changes
		const template = deviceTemplates[model];
		form.setFieldsValue({
			type: template.type,
			brand: template.brand,
		});
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			// 模拟 API 调用
			console.log('Creating device with auto-linked parameters:', {
				...values,
				parameters: selectedTemplate?.parameters,
			});

			// TODO: 实际 API 调用
			// 1. POST /api/devices - 创建设备
			// 2. 自动创建参数并链接 (后端自动处理)
			
			await new Promise(resolve => setTimeout(resolve, 1500));

			message.success('Device added successfully! Parameters auto-linked.');
			setCurrentStep(2);
			form.resetFields();
			setSelectedModel('');
			
			setTimeout(() => setCurrentStep(0), 3000);
		} catch (error) {
			console.error('Validation failed:', error);
		} finally {
			setLoading(false);
		}
	};

	const toggleParameterLink = (parameterName: string) => {
		setUnlinkedParameters(prev => {
			if (prev.includes(parameterName)) {
				// Re-link the parameter
				return prev.filter(p => p !== parameterName);
			} else {
				// Unlink the parameter
				return [...prev, parameterName];
			}
		});
	};

	const parameterColumns = [
		{
			title: 'Parameter Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Auto-configured',
			key: 'status',
			width: 150,
			render: (_: unknown, record: { name: string }) => {
				const isUnlinked = unlinkedParameters.includes(record.name);
				return isUnlinked ? (
					<Tag color="red">✗ Unlinked</Tag>
				) : (
					<Tag color="green">✓ Auto-linked</Tag>
				);
			},
		},
		{
			title: 'Action',
			key: 'action',
			width: 80,
			render: (_: unknown, record: { name: string }) => {
				const isUnlinked = unlinkedParameters.includes(record.name);
				return (
					<Button
						type="link"
						size="small"
						onClick={() => toggleParameterLink(record.name)}
						style={{ padding: 0, minWidth: 60, color: '#003A70' }}
					>
						{isUnlinked ? 'Re-link' : 'Unlink'}
					</Button>
				);
			},
		},
	];

	const steps = [
		{
			title: 'Select Model',
			icon: <InfoCircleOutlined />,
		},
		{
			title: 'Device Info',
			icon: <InfoCircleOutlined />,
		},
		{
			title: 'Complete',
			icon: <CheckCircleOutlined />,
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<PlusOutlined /> Add New Device
					</Title>
					<Paragraph type="secondary">
						Simplified device onboarding - Select a model, fill basic info, and we'll auto-configure all parameters and mappings for you.
					</Paragraph>

					<Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

				{currentStep === 0 && (
					<>
						<Title level={4}>Step 1: Select Device Model</Title>
						<Paragraph type="secondary">
							Choose from our built-in device templates. All parameters will be automatically configured.
						</Paragraph>

						<div style={{ 
							maxHeight: '500px', 
							overflow: 'auto', 
							marginTop: 24,
							border: '1px solid #f0f0f0',
							borderRadius: '8px',
							padding: '16px',
							background: '#fafafa'
						}}>
							<Space direction="vertical" size={8} style={{ width: '100%' }}>
								{Object.entries(deviceTemplates).map(([key, template]) => (
								<Card
									key={key}
									hoverable
									style={{
										border: selectedModel === key ? '2px solid #003A70' : '1px solid #d9d9d9',
										cursor: 'pointer',
									padding: '8px 16px',
								}}
								bodyStyle={{ padding: 0 }}
									onClick={() => {
										setSelectedModel(key);
										handleModelChange(key);
									}}
								>
								<Space size={12} align="center" style={{ width: '100%' }}>
									<div style={{ fontSize: 24, lineHeight: 1 }}>{template.icon}</div>
									<Text strong style={{ fontSize: 14, minWidth: 100 }}>
										{template.model}
									</Text>
									<Tag style={{ margin: 0, background: '#f0f0f0', border: '1px solid #d9d9d9', color: '#595959' }}>{template.type}</Tag>
									<Text type="secondary" style={{ fontSize: 13, flex: 1 }}>
										{template.description}
									</Text>
									<Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
										{template.parameters.length} parameters
									</Text>
								</Space>
								</Card>
							))}
							</Space>
						</div>

					<div style={{ marginTop: 24, textAlign: 'right' }}>
						<Button
							type="primary"
							size="large"
							disabled={!selectedModel}
							onClick={() => setCurrentStep(1)}
							style={selectedModel ? { backgroundColor: '#003A70', borderColor: '#003A70' } : {}}
						>
							Next: Configure Device
						</Button>
					</div>
					</>
				)}

				{currentStep === 1 && (
					<>
					<Button type="link" onClick={() => setCurrentStep(0)} style={{ padding: 0, marginBottom: 16, color: '#003A70' }}>
						← Back to Model Selection
					</Button>						<Row gutter={24}>
							<Col xs={24} md={14}>
								<Title level={4}>Step 2: Device Information</Title>
								<Form
									form={form}
									layout="vertical"
									initialValues={{
										model: selectedModel,
										type: selectedTemplate?.type,
										brand: selectedTemplate?.brand,
									}}
								>
									<Form.Item
										label="Device Name"
										name="name"
										rules={[{ required: true, message: 'Please enter device name' }]}
									>
										<Input placeholder="e.g., Gateway Main, Sensor A1" size="large" />
									</Form.Item>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item label="Model" name="model">
												<Input disabled size="large" />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item label="Type" name="type">
												<Input disabled size="large" />
											</Form.Item>
										</Col>
									</Row>

									<Form.Item
										label="Serial Number"
										name="serialNumber"
										rules={[{ required: true, message: 'Please enter serial number' }]}
									>
										<Input placeholder="e.g., 200310000092" size="large" />
									</Form.Item>

									<Form.Item
										label="Primary Address"
										name="priAddr"
										rules={[{ required: true, message: 'Please enter primary address' }]}
									>
										<Input placeholder="e.g., 1, 2, 3..." size="large" />
									</Form.Item>

									<Form.Item label="Location (Optional)" name="location">
										<Input placeholder="e.g., Floor 1 / Zone A" size="large" />
									</Form.Item>
								</Form>
							</Col>

							<Col xs={24} md={10}>
								<Card style={{ background: '#f5f5f5' }}>
									<Title level={5}>
										<InfoCircleOutlined /> Auto-Configuration Preview
									</Title>
									<Divider style={{ margin: '12px 0' }} />
									
								<Space direction="vertical" size="small" style={{ width: '100%' }}>
									<Text strong>Selected Model:</Text>
									<Tag style={{ fontSize: 14, background: '#f0f0f0', border: '1px solid #d9d9d9', color: '#595959' }}>
										{selectedTemplate?.icon} {selectedTemplate?.model}
									</Tag>

									<Divider style={{ margin: '12px 0' }} />										<Text strong>Parameters to be auto-linked:</Text>
										<div style={{ maxHeight: 200, overflow: 'auto' }}>
											<Table
												dataSource={selectedTemplate?.parameters.map((param, idx) => ({
													key: idx,
													name: param,
												}))}
												columns={parameterColumns}
												pagination={false}
												size="small"
											/>
										</div>

										<Divider style={{ margin: '12px 0' }} />

										<Text type="secondary" style={{ fontSize: 12 }}>
											💡 All parameters will be automatically created and mapped to your device.
										</Text>
									</Space>
								</Card>
							</Col>
						</Row>

						<div style={{ marginTop: 24, textAlign: 'right' }}>
							<Space>
								<Button size="large" onClick={() => setCurrentStep(0)}>
									Back
								</Button>
								<Button
									type="primary"
									size="large"
									loading={loading}
									onClick={handleSubmit} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>

									Create Device & Auto-Link Parameters
								</Button>
							</Space>
						</div>
					</>
				)}

				{currentStep === 2 && (
					<div style={{ textAlign: 'center', padding: '60px 0' }}>
						<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a', marginBottom: 24 }} />
						<Title level={3}>Device Added Successfully!</Title>
						<Paragraph type="secondary" style={{ fontSize: 16 }}>
						Your device has been created with all parameters automatically configured and linked.
					</Paragraph>
					<Space size="large" style={{ marginTop: 32 }}>
						<Button size="large" onClick={() => setCurrentStep(0)}>
							Add Another Device
						</Button>
						<Button type="primary" size="large" onClick={() => window.location.href = '/devices'} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
							View All Devices
						</Button>
					</Space>
				</div>
			)}
			</div>
		</div>
		</div>
	);
};export default DeviceAdd;





