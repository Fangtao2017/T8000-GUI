import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Row, Col, Typography, message, Select, Divider } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Icon options from DeviceAdd
const iconOptions = [
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

const AddModel: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);

			// 模拟 API 调用
			console.log('Creating model:', values);

			// TODO: 实际 API 调用
			// POST /api/models - 创建模型
			
			await new Promise(resolve => setTimeout(resolve, 1000));

			message.success('Model added successfully!');
			form.resetFields();
		} catch (error) {
			console.error('Validation failed:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		form.resetFields();
	};

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<PlusOutlined /> Add Model
					</Title>
					<Paragraph type="secondary">
						Create a new device model template with basic configuration
					</Paragraph>

					<Row gutter={24} style={{ marginTop: 32 }}>
						<Col xs={24} md={14}>
							<Card bordered>
								<Form
									form={form}
									layout="vertical"
									initialValues={{
										icon: '💡',
									}}
								>
									<Form.Item
										label="Brand"
										name="brand"
										rules={[
											{ required: true, message: 'Please enter brand name' },
											{ max: 50, message: 'Brand name must be less than 50 characters' },
										]}
									>
										<Input 
											placeholder="e.g., TMAS" 
											size="large"
										/>
									</Form.Item>

									<Form.Item
										label="Model"
										name="model"
										rules={[
											{ required: true, message: 'Please enter model name' },
											{ max: 50, message: 'Model name must be less than 50 characters' },
										]}
									>
										<Input 
											placeholder="e.g., T8000, T-AOH-001, T-DIM-001" 
											size="large"
										/>
									</Form.Item>

									<Form.Item
										label="Device Type"
										name="dev_type"
										rules={[
											{ required: true, message: 'Please enter device type' },
											{ max: 50, message: 'Device type must be less than 50 characters' },
										]}
									>
										<Input 
											placeholder="e.g., gateway, analog_output, dimmer, temp_snsr" 
											size="large"
										/>
									</Form.Item>

									<Form.Item
										label="Interface"
										name="interface"
										rules={[
											{ required: true, message: 'Please enter interface number' },
											{ pattern: /^\d+$/, message: 'Please enter a valid number' },
										]}
									>
										<Input 
											placeholder="e.g., 1, 4, 16" 
											size="large"
											type="number"
										/>
									</Form.Item>

									<Divider />

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

									<div style={{ marginTop: 32, textAlign: 'right' }}>
										<Space>
											<Button size="large" onClick={handleReset}>
												Reset
											</Button>
										<Button
											type="primary"
											size="large"
											loading={loading}
											onClick={handleSubmit}
											style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
										>
											Create Model
										</Button>
										</Space>
									</div>
								</Form>
							</Card>
						</Col>

						<Col xs={24} md={10}>
							<Card style={{ background: '#f5f5f5', position: 'sticky', top: 0 }}>
								<Title level={5}>
									<InfoCircleOutlined /> How to Add a Model
								</Title>
								<Divider style={{ margin: '12px 0' }} />
								
								<Space direction="vertical" size="small" style={{ width: '100%' }}>
									<Text strong style={{ fontSize: '13px' }}>Required Fields:</Text>
									<ul style={{ paddingLeft: 20, marginBottom: 12 }}>
										<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Brand</strong> - Manufacturer name (e.g., TMAS, TUAS)</Text></li>
										<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Model</strong> - Unique model identifier</Text></li>
										<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Device Type</strong> - Category or function type</Text></li>
										<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Interface</strong> - Number of interfaces/channels</Text></li>
									</ul>

									<Divider style={{ margin: '12px 0' }} />

									<Text strong style={{ fontSize: '13px' }}>Optional:</Text>
									<ul style={{ paddingLeft: 20, marginBottom: 12 }}>
										<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Icon</strong> - Visual identifier for device selection</Text></li>
									</ul>

									<Divider style={{ margin: '12px 0' }} />

									<Text strong style={{ fontSize: '13px' }}>Example:</Text>
									<div style={{ 
										marginTop: 4, 
										padding: 8, 
										background: '#fff', 
										borderRadius: 4,
										border: '1px solid #d9d9d9'
									}}>
										<Text style={{ fontSize: '12px' }}>
											<strong>Brand:</strong> TMAS<br/>
											<strong>Model:</strong> T-DIM-001<br/>
											<strong>Type:</strong> dimmer<br/>
											<strong>Interface:</strong> 4<br/>
											<strong>Icon:</strong> 💡 Light Bulb
										</Text>
									</div>
								</Space>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	);
};

export default AddModel;
