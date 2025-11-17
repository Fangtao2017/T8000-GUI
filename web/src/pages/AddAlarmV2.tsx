import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Row, Col, Typography, message, Select, AutoComplete, Segmented, Divider, Radio, Steps, Descriptions } from 'antd';
import { PlusOutlined, InfoCircleOutlined, BellOutlined, ControlOutlined, MinusCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

type ModeType = 'alarm' | 'rule';
type ConditionType = 'device' | 'timer';

interface Condition {
	device?: string;
	parameter?: string;
	timerState?: number;
	operator: string;
	value?: number;
	logic?: 'NONE' | 'AND' | 'OR' | 'NOT';
}

// Mock Data
const mockDevices = [
	{ id: 'device-001', name: 'Device-001', model: 'T-RELAY-001' },
	{ id: 'device-002', name: 'Device-002', model: 'T-TEM-001' },
	{ id: 'device-003', name: 'Device-003', model: 'T-DIM-001' },
	{ id: 'device-004', name: 'Device-004', model: 'T-PM-001' },
	{ id: 'device-005', name: 'Device-005', model: 'T-OXM-001' },
	{ id: 'device-006', name: 'Device-006', model: 'T-SP-001' },
	{ id: 'device-007', name: 'Device-007', model: 'T-IR-001' },
	{ id: 'device-008', name: 'Device-008', model: 'T-EMS-002' },
];

const mockTimers = [
	{ id: 'timer-001', name: 'Timer-001', description: 'Daily Schedule' },
	{ id: 'timer-002', name: 'Timer-002', description: 'Weekly Backup' },
	{ id: 'timer-003', name: 'Timer-003', description: 'Monthly Report' },
];

const mockParameters = [
	{ name: 'relay_state', unit: 'bool', deviceId: 'device-001' },
	{ name: 'trigger_mode', unit: 'int', deviceId: 'device-001' },
	{ name: 'temperature', unit: '°C', deviceId: 'device-002' },
	{ name: 'humidity', unit: '%', deviceId: 'device-002' },
	{ name: 'brightness', unit: '%', deviceId: 'device-003' },
	{ name: 'power_state', unit: 'bool', deviceId: 'device-003' },
	{ name: 'temperature', unit: '°C', deviceId: 'device-004' },
	{ name: 'fan_speed', unit: '%', deviceId: 'device-004' },
	{ name: 'occupancy', unit: 'bool', deviceId: 'device-005' },
	{ name: 'lux_level', unit: 'lux', deviceId: 'device-005' },
	{ name: 'voltage', unit: 'V', deviceId: 'device-006' },
	{ name: 'current', unit: 'A', deviceId: 'device-006' },
	{ name: 'level', unit: '%', deviceId: 'device-007' },
	{ name: 'flow_rate', unit: 'L/min', deviceId: 'device-007' },
	{ name: 'power_total', unit: 'kW', deviceId: 'device-008' },
	{ name: 'energy_total', unit: 'kWh', deviceId: 'device-008' },
	{ name: 'voltage_l1', unit: 'V', deviceId: 'device-008' },
];

const timerStateOptions = [
	{ label: 'Idle', value: 0 },
	{ label: 'Running', value: 1 },
	{ label: 'Expired', value: 2 },
];

const operatorOptions = [
	{ label: '==', value: '==' },
	{ label: '!=', value: '!=' },
	{ label: '<', value: '<' },
	{ label: '<=', value: '<=' },
	{ label: '>', value: '>' },
	{ label: '>=', value: '>=' },
];

const actionTypeOptions = [
	{ label: 'Set', value: 'set' },
	{ label: 'Toggle', value: 'toggle' },
	{ label: 'Increase', value: 'increase' },
	{ label: 'Decrease', value: 'decrease' },
];

const AddAlarmRule: React.FC = () => {
	const [form] = Form.useForm();
	const [mode, setMode] = useState<ModeType>('alarm');
	const [currentStep, setCurrentStep] = useState(0);
	const [conditionType, setConditionType] = useState<ConditionType>('device');
	const [parameterOptions, setParameterOptions] = useState<{ value: string; label: string }[]>([]);

	const handleModeChange = (value: string | number) => {
		setMode(value as ModeType);
		form.resetFields();
		setParameterOptions([]);
		setConditionType('device');
	};

	const handleDeviceSearch = (value: string) => {
		const device = mockDevices.find(d => d.id === value || d.name === value);
		if (device) {
			const params = mockParameters
				.filter(p => p.deviceId === device.id)
				.map(p => ({ value: p.name, label: `${p.name} (${p.unit})` }));
			setParameterOptions(params);
		}
	};

	const handleNext = async () => {
		try {
			if (currentStep === 0) {
				// Validate condition fields
				if (conditionType === 'device') {
					await form.validateFields(['name', 'conditionDevice', 'conditions', 'conditionLogic']);
				} else {
					await form.validateFields(['name', 'conditionTimer', 'conditions', 'conditionLogic']);
				}
			} else if (currentStep === 1) {
				// Validate action fields
				await form.validateFields(['actionDevice', 'actionType', 'actionParameter', 'actionValue']);
			}
			setCurrentStep(currentStep + 1);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handlePrevious = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			console.log('Rule created:', values);
			message.success('Rule created successfully!');
			setCurrentStep(3);
		} catch (error) {
			console.error('Submit failed:', error);
		}
	};

	const handleReset = () => {
		form.resetFields();
		setCurrentStep(0);
		setParameterOptions([]);
		setConditionType('device');
	};

	const handleAlarmSubmit = async () => {
		try {
			const values = await form.validateFields();
			console.log('Alarm created:', values);
			message.success('Alarm created successfully!');
			form.resetFields();
		} catch (error) {
			console.error('Submit failed:', error);
		}
	};

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<BellOutlined /> Add Alarm & Rule
					</Title>
					<Paragraph type="secondary">
						Create monitoring alarms or complex automation rules
					</Paragraph>

					<Segmented
						value={mode}
						onChange={handleModeChange}
						options={[
							{ label: 'Alarm', value: 'alarm', icon: <BellOutlined /> },
							{ label: 'Rule', value: 'rule', icon: <ControlOutlined /> },
						]}
						block
						style={{ marginBottom: 32 }}
					/>

					{mode === 'rule' && (
						<Steps current={currentStep} style={{ marginBottom: 32 }}>
							<Steps.Step title="Condition" description="Set trigger conditions" icon={<InfoCircleOutlined />} />
							<Steps.Step title="Action" description="Define actions" icon={<InfoCircleOutlined />} />
							<Steps.Step title="Review" description="Confirm details" icon={<InfoCircleOutlined />} />
							<Steps.Step title="Complete" description="Finish" icon={<CheckCircleOutlined />} />
						</Steps>
					)}

					<Form
						form={form}
						layout="vertical"
						initialValues={{
							operator: '>=',
							conditionLogic: 'AND',
							conditions: [{ operator: '>=', logic: 'NONE' }],
							actionType: 'set',
						}}
					>
						{/* Alarm Mode */}
						{mode === 'alarm' && (
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
						)}

						{/* Rule Mode - Step 0: Condition */}
						{mode === 'rule' && currentStep === 0 && (
							<>
								<Title level={4}>Step 1: Set Trigger Conditions</Title>

								<Row gutter={24}>
									<Col xs={24} md={14}>
										{/* Condition Type and Logic */}
										<Row gutter={16} style={{ marginBottom: 16 }}>
											<Col span={12}>
												<Space>
													<Text type="secondary" strong style={{ fontSize: '13px' }}>* Condition Type:</Text>
													<Radio.Group 
														size="small" 
														value={conditionType}
														onChange={(e) => {
															setConditionType(e.target.value);
															form.setFieldsValue({ 
																conditionDevice: undefined,
																conditionTimer: undefined,
																conditions: [{ operator: '>=', logic: 'NONE' }]
															});
														}}
													>
														<Radio.Button value="device">Device</Radio.Button>
														<Radio.Button value="timer">Timer</Radio.Button>
													</Radio.Group>
												</Space>
											</Col>
											<Col span={12}>
												<Space>
													<Text type="secondary" strong style={{ fontSize: '13px' }}>* Condition Logic:</Text>
													<Form.Item
														name="conditionLogic"
														style={{ marginBottom: 0 }}
													>
														<Radio.Group size="small">
															<Radio.Button value="AND">AND</Radio.Button>
															<Radio.Button value="OR">OR</Radio.Button>
															<Radio.Button value="NOT">NOT</Radio.Button>
															<Radio.Button value="NONE">NONE</Radio.Button>
														</Radio.Group>
													</Form.Item>
												</Space>
											</Col>
										</Row>

										{/* Rule Name and Device/Timer Selection */}
										<Row gutter={16} style={{ marginBottom: 16 }}>
											<Col span={12}>
												<Form.Item
													label="Rule Name"
													name="name"
													rules={[
														{ required: true, message: 'Please enter rule name' },
														{ max: 50, message: 'Rule name must be less than 50 characters' },
													]}
													style={{ marginBottom: 0 }}
												>
													<Input 
														placeholder="Enter rule name/description"
														size="large"
													/>
												</Form.Item>
											</Col>

											<Col span={12}>
												{conditionType === 'device' ? (
													<Form.Item
														label="Condition Device"
														name="conditionDevice"
														rules={[{ required: true, message: 'Please select a device' }]}
														style={{ marginBottom: 0 }}
													>
														<Select
															placeholder="Select device"
															size="large"
															showSearch
															optionFilterProp="label"
															options={mockDevices.map(d => ({ value: d.id, label: `${d.name} (${d.model})` }))}
														/>
													</Form.Item>
												) : (
													<Form.Item
														label="Condition Timer"
														name="conditionTimer"
														rules={[{ required: true, message: 'Please select a timer' }]}
														style={{ marginBottom: 0 }}
													>
														<Select
															placeholder="Select timer"
															size="large"
															showSearch
															optionFilterProp="label"
															options={mockTimers.map(t => ({ value: t.id, label: `${t.name} - ${t.description}` }))}
														/>
													</Form.Item>
												)}
											</Col>
										</Row>

										<Divider style={{ margin: '16px 0' }} />

										{/* Conditions List with Scroll - Max 2 visible */}
										<div style={{ 
											maxHeight: '240px', 
											overflow: 'auto',
											padding: '8px',
											border: '1px solid #f0f0f0',
											borderRadius: '8px',
											background: '#fafafa'
										}}>
											<Form.List name="conditions">
												{(fields, { add, remove }) => (
													<>
														{fields.map((field, index) => {
															const selectedDevice = form.getFieldValue('conditionDevice');
															const currentConditions = form.getFieldValue('conditions') || [];
															const currentConditionDevice = currentConditions[index]?.device;
															
															// Each condition can have its own device
															const deviceForCondition = currentConditionDevice || selectedDevice;
															
															return (
																<div 
																	key={field.key} 
																	style={{ 
																		marginBottom: 8,
																		padding: '12px',
																		background: '#fff',
																		borderRadius: '6px',
																		border: '1px solid #e8e8e8'
																	}}
																>
																	<Row gutter={8} align="middle">
																		<Col flex="none" style={{ width: '90px' }}>
																			<Text strong style={{ fontSize: '12px' }}>Condition {index + 1}</Text>
																		</Col>

																		{conditionType === 'device' && (
																			<>
																				<Col flex="none" style={{ width: '150px' }}>
																					<Form.Item
																						{...field}
																						name={[field.name, 'device']}
																						style={{ marginBottom: 0 }}
																					>
																						<Select
																							placeholder="Device"
																							size="small"
																							showSearch
																							optionFilterProp="label"
																							options={mockDevices.map(d => ({ value: d.id, label: d.name }))}
																							onChange={() => {
																								const conditions = form.getFieldValue('conditions');
																								conditions[index].parameter = undefined;
																								form.setFieldsValue({ conditions });
																							}}
																						/>
																					</Form.Item>
																				</Col>

																				<Col flex="none" style={{ width: '180px' }}>
																					<Form.Item
																						{...field}
																						name={[field.name, 'parameter']}
																						style={{ marginBottom: 0 }}
																					>
																						<AutoComplete
																							placeholder="Parameter"
																							size="small"
																							options={deviceForCondition 
																								? mockParameters
																									.filter(p => p.deviceId === deviceForCondition)
																									.map(p => ({ value: p.name, label: `${p.name} (${p.unit})` }))
																								: []
																							}
																							filterOption={(inputValue, option) =>
																								option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
																							}
																							disabled={!deviceForCondition}
																						/>
																					</Form.Item>
																				</Col>
																			</>
																		)}

																		{conditionType === 'timer' && (
																			<Col flex="none" style={{ width: '180px' }}>
																				<Form.Item
																					{...field}
																					name={[field.name, 'timerState']}
																					style={{ marginBottom: 0 }}
																				>
																					<Select
																						placeholder="Timer State"
																						size="small"
																						options={timerStateOptions}
																					/>
																				</Form.Item>
																			</Col>
																		)}

																		<Col flex="none" style={{ width: '80px' }}>
																			<Form.Item
																				{...field}
																				name={[field.name, 'operator']}
																				style={{ marginBottom: 0 }}
																			>
																				<Select
																					size="small"
																					options={conditionType === 'timer' 
																						? operatorOptions.filter(op => op.value === '==' || op.value === '!=')
																						: operatorOptions
																					}
																				/>
																			</Form.Item>
																		</Col>

																		{conditionType === 'device' ? (
																			<Col flex="none" style={{ width: '100px' }}>
																				<Form.Item
																					{...field}
																					name={[field.name, 'value']}
																					style={{ marginBottom: 0 }}
																				>
																					<Input
																						size="small"
																						type="number"
																						placeholder="Value"
																						step="0.01"
																						style={{ width: '100%' }}
																					/>
																				</Form.Item>
																			</Col>
																		) : (
																			<Col flex="none" style={{ width: '100px', textAlign: 'center' }}>
																				<Text type="secondary" style={{ fontSize: '12px' }}>-</Text>
																			</Col>
																		)}

																		<Col flex="none" style={{ width: '40px', textAlign: 'right' }}>
																			<Button
																				type="text"
																				danger
																				size="small"
																				icon={<MinusCircleOutlined />}
																				onClick={() => remove(field.name)}
																				disabled={fields.length === 1}
																				style={{ padding: '4px 8px' }}
																			/>
																		</Col>
																	</Row>
																</div>
															);
														})}

														<Button
															type="dashed"
															onClick={() => add({ operator: '>=', logic: 'NONE' })}
															block
															icon={<PlusOutlined />}
															size="small"
															style={{ marginTop: 8 }}
														>
															Add Condition
														</Button>
													</>
												)}
											</Form.List>
										</div>

										<div style={{ marginTop: 24, textAlign: 'right' }}>
											<Space>
												<Button size="large" onClick={handleReset}>
													Reset
												</Button>
												<Button
													type="primary"
													size="large"
													onClick={handleNext}
												>
													Next: Define Actions
												</Button>
											</Space>
										</div>
									</Col>

									<Col xs={24} md={10}>
										<Card style={{ background: '#f5f5f5', position: 'sticky', top: 0 }}>
											<Title level={5}>
												<InfoCircleOutlined /> Condition Setup Guide
											</Title>
											<Divider style={{ margin: '12px 0' }} />
											
											<Space direction="vertical" size="small" style={{ width: '100%' }}>
												<Text strong style={{ fontSize: '13px' }}>How it works:</Text>
												<ul style={{ marginTop: 4, paddingLeft: 20, marginBottom: 12 }}>
													<li><Text type="secondary" style={{ fontSize: '12px' }}>Choose Device or Timer to monitor</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}>Each condition can monitor a different device</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}>Set conditions with operators and values</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}>Combine conditions with AND/OR/NOT/NONE logic</Text></li>
												</ul>

												<Divider style={{ margin: '12px 0' }} />

												<Text strong style={{ fontSize: '13px' }}>Condition Logic:</Text>
												<ul style={{ marginTop: 4, paddingLeft: 20, marginBottom: 12 }}>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>AND</strong> - All conditions must be true</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>OR</strong> - Any condition can be true</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>NOT</strong> - Invert the result</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>NONE</strong> - Use first condition only</Text></li>
												</ul>

												<Divider style={{ margin: '12px 0' }} />

												<Text strong style={{ fontSize: '13px' }}>Example:</Text>
												<div style={{ 
													marginTop: 4, 
													padding: 8, 
													background: '#fff', 
													borderRadius: 4,
													fontSize: '12px',
													border: '1px solid #d9d9d9'
												}}>
													<Text style={{ fontSize: '12px' }}>
														<strong>Rule:</strong> Server cooling<br/>
														<strong>Logic:</strong> AND<br/>
														<strong>Conditions:</strong><br/>
														• Device-001: temperature {'>'} 28<br/>
														• Device-002: humidity {'<'} 40
													</Text>
												</div>
											</Space>
										</Card>
									</Col>
								</Row>
							</>
						)}

						{/* Rule Mode - Step 1: Action */}
						{mode === 'rule' && currentStep === 1 && (
							<>
								<Title level={4}>Step 2: Define Actions</Title>

								<Row gutter={24}>
									<Col xs={24} md={14}>
										<Form.Item
											label="Action Device"
											name="actionDevice"
											rules={[{ required: true, message: 'Please select a device' }]}
										>
											<Select
												placeholder="Select device to control"
												size="large"
												showSearch
												optionFilterProp="label"
												options={mockDevices.map(d => ({ value: d.id, label: `${d.name} (${d.model})` }))}
												onChange={handleDeviceSearch}
											/>
										</Form.Item>

										<Row gutter={16}>
											<Col span={12}>
												<Form.Item
													label="Action Type"
													name="actionType"
													rules={[{ required: true, message: 'Please select action type' }]}
												>
													<Select
														size="large"
														options={actionTypeOptions}
													/>
												</Form.Item>
											</Col>
											<Col span={12}>
												<Form.Item
													label="Target Parameter"
													name="actionParameter"
													rules={[{ required: true, message: 'Please select parameter' }]}
												>
													<AutoComplete
														placeholder="Select parameter"
														size="large"
														options={parameterOptions}
														filterOption={(inputValue, option) =>
															option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
														}
													/>
												</Form.Item>
											</Col>
										</Row>

										<Form.Item
											label="Action Value"
											name="actionValue"
											rules={[{ required: true, message: 'Please enter action value' }]}
										>
											<Input
												type="number"
												placeholder="Enter value to apply"
												size="large"
												step="0.01"
											/>
										</Form.Item>

										<div style={{ marginTop: 24, textAlign: 'right' }}>
											<Space>
												<Button size="large" onClick={handlePrevious}>
													Previous
												</Button>
												<Button
													type="primary"
													size="large"
													onClick={handleNext}
												>
													Next: Review
												</Button>
											</Space>
										</div>
									</Col>

									<Col xs={24} md={10}>
										<Card style={{ background: '#f5f5f5' }}>
											<Title level={5}>
												<InfoCircleOutlined /> Action Setup Guide
											</Title>
											<Divider style={{ margin: '12px 0' }} />
											
											<Space direction="vertical" size="small" style={{ width: '100%' }}>
												<Text strong style={{ fontSize: '13px' }}>Action Types:</Text>
												<ul style={{ marginTop: 4, paddingLeft: 20, marginBottom: 12 }}>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Set</strong> - Set parameter to specific value</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Toggle</strong> - Switch between on/off states</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Increase</strong> - Add value to current parameter</Text></li>
													<li><Text type="secondary" style={{ fontSize: '12px' }}><strong>Decrease</strong> - Subtract value from current parameter</Text></li>
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
														<strong>Device:</strong> Device-003 (Dimmer)<br/>
														<strong>Action:</strong> Set<br/>
														<strong>Parameter:</strong> brightness<br/>
														<strong>Value:</strong> 80%
													</Text>
												</div>
											</Space>
										</Card>
									</Col>
								</Row>
							</>
						)}

						{/* Rule Mode - Step 2: Review */}
						{mode === 'rule' && currentStep === 2 && (
							<>
								<Title level={4}>Step 3: Review Configuration</Title>

								<Card style={{ marginBottom: 24 }}>
									<Descriptions title="Rule Summary" bordered column={2}>
										<Descriptions.Item label="Rule Name" span={2}>{form.getFieldValue('name')}</Descriptions.Item>
										<Descriptions.Item label="Condition Type">{conditionType === 'device' ? 'Device' : 'Timer'}</Descriptions.Item>
										<Descriptions.Item label="Condition Logic">{form.getFieldValue('conditionLogic')}</Descriptions.Item>
										
										{conditionType === 'device' ? (
											<Descriptions.Item label="Condition Device" span={2}>
												{mockDevices.find(d => d.id === form.getFieldValue('conditionDevice'))?.name || 'N/A'}
											</Descriptions.Item>
										) : (
											<Descriptions.Item label="Condition Timer" span={2}>
												{mockTimers.find(t => t.id === form.getFieldValue('conditionTimer'))?.name || 'N/A'}
											</Descriptions.Item>
										)}

										<Descriptions.Item label="Conditions" span={2}>
											{(form.getFieldValue('conditions') || []).map((cond: Condition, idx: number) => (
												<div key={idx}>
													{idx + 1}. {conditionType === 'device' 
														? `${cond.parameter} ${cond.operator} ${cond.value}`
														: `Timer State ${cond.operator} ${timerStateOptions.find(t => t.value === cond.timerState)?.label}`
													}
												</div>
											))}
										</Descriptions.Item>

										<Descriptions.Item label="Action Device" span={2}>
											{mockDevices.find(d => d.id === form.getFieldValue('actionDevice'))?.name || 'N/A'}
										</Descriptions.Item>

										<Descriptions.Item label="Action Type">{form.getFieldValue('actionType')}</Descriptions.Item>
										<Descriptions.Item label="Action Parameter">{form.getFieldValue('actionParameter')}</Descriptions.Item>
										<Descriptions.Item label="Action Value" span={2}>{form.getFieldValue('actionValue')}</Descriptions.Item>
									</Descriptions>
								</Card>

								<div style={{ textAlign: 'right' }}>
									<Space>
										<Button size="large" onClick={handlePrevious}>
											Previous
										</Button>
										<Button
											type="primary"
											size="large"
											onClick={handleSubmit}
										>
											Create Rule
										</Button>
									</Space>
								</div>
							</>
						)}

						{/* Rule Mode - Step 3: Complete */}
						{mode === 'rule' && currentStep === 3 && (
							<div style={{ textAlign: 'center', padding: '60px 0' }}>
								<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a', marginBottom: 24 }} />
								<Title level={3}>Rule Created Successfully!</Title>
								<Paragraph type="secondary" style={{ fontSize: 16 }}>
									Your automation rule has been configured and is now active.
								</Paragraph>
								<Space size="large" style={{ marginTop: 32 }}>
									<Button size="large" onClick={handleReset}>
										Create Another Rule
									</Button>
									<Button type="primary" size="large">
										View All Rules
									</Button>
								</Space>
							</div>
						)}
					</Form>
				</div>
			</div>
		</div>
	);
};

export default AddAlarmRule;
