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
	'T8000': {
		model: 'T8000',
		type: 'gateway',
		brand: 'TCAM',
		parameters: [],
		description: 'Gateway',
		icon: '🌐'
	},
	'T-AOM-01': {
		model: 'T-AOM-01',
		type: 'module',
		brand: 'TCAM',
		parameters: ['dimmable_light_control'],
		description: 'Analog Output Module (dimmable light control)',
		icon: '🎛️'
	},
	'T-DIM-01': {
		model: 'T-DIM-01',
		type: 'dimmer',
		brand: 'TCAM',
		parameters: ['dimming_level'],
		description: 'Light Dimmer',
		icon: '💡'
	},
	'T-OCC-01': {
		model: 'T-OCC-01',
		type: 'sensor',
		brand: 'TCAM',
		parameters: ['occupancy', 'lux'],
		description: 'Occupancy-lux sensor',
		icon: '🚶'
	},
	'T-FM-01': {
		model: 'T-FM-01',
		type: 'meter',
		brand: 'TCAM',
		parameters: ['flow_rate'],
		description: 'Flow meter',
		icon: '💧'
	},
	'T-TK-01': {
		model: 'T-TK-01',
		type: 'tank',
		brand: 'TCAM',
		parameters: ['level'],
		description: 'Tank',
		icon: '🛢️'
	},
	'T-PP-01': {
		model: 'T-PP-01',
		type: 'pump',
		brand: 'TCAM',
		parameters: ['status'],
		description: 'Pump',
		icon: '⛽'
	},
	'T-TEM-01': {
		model: 'T-TEM-01',
		type: 'sensor',
		brand: 'TCAM',
		parameters: ['temperature'],
		description: 'Temperature sensor',
		icon: '🌡️'
	},
	'T-TEM-02': {
		model: 'T-TEM-02',
		type: 'sensor',
		brand: 'TCAM',
		parameters: ['temperature'],
		description: 'Temperature sensor',
		icon: '🌡️'
	},
	'T-EMS-01': {
		model: 'T-EMS-01',
		type: 'meter',
		brand: 'TCAM',
		parameters: ['voltage', 'current', 'power'],
		description: 'Single-phase Energy meter',
		icon: '⚡'
	},
	'T-EMS-02': {
		model: 'T-EMS-02',
		type: 'meter',
		brand: 'TCAM',
		parameters: ['voltage', 'current', 'power'],
		description: 'Three-phase CT Energy meter',
		icon: '⚡'
	},
	'T-EMS-03': {
		model: 'T-EMS-03',
		type: 'meter',
		brand: 'TCAM',
		parameters: ['voltage', 'current', 'power'],
		description: 'Three-phase Energy meter',
		icon: '⚡'
	},
	'T-ACP-01': {
		model: 'T-ACP-01',
		type: 'panel',
		brand: 'TCAM',
		parameters: ['status'],
		description: 'Aircon Panel (Existing Panel in Server/LAN room)',
		icon: '❄️'
	},
	'T-AIS-001': {
		model: 'T-AIS-001',
		type: 'interface',
		brand: 'TCAM',
		parameters: ['status'],
		description: 'Aircon Interface Card',
		icon: '🔌'
	},
	'T-FP-001': {
		model: 'T-FP-001',
		type: 'alarm',
		brand: 'TCAM',
		parameters: ['status'],
		description: 'Fire alarm',
		icon: '🔥'
	},
	'T-DIDO-01': {
		model: 'T-DIDO-01',
		type: 'module',
		brand: 'TCAM',
		parameters: ['input_status', 'output_control'],
		description: 'Digital Input/Output Module (non-dimmable light monitoring and control)',
		icon: '🔌'
	},
	'T-AIR-001': {
		model: 'T-AIR-001',
		type: 'module',
		brand: 'TCAM',
		parameters: ['ir_command'],
		description: 'Aircon Universal IR Module',
		icon: '📡'
	},
	'T-MIU-001': {
		model: 'T-MIU-001',
		type: 'interface',
		brand: 'TCAM',
		parameters: ['status'],
		description: 'Aircon Multi-Interface Unit',
		icon: '🔌'
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
			description: 'Choose device template',
			icon: <InfoCircleOutlined />,
		},
		{
			title: 'Device Info',
			description: 'Enter details',
			icon: <InfoCircleOutlined />,
		},
		{
			title: 'Complete',
			description: 'Finish',
			icon: <CheckCircleOutlined />,
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: currentStep === 0 ? 'hidden' : 'auto', padding: '24px' }}>
				<div style={{ 
					maxWidth: 1200, 
					margin: '0 auto',
					height: currentStep === 0 ? '100%' : 'auto',
					display: currentStep === 0 ? 'flex' : 'block',
					flexDirection: 'column'
				}}>
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
							flex: 1,
							overflow: 'auto', 
							marginTop: 24,
							border: '1px solid #f0f0f0',
							borderRadius: '8px',
							padding: '16px',
							background: '#fafafa',
							minHeight: 0
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

									<Form.Item label="Model" name="model">
										<Input disabled size="large" />
									</Form.Item>

									<Form.Item
										label="Serial Number"
										name="serialNumber"
										rules={[{ required: true, message: 'Please enter serial number' }]}
									>
										<Input placeholder="e.g., 200310000092" size="large" />
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





