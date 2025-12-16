import React from 'react';
import { Form, Input, Button, Space, Row, Col, Typography, Select, AutoComplete, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { FormInstance } from 'antd/es/form';
import { mockDevices, mockParameters, timerStateOptions, operatorOptions, mockSavedConditions, mockRules, ruleStateOptions } from '../data/mockData';

const { Title, Text } = Typography;

interface AddRuleConditionProps {
	form: FormInstance;
	onNext: () => void;
	onReset: () => void;
}

const AddRuleCondition: React.FC<AddRuleConditionProps> = ({
	form,
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
								const currentType = currentConditions[index]?.type || 'device';

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

											<Col flex="none" style={{ width: '160px' }}>
												<Form.Item
													{...field}
													name={[field.name, 'type']}
													style={{ marginBottom: 0 }}
													initialValue="device"
												>
													<Select
														size="small"
														placeholder="Type"
														options={[
															{ label: 'Device Parameter', value: 'device' },
															{ label: 'Timer', value: 'timer' },
															{ label: 'Rule Status', value: 'rule' },
														]}
														onChange={(value) => {
															const conditions = form.getFieldValue('conditions');
															conditions[index] = {
																...conditions[index],
																type: value,
																device: undefined,
																parameter: undefined,
																timerState: undefined,
																rule: undefined,
																ruleState: undefined,
																operator: '>=',
																mode: 1,
																value: undefined
															};
															form.setFieldsValue({ conditions });
														}}
													/>
												</Form.Item>
											</Col>
											<Col flex="none" style={{ width: '100px' }}>
												<Form.Item
													{...field}
													name={[field.name, 'logic']}
													style={{ marginBottom: 0 }}
													initialValue="AND"
												>
													<Select
														size="small"
														placeholder="Logic"
														options={[
															{ label: 'AND', value: 'AND' },
															{ label: 'OR', value: 'OR' },
														]}
													/>
												</Form.Item>
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
																	.filter(c => c.type === currentType)
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
													{currentType === 'device' && (
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

													{currentType === 'timer' && (
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

													{currentType === 'rule' && (
														<>
															<Col flex="none" style={{ width: '180px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'rule']}
																	style={{ marginBottom: 0 }}
																>
																	<Select
																		placeholder="Select Rule"
																		size="small"
																		showSearch
																		optionFilterProp="label"
																		options={mockRules.map(r => ({ value: r.id, label: r.name }))}
																	/>
																</Form.Item>
															</Col>
															<Col flex="none" style={{ width: '200px' }}>
																<Form.Item
																	{...field}
																	name={[field.name, 'ruleState']}
																	style={{ marginBottom: 0 }}
																>
																	<Select
																		placeholder="Rule State"
																		size="small"
																		options={ruleStateOptions}
																	/>
																</Form.Item>
															</Col>
														</>
													)}

													<Col flex="none" style={{ width: '90px' }}>
														<Form.Item
															{...field}
															name={[field.name, 'operator']}
															style={{ marginBottom: 0 }}
														>
															<Select
																size="small"
																options={(currentType === 'timer' || currentType === 'rule')
																	? operatorOptions.filter(op => op.value === '==' || op.value === '!=')
																	: operatorOptions
																}
															/>
														</Form.Item>
													</Col>

													{currentType === 'device' ? (
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
								onClick={() => add({ itemMode: 'new', type: 'device', operator: '>=', logic: 'AND', mode: 1 })}
								block
								icon={<PlusOutlined />}
								size="middle"
								style={{ width: '33%' }}
							>
								Add New Condition
							</Button>
							<Button
								type="dashed"
								onClick={() => add({ itemMode: 'existing', type: 'device', operator: '>=', logic: 'AND', mode: 1 })}
								block
								icon={<PlusOutlined />}
								size="middle"
								style={{ width: '33%' }}
							>
								Add Existing Condition
							</Button>
							<Button
								type="dashed"
								onClick={() => add({ itemMode: 'new', type: 'rule', operator: '==', logic: 'AND', mode: 1 })}
								block
								icon={<PlusOutlined />}
								size="middle"
								style={{ width: '34%' }}
							>
								Add Rule Condition
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
