import React from 'react';
import { Form, Input, Button, Space, Row, Col, Typography, Select, AutoComplete, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { FormInstance } from 'antd/es/form';
import { mockDevices, mockParameters, timerStateOptions, operatorOptions, mockSavedConditions } from '../data/mockData';

const { Title, Text } = Typography;

type ConditionType = 'device' | 'timer';

interface AddRuleConditionProps {
	form: FormInstance;
	conditionType: ConditionType;
	setConditionType: (type: ConditionType) => void;
	onNext: () => void;
	onReset: () => void;
}

const AddRuleCondition: React.FC<AddRuleConditionProps> = ({
	form,
	conditionType,
	setConditionType,
	onNext,
	onReset
}) => {
	const navigate = useNavigate();

	return (
		<>
			<Title level={4}>Step 1: Set Trigger Conditions</Title>

			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}>
					<Form.Item
						label="Rule Name"
						name="name"
						rules={[{ required: true, message: 'Please enter rule name' }]}
						tooltip="Give your rule a descriptive name"
					>
						<Input size="large" placeholder="e.g., Temperature Alert" />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="Severity"
						name="severity"
						rules={[{ required: true, message: 'Please select severity' }]}
						initialValue="Critical"
						tooltip="Select the severity level for this rule"
					>
						<Select
							size="large"
							options={[
								{ value: 'Critical', label: 'Critical' },
								{ value: 'Warning', label: 'Warning' },
								{ value: 'Info', label: 'Info' },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="Condition Type"
						name="conditionType"
						rules={[{ required: true, message: 'Please select condition type' }]}
						tooltip="Select the type of trigger for this rule"
					>
						<Select
							size="large"
							value={conditionType}
							onChange={(value) => {
								setConditionType(value);
								form.setFieldsValue({ 
									conditionType: value,
									conditions: [{ operator: '>=', logic: 'NONE', mode: 1 }]
								});
							}}
							options={[
								{ label: 'Device Parameter', value: 'device' },
								{ label: 'Timer', value: 'timer' },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item
						label="Condition Logic"
						name="conditionLogic"
						rules={[{ required: true, message: 'Please select logic' }]}
						tooltip="How conditions are combined"
					>
						<Select
							size="large"
							placeholder="Select logic"
							options={[
								{ label: 'All conditions (AND)', value: 'AND' },
								{ label: 'Any condition (OR)', value: 'OR' },
							]}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Divider style={{ margin: '16px 0' }} />

			{/* Create New Conditions */}
			<Form.List name="conditions">
				{(fields, { add, remove }) => {
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
								const currentConditions = form.getFieldValue('conditions') || [];
								const conditionMode = currentConditions[index]?.mode || 1;
								const itemMode = currentConditions[index]?.itemMode || 'new';
								const currentConditionDevice = currentConditions[index]?.device;
								const currentRefDevice = currentConditions[index]?.refDevice;

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
												<Text strong style={{ fontSize: '13px' }}>Condition {index + 1}</Text>
											</Col>

											{itemMode === 'existing' ? (
												<>
													<Col flex="auto">
														<Form.Item
															{...field}
															name={[field.name, 'existingId']}
															style={{ marginBottom: 0 }}
															rules={[{ required: true, message: 'Please select a condition' }]}
														>
															<Select
																size="small"
																placeholder="Select an existing condition"
																showSearch
																optionFilterProp="label"
																options={mockSavedConditions
																	.filter(c => c.type === conditionType)
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
													{conditionType === 'device' && (
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
																			const conditions = form.getFieldValue('conditions');
																			conditions[index].parameter = undefined;
																			form.setFieldsValue({ conditions });
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
																		options={currentConditionDevice 
																			? mockParameters
																				.filter(p => p.deviceId === currentConditionDevice)
																				.map(p => ({ value: p.name, label: `${p.name} (${p.unit})` }))
																			: []
																		}
																		filterOption={(inputValue, option) =>
																			option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
																		}
																		disabled={!currentConditionDevice}
																	/>
																</Form.Item>
															</Col>
														</>
													)}

													{conditionType === 'timer' && (
														<Col flex="none" style={{ width: '200px' }}>
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

													<Col flex="none" style={{ width: '90px' }}>
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
														<>
															<Col flex="none" style={{ width: '120px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'mode']}
																	style={{ marginBottom: 0 }}
																>
																	<Select
																		size="small"
																		placeholder="Mode"
																		onChange={(value) => {
																			const conditions = form.getFieldValue('conditions');
																			conditions[index].mode = value;
																			if (value === 3) {
																				conditions[index].value = undefined;
																			}
																			form.setFieldsValue({ conditions });
																		}}
																		options={[
																			{ label: 'Fixed Value', value: 1 },
																			{ label: 'Ref Param', value: 2 },
																			{ label: 'Previous', value: 3 },
																		]}
																	/>
																</Form.Item>
															</Col>

															{conditionMode === 1 && (
																<Col flex="none" style={{ width: '120px' }}>
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
															)}

															{conditionMode === 2 && (
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
																					const conditions = form.getFieldValue('conditions');
																					conditions[index].refParameter = undefined;
																					form.setFieldsValue({ conditions });
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

															{conditionMode === 3 && (
																<Col flex="none" style={{ width: '120px' }}>
																	<Text type="secondary" style={{ fontSize: '12px', paddingLeft: 8 }}>
																		previous value
																	</Text>
																</Col>
															)}
														</>
													) : (
														<Col flex="none" style={{ width: '120px', textAlign: 'center' }}>
															<Text type="secondary" style={{ fontSize: '12px' }}>-</Text>
														</Col>
													)}

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
											)}
										</Row>
									</div>
								);
							})}
						</div>

						<Space.Compact block style={{ marginTop: 16 }}>
							<Button
								type="dashed"
								onClick={() => add({ itemMode: 'new', operator: '>=', logic: 'NONE', mode: 1 })}
								block
								icon={<PlusOutlined />}
								size="middle"
								style={{ width: '50%' }}
							>
								Add New Condition
							</Button>
							<Button
								type="dashed"
								onClick={() => add({ itemMode: 'existing', operator: '>=', logic: 'NONE', mode: 1 })}
								block
								icon={<PlusOutlined />}
								size="middle"
								style={{ width: '50%' }}
							>
								Add Existing Condition
							</Button>
						</Space.Compact>
					</>
				);
			}}
			</Form.List>

			<div style={{ marginTop: 24, textAlign: 'right' }}>
				<Space>
					<Button size="large" onClick={() => navigate('/configuration/add-alarm')}>
						Basic Alarm?
					</Button>
					<Button size="large" onClick={onReset}>
						Reset
					</Button>
					<Button
						type="primary"
						size="large"
						onClick={onNext}
				style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
				Next: Define Actions
					</Button>
				</Space>
			</div>
		</>
	);
};

export default AddRuleCondition;
