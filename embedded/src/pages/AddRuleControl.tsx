import React from 'react';
import { Form, Input, Button, Space, Row, Col, Typography, Select, AutoComplete, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import { mockDevices, mockTimers, mockParameters, mockSavedControls } from '../data/mockData';

const { Title, Text } = Typography;

type ConditionType = 'device' | 'timer';

interface AddRuleControlProps {
	form: FormInstance;
	controlType: ConditionType;
	setControlType: (type: ConditionType) => void;
	onNext: () => void;
	onPrevious: () => void;
}

const AddRuleControl: React.FC<AddRuleControlProps> = ({
	form,
	controlType,
	setControlType,
	onNext,
	onPrevious
}) => {
	return (
		<>
			<Title level={4} style={{ marginBottom: 16 }}>Step 2: Define Actions</Title>

			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}>
					<Form.Item
						label="Action Name"
						name="actionName"
						rules={[{ required: true, message: 'Please enter action name' }]}
						tooltip="Give your action a descriptive name"
					>
						<Input size="large" placeholder="e.g., Adjust Temperature" />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="Control Type"
						name="controlType"
						rules={[{ required: true, message: 'Please select control type' }]}
						tooltip="Select whether to control devices or timers"
					>
						<Select
							size="large"
							value={controlType}
							onChange={(value) => {
								setControlType(value);
								form.setFieldsValue({ 
									controlType: value,
									controls: [{ mode: 1 }]
								});
							}}
							options={[
								{ label: 'Device', value: 'device' },
								{ label: 'Timer', value: 'timer' },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="Report"
						name="report"
						rules={[{ required: true, message: 'Please select report option' }]}
						tooltip="Enable or disable reporting for this rule"
					>
						<Select
							size="large"
							options={[
								{ label: 'Enable Report', value: 1 },
								{ label: 'No Report', value: 0 },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="Log"
						name="log"
						rules={[{ required: true, message: 'Please select log option' }]}
						tooltip="Enable or disable logging for this rule"
					>
						<Select
							size="large"
							options={[
								{ label: 'Enable Log', value: 1 },
								{ label: 'No Log', value: 0 },
							]}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Divider style={{ margin: '16px 0' }} />

			{/* Create New Controls */}
			<Form.List name="controls">
				{(fields, { add, remove}) => {
					const shouldScroll = fields.length > 1;
			
					return (
						<>
							<div style={{ 
								maxHeight: shouldScroll ? '360px' : 'none',
								overflow: shouldScroll ? 'auto' : 'visible',
								padding: '16px',
								border: '1px solid #f0f0f0',
								borderRadius: '8px',
								background: '#fafafa'
							}}>
								{fields.map((field, index) => {
								const currentControls = form.getFieldValue('controls') || [];
								const controlMode = currentControls[index]?.mode || 1;
								const itemMode = currentControls[index]?.itemMode || 'new';
								const currentControlDevice = currentControls[index]?.device;
								const currentRefDevice = currentControls[index]?.refDevice;

								return (
									<div 
										key={field.key} 
										style={{ 
											marginBottom: 16,
											padding: '16px',
											background: '#fff',
											borderRadius: '8px',
											border: '1px solid #e8e8e8'
										}}
									>
										<Row gutter={12} align="middle" style={{ marginBottom: 12 }}>
											<Col flex="none" style={{ width: '100px' }}>
												<Text strong style={{ fontSize: '13px' }}>Control {index + 1}</Text>
											</Col>

											{itemMode === 'existing' ? (
												<>
													<Col flex="auto">
														<Form.Item
															{...field}
															name={[field.name, 'existingId']}
															style={{ marginBottom: 0 }}
															rules={[{ required: true, message: 'Please select a control' }]}
														>
															<Select
																size="small"
																placeholder="Select an existing control"
																showSearch
																optionFilterProp="label"
																options={mockSavedControls
																	.filter(c => c.type === controlType)
																	.map(c => ({
																		label: `${c.name} - ${c.description}`,
																		value: c.id
																	}))}
															/>
														</Form.Item>
													</Col>
													<Col flex="none" style={{ width: '50px', textAlign: 'right' }}>
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
												</>
											) : (
												<>
													{controlType === 'device' && (
														<>
															<Col flex="none" style={{ width: '180px' }}>
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
																			const controls = form.getFieldValue('controls');
																			controls[index].parameter = undefined;
																			form.setFieldsValue({ controls });
																		}}
																	/>
																</Form.Item>
															</Col>

															<Col flex="none" style={{ width: '200px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'parameter']}
																	style={{ marginBottom: 0 }}
																>
																	<AutoComplete
																		placeholder="Parameter"
																		size="small"
																		options={currentControlDevice 
																			? mockParameters
																				.filter(p => p.deviceId === currentControlDevice)
																				.map(p => ({ value: p.name, label: `${p.name} (${p.unit})` }))
																			: []
																		}
																		filterOption={(inputValue, option) =>
																			option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
																		}
																		disabled={!currentControlDevice}
																	/>
																</Form.Item>
															</Col>
														</>
													)}

													{controlType === 'timer' && (
														<>
															<Col flex="none" style={{ width: '180px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'timer']}
																	style={{ marginBottom: 0 }}
																>
																	<Select
																		placeholder="Timer"
																		size="small"
																		showSearch
																		optionFilterProp="label"
																		options={mockTimers.map(t => ({ value: t.id, label: t.name }))}
																	/>
																</Form.Item>
															</Col>

															<Col flex="none" style={{ width: '200px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'timerAction']}
																	style={{ marginBottom: 0 }}
																>
																	<Select
																		placeholder="Timer Action"
																		size="small"
																		options={[
																			{ label: 'Start', value: 'start' },
																			{ label: 'Stop', value: 'stop' },
																			{ label: 'Reset', value: 'reset' },
																		]}
																	/>
																</Form.Item>
															</Col>
														</>
													)}

													<Col flex="none" style={{ width: '120px' }}>
														<Form.Item
															{...field}
															name={[field.name, 'mode']}
															style={{ marginBottom: 0 }}
														>
															<Select
																placeholder="Mode"
																size="small"
																options={[
																	{ label: 'Fixed Value', value: 1 },
																	{ label: 'Ref Param', value: 2 },
																]}
																onChange={(value) => {
																	const controls = form.getFieldValue('controls');
																	controls[index].mode = value;
																	form.setFieldsValue({ controls });
																}}
															/>
														</Form.Item>
													</Col>

													{controlMode === 1 && (
														<Col flex="none" style={{ width: '120px' }}>
															<Form.Item
																{...field}
																name={[field.name, 'value']}
																style={{ marginBottom: 0 }}
															>
																<Input
																	placeholder="Value"
																	size="small"
																	type="number"
																	step="0.01"
																/>
															</Form.Item>
														</Col>
													)}

													{controlMode === 2 && (
														<>
															<Col flex="none" style={{ width: '180px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'refDevice']}
																	style={{ marginBottom: 0 }}
																>
																	<Select
																		placeholder="Reference Device"
																		size="small"
																		showSearch
																		optionFilterProp="label"
																		options={mockDevices.map(d => ({ value: d.id, label: d.name }))}
																		onChange={() => {
																			const controls = form.getFieldValue('controls');
																			controls[index].refParameter = undefined;
																			form.setFieldsValue({ controls });
																		}}
																	/>
																</Form.Item>
															</Col>

															<Col flex="none" style={{ width: '200px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'refParameter']}
																	style={{ marginBottom: 0 }}
																>
																	<AutoComplete
																		placeholder="Reference Parameter"
																		size="small"
																		options={currentRefDevice 
																			? mockParameters
																				.filter(p => p.deviceId === currentRefDevice)
																				.map(p => ({ value: p.name, label: `${p.name} (${p.unit})` }))
																			: []
																		}
																		filterOption={(inputValue, option) =>
																			option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
																		}
																		disabled={!currentRefDevice}
																	/>
																</Form.Item>
															</Col>
														</>
													)}

													<Col flex="none" style={{ width: '50px' }}>
														{fields.length > 1 && (
															<Button
																type="text"
																danger
																size="small"
																icon={<MinusCircleOutlined />}
																onClick={() => remove(field.name)}
															/>
														)}
													</Col>
												</>
											)}
										</Row>
									</div>
								);
							})}
						</div>

						<Space.Compact block style={{ marginTop: 16 }}>
							<Button
								type="dashed"
								onClick={() => add({ itemMode: 'new', mode: 1 })}
								block
								icon={<PlusOutlined />}
								size="middle"
								style={{ width: '50%' }}
							>
								Add New Control
							</Button>
							<Button
								type="dashed"
								onClick={() => add({ itemMode: 'existing', mode: 1 })}
								block
								icon={<PlusOutlined />}
								size="middle"
								style={{ width: '50%' }}
							>
								Add Existing Control
							</Button>
						</Space.Compact>
					</>
				);
			}}
			</Form.List>

			<div style={{ marginTop: 24, textAlign: 'right' }}>
				<Space>
					<Button size="large" onClick={onPrevious}>
						Previous
					</Button>
					<Button
						type="primary"
						size="large"
						onClick={onNext}
				style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
				Next: Review
					</Button>
				</Space>
			</div>
		</>
	);
};

export default AddRuleControl;
