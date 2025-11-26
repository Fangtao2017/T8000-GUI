import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Row, Col, Typography, message, Select, AutoComplete, Divider } from 'antd';
import { InfoCircleOutlined, BellOutlined } from '@ant-design/icons';
import { mockDevices, mockParameters, operatorOptions } from '../data/mockData';

const { Title, Text, Paragraph } = Typography;

const AddAlarm: React.FC = () => {
	const [form] = Form.useForm();
	const [parameterOptions, setParameterOptions] = useState<{ value: string; label: string }[]>([]);

	const handleDeviceSearch = (value: string) => {
		const device = mockDevices.find(d => d.id === value || d.name === value);
		if (device) {
			const params = mockParameters
				.filter(p => p.deviceId === device.id)
				.map(p => ({ value: p.name, label: `${p.name} (${p.unit})` }));
			setParameterOptions(params);
		}
	};

	const handleReset = () => {
		form.resetFields();
		setParameterOptions([]);
	};

	const handleAlarmSubmit = async () => {
		try {
			const values = await form.validateFields();
			console.log('Alarm created:', values);
			message.success('Alarm created successfully!');
			form.resetFields();
			setParameterOptions([]);
		} catch (error) {
			console.error('Submit failed:', error);
		}
	};

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<BellOutlined /> Add Alarm
					</Title>
					<Paragraph type="secondary">
						Create monitoring alarms for device parameters
					</Paragraph>

					<Form
						form={form}
						layout="vertical"
						initialValues={{
							operator: '>=',
						}}
					>
						<Row gutter={24}>
							<Col xs={24} md={14}>
								<Form.Item
									label="Alarm Name"
									name="name"
									rules={[{ required: true, message: 'Please enter alarm name' }]}
								>
									<Input placeholder="Enter alarm name/description" size="large" />
								</Form.Item>

								<Form.Item
									label="Severity"
									name="severity"
									rules={[{ required: true, message: 'Please select severity' }]}
									initialValue="Critical"
								>
									<Select
										placeholder="Select severity"
										size="large"
										options={[
											{ value: 'Critical', label: 'Critical' },
											{ value: 'Warning', label: 'Warning' },
											{ value: 'Info', label: 'Info' },
										]}
									/>
								</Form.Item>

								<Form.Item
									label="Device"
									name="device"
									rules={[{ required: true, message: 'Please select a device' }]}
								>
									<Select
										placeholder="Select device"
										size="large"
										showSearch
										optionFilterProp="label"
										options={mockDevices.map(d => ({ value: d.id, label: `${d.name} (${d.model})` }))}
										onChange={handleDeviceSearch}
									/>
								</Form.Item>

								<Form.Item
									label="Parameter"
									name="parameter"
									rules={[{ required: true, message: 'Please select a parameter' }]}
								>
									<AutoComplete
										placeholder="Select or type parameter name"
										size="large"
										options={parameterOptions}
										filterOption={(inputValue, option) =>
											option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
										}
									/>
								</Form.Item>

								<Row gutter={16}>
									<Col span={12}>
										<Form.Item
											label="Operator"
											name="operator"
											rules={[{ required: true, message: 'Please select an operator' }]}
										>
											<Select
												size="large"
												options={operatorOptions}
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Threshold Value"
											name="value"
											rules={[{ required: true, message: 'Please enter a value' }]}
										>
											<Input
												type="number"
												placeholder="Enter threshold value"
												size="large"
												step="0.01"
											/>
										</Form.Item>
									</Col>
								</Row>

								<div style={{ marginTop: 24, textAlign: 'right' }}>
									<Space>
										<Button size="large" onClick={handleReset}>
											Reset
										</Button>
										<Button
											type="primary"
											size="large"
											onClick={handleAlarmSubmit}
											style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
										>
											Create Alarm
										</Button>
									</Space>
								</div>
							</Col>

							<Col xs={24} md={10}>
								<Card style={{ background: '#f5f5f5' }}>
									<Title level={5}>
										<InfoCircleOutlined /> How to Create an Alarm
									</Title>
									<Divider style={{ margin: '12px 0' }} />
									
									<Space direction="vertical" size="small" style={{ width: '100%' }}>
										<ul style={{ paddingLeft: 20, marginBottom: 12 }}>
											<li><Text type="secondary" style={{ fontSize: '12px' }}>Enter a descriptive name for your alarm</Text></li>
											<li><Text type="secondary" style={{ fontSize: '12px' }}>Select the device to monitor</Text></li>
											<li><Text type="secondary" style={{ fontSize: '12px' }}>Choose the parameter to track</Text></li>
											<li><Text type="secondary" style={{ fontSize: '12px' }}>Set operator and threshold value</Text></li>
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
												<strong>Name:</strong> Server room high temp<br/>
												<strong>Device:</strong> Device-002 (T-TEM-001)<br/>
												<strong>Parameter:</strong> temperature (°C)<br/>
												<strong>Condition:</strong> {'>'} 28
											</Text>
										</div>
									</Space>
								</Card>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default AddAlarm;
