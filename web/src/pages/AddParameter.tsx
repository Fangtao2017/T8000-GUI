import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Row, Col, Typography, message, Select, Divider, InputNumber, Modal } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Mock model data for searchable dropdown
const mockModels = [
	{ id: 1, name: 'T8000', brand: 'TMAS', type: 'gateway' },
	{ id: 2, name: 'T-AOH-001', brand: 'TMAS', type: 'analog_output' },
	{ id: 3, name: 'T-DIM-001', brand: 'TMAS', type: 'dimmer' },
	{ id: 4, name: 'T-OCC-001', brand: 'TMAS', type: 'occup_lux_snsr' },
	{ id: 5, name: 'T-FM-001', brand: 'TMAS', type: 'flow_mtr' },
	{ id: 6, name: 'T-TK-001', brand: 'TMAS', type: 'tank' },
	{ id: 7, name: 'T-PP-001', brand: 'TMAS', type: 'pump' },
	{ id: 8, name: 'T-TEM-001', brand: 'TMAS', type: 'temp_snsr' },
	{ id: 9, name: 'T-TEM-002', brand: 'TMAS', type: 'temp_snsr' },
	{ id: 10, name: 'T-LP-001', brand: 'TMAS', type: 'lp_sensor_mtr' },
	{ id: 11, name: 'T-EMS-002', brand: 'TMAS', type: '3p_ct_energy_mtr' },
	{ id: 12, name: 'T-EMS-003', brand: 'TMAS', type: '3p_direct_energy_mtr' },
	{ id: 13, name: 'T-ACP-001', brand: 'TMAS', type: 'aircon_panel' },
	{ id: 14, name: 'T-AIS-001', brand: 'TMAS', type: 'aircon_interface' },
	{ id: 15, name: 'T-FP-001', brand: 'TMAS', type: 'fire_alarm' },
	{ id: 16, name: 'T-DIDO-01', brand: 'TMAS', type: 'digital_input_output' },
	{ id: 17, name: 'T-AIR-001', brand: 'TMAS', type: 'universal_IR' },
	{ id: 18, name: 'T-MIU-001', brand: 'TMAS', type: 'multi_interface_unit' },
];

// Options based on the data specifications
const dataTypeOptions = [
	{ label: 'Discrete (0)', value: 0 },
	{ label: 'Integer (1)', value: 1 },
	{ label: 'Float (2)', value: 2 },
];

const rwAccessOptions = [
	{ label: 'Read Only (0)', value: 0 },
	{ label: 'Read & Write (1)', value: 1 },
];

const sourceOptions = [
	{ label: 'DI (0)', value: 0 },
	{ label: 'AI (1)', value: 1 },
	{ label: 'DO (2)', value: 2 },
	{ label: 'Modbus (3)', value: 3 },
	{ label: 'Zigbee (4)', value: 4 },
	{ label: 'T8000 Internal System (5)', value: 5 },
];

const runtimeOptions = [
	{ label: 'No (0) - Static parameter', value: 0 },
	{ label: 'Yes (1) - Defines device runtime', value: 1 },
];

const AddParameter: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [dataType, setDataType] = useState<number>(1);

	// Bit position options: 0-31 and 99 (NA)
	const bitOptions = [
		...Array.from({ length: 32 }, (_, i) => ({ value: i, label: `${i}` })),
		{ value: 99, label: '99 (NA)' },
	];

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			
			// Get model name for display
			const selectedModel = mockModels.find(m => m.id === values.model_id);
			const modelDisplay = selectedModel ? `${selectedModel.name} (${selectedModel.type})` : values.model_id;
			
			// Show confirmation modal
			Modal.confirm({
				title: 'Confirm Parameter Creation',
				content: (
					<div>
						<p><strong>Model:</strong> {modelDisplay}</p>
						<p><strong>Parameter:</strong> {values.parameter}</p>
						<p>Are you sure you want to create this parameter?</p>
					</div>
				),
				okText: 'Confirm',
				cancelText: 'Cancel',
				onOk: async () => {
					setLoading(true);

					// 模拟 API 调用
					console.log('Creating parameter:', values);

					// TODO: 实际 API 调用
					// POST /api/parameters - 创建参数
					
					await new Promise(resolve => setTimeout(resolve, 1000));

					message.success('Parameter added successfully!');
					form.resetFields();
					setLoading(false);
				},
			});
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handleReset = () => {
		form.resetFields();
		setDataType(1);
	};

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<PlusOutlined /> Add Parameter
					</Title>
					<Paragraph type="secondary">
						Create a new device parameter with detailed configuration
					</Paragraph>

					<Row gutter={24} style={{ marginTop: 32 }}>
						<Col xs={24} md={14}>
							<Card bordered>
								<Form
									form={form}
									layout="vertical"
									initialValues={{
										data_type: 1,
										rw: 0,
										source: 4,
										runtime: 0,
										bit: 99,
									}}
									onValuesChange={(changedValues) => {
									if (changedValues.data_type !== undefined) {
										setDataType(changedValues.data_type);
									}
								}}
							>
								<Row gutter={16}>
									<Col span={12}>
										<Form.Item
											label="Model"
											name="model_id"
											rules={[
												{ required: true, message: 'Please select a model' },
											]}
											tooltip="Select the device model this parameter belongs to"
										>
											<Select
												showSearch
												placeholder="Search and select model"
												size="large"
												optionFilterProp="label"
												filterOption={(input, option) =>
													(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
												}
												options={mockModels.map(model => ({
													value: model.id,
													label: `${model.name} (${model.type})`,
												}))}
											/>
										</Form.Item>
									</Col>

									<Col span={12}>
										<Form.Item
											label="Parameter Name"
											name="parameter"
											rules={[
												{ required: true, message: 'Please enter parameter name' },
												{ max: 50, message: 'Parameter name must be less than 50 characters' },
											]}
											tooltip="Unique identifier for this parameter"
										>
											<Input 
												placeholder="e.g., pwr_status, lum_level" 
												size="large"
											/>
										</Form.Item>
									</Col>
								</Row>									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												label="Attribute Name"
												name="attr"
												rules={[
													{ required: true, message: 'Please enter attribute name' },
													{ max: 50, message: 'Attribute name must be less than 50 characters' },
												]}
												tooltip="Display name or description for this parameter"
											>
												<Input 
													placeholder="e.g., Power Status, Luminance Level" 
													size="large"
												/>
											</Form.Item>
										</Col>

										<Col span={12}>
											<Form.Item
												label="Unit"
												name="unit"
												tooltip="Unit of measurement (optional)"
											>
												<Input 
													placeholder="e.g., %, V, A, °C, kW" 
													size="large"
												/>
											</Form.Item>
										</Col>
									</Row>

									<Divider>Data Configuration</Divider>

									<Row gutter={16}>
										<Col span={8}>
											<Form.Item
												label="Bit"
												name="bit"
												rules={[{ required: true, message: 'Please enter bit value' }]}
												tooltip="0-31: Bit position | 99: NA"
											>
												<Select
													placeholder="Select bit position"
													size="large"
													showSearch
													options={bitOptions}
												/>
											</Form.Item>
										</Col>

										<Col span={8}>
											<Form.Item
												label="Data Type"
												name="data_type"
												rules={[{ required: true, message: 'Please select data type' }]}
											>
												<Select
													size="large"
													options={dataTypeOptions}
												/>
											</Form.Item>
										</Col>

										<Col span={8}>
											<Form.Item
												label="Access"
												name="rw"
												rules={[{ required: true, message: 'Please select access' }]}
											>
												<Select
													size="large"
													options={rwAccessOptions}
												/>
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												label="Source Interface"
												name="source"
												rules={[{ required: true, message: 'Please select source' }]}
											>
												<Select
													size="large"
													options={sourceOptions}
												/>
											</Form.Item>
										</Col>

										<Col span={12}>
											<Form.Item
												label="Runtime"
												name="runtime"
												rules={[{ required: true, message: 'Please select runtime' }]}
												tooltip="Yes(1): Defines device runtime"
											>
												<Select
													size="large"
													options={runtimeOptions}
												/>
											</Form.Item>
										</Col>
									</Row>

									<Divider>Value Limits</Divider>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												label="Lower Limit"
												name="lower_limit"
												rules={[{ required: true, message: 'Please enter lower limit' }]}
											>
												<InputNumber 
													placeholder="e.g., 0" 
													size="large"
													style={{ width: '100%' }}
													step={dataType === 2 ? 0.01 : 1}
												/>
											</Form.Item>
										</Col>

										<Col span={12}>
											<Form.Item
												label="Upper Limit"
												name="upper_limit"
												rules={[{ required: true, message: 'Please enter upper limit' }]}
											>
												<InputNumber 
													placeholder="e.g., 100" 
													size="large"
													style={{ width: '100%' }}
													step={dataType === 2 ? 0.01 : 1}
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
											loading={loading}
											onClick={handleSubmit}
											style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
										>
											Create Parameter
										</Button>
										</Space>
									</div>
								</Form>
							</Card>
						</Col>

						<Col xs={24} md={10}>
							<Card style={{ background: '#f5f5f5', position: 'sticky', top: 0 }}>
								<Title level={5}>
									<InfoCircleOutlined /> Configuration Guide
								</Title>
								<Divider style={{ margin: '8px 0' }} />
								
								<Space direction="vertical" size="small" style={{ width: '100%' }}>
									<div>
										<Text strong style={{ fontSize: '12px' }}>Bit:</Text>
										<Text type="secondary" style={{ fontSize: '11px', marginLeft: 8 }}>0-31: Bit position | 99: NA</Text>
									</div>

									<div>
										<Text strong style={{ fontSize: '12px' }}>Data Type:</Text>
										<Text type="secondary" style={{ fontSize: '11px', marginLeft: 8 }}>Discrete(0) / Integer(1) / Float(2)</Text>
									</div>

									<div>
										<Text strong style={{ fontSize: '12px' }}>Source:</Text>
										<Text type="secondary" style={{ fontSize: '11px', marginLeft: 8 }}>DI/AI/DO/Modbus/Zigbee/T8000</Text>
									</div>

									<div>
										<Text strong style={{ fontSize: '12px' }}>Runtime:</Text>
										<Text type="secondary" style={{ fontSize: '11px', marginLeft: 8 }}>Yes(1): Defines device runtime | No(0): Static</Text>
									</div>

									<Divider style={{ margin: '12px 0' }} />

									<Text strong style={{ fontSize: '13px' }}>Example:</Text>
									<div style={{ 
										marginTop: 4, 
										padding: 8, 
										background: '#fff', 
										borderRadius: 4,
										border: '1px solid #d9d9d9'
									}}>
										<Text style={{ fontSize: '11px' }}>
											<strong>Model:</strong> T-DIM-001<br/>
											<strong>Parameter:</strong> lum_level<br/>
											<strong>Attribute:</strong> Luminance Level<br/>
											<strong>Unit:</strong> %<br/>
											<strong>Bit:</strong> 99 | <strong>Type:</strong> Integer(1)<br/>
											<strong>Access:</strong> R/W(1) | <strong>Source:</strong> Modbus(3)<br/>
											<strong>Limits:</strong> 0-100 | <strong>Runtime:</strong> Yes(1)
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

export default AddParameter;
