import React, { useState } from 'react';
import { Form, Input, Button, Space, Row, Col, Typography, message, Select, InputNumber, Divider, Steps } from 'antd';
import { PlusOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

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

const unitOptions = [
	{ label: 'None', value: '' },
	{ label: '°C', value: '°C' },
	{ label: '°F', value: '°F' },
	{ label: '%', value: '%' },
	{ label: 'V', value: 'V' },
	{ label: 'A', value: 'A' },
	{ label: 'W', value: 'W' },
	{ label: 'kW', value: 'kW' },
	{ label: 'kWh', value: 'kWh' },
	{ label: 'Hz', value: 'Hz' },
	{ label: 'RPM', value: 'RPM' },
	{ label: 'bar', value: 'bar' },
	{ label: 'psi', value: 'psi' },
	{ label: 'm/s', value: 'm/s' },
];

const bitOptions = [
	...Array.from({ length: 32 }, (_, i) => ({ label: i.toString(), value: i })),
	{ label: '99 (NA)', value: 99 },
];

const dataTypeOptions = [
	{ label: 'Discrete', value: 'discrete' },
	{ label: 'Integer', value: 'integer' },
	{ label: 'Float', value: 'float' },
];

const rwOptions = [
	{ label: 'Read Only', value: 'r' },
	{ label: 'Read & Write', value: 'rw' },
];

const sourceOptions = [
	{ label: 'DI', value: 'DI' },
	{ label: 'DO', value: 'DO' },
	{ label: 'AI', value: 'AI' },
	{ label: 'Modbus', value: 'modbus' },
	{ label: 'Zigbee', value: 'zigbee' },
];

const pinOptions = [
	'P8_07', 'P8_08', 'P8_09', 'P8_10', 'P8_11', 'P8_12', 'P8_13', 'P8_14', 'P8_15', 'P8_16',
	'P8_17', 'P8_18', 'P8_19', 'P8_26',
	'P9_11', 'P9_12', 'P9_13', 'P9_14', 'P9_15', 'P9_16', 'P9_39', 'P9_40', 'P9_41', 'P9_42'
].map(p => ({ label: p, value: p }));

const invertOptions = [
	{ label: '0: Normally Open', value: 0 },
	{ label: '1: Normally Close', value: 1 },
];

const enableOptions = [
	{ label: '0: Disable channel', value: 0 },
	{ label: '1: Enable channel', value: 1 },
];

const doDefaultOptions = [
	{ label: '0: Normally Open (low)', value: 0 },
	{ label: '1: Normally Close (high)', value: 1 },
];

const AddParameter: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const sourceType = Form.useWatch('sourceType', form);
	const rw = Form.useWatch('rw', form);

	const handleNext = async () => {
		try {
			await form.validateFields(['model_id', 'name', 'attributeName', 'sourceType', 'unit', 'bit', 'dataType', 'rw', 'lowerLimit', 'upperLimit']);
			setCurrentStep(1);
		} catch {
			// Validation failed
		}
	};

	const handlePrev = () => {
		setCurrentStep(0);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			setLoading(true);
			console.log('Creating parameter:', values);
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			message.success('Parameter added successfully!');
			form.resetFields();
			setCurrentStep(0);
			setLoading(false);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const renderConfigFields = () => {
		switch (sourceType) {
			case 'modbus':
				return (
					<>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Register Address" name={['config', 'address']} required>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Length (len)" name={['config', 'len']} initialValue={1} required>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Read Function Code (readFC)" name={['config', 'readFC']} required>
									<Select>
										<Option value={0}>00: Not Available</Option>
										<Option value={1}>01: Read Coils</Option>
										<Option value={2}>02: Read Discrete Inputs</Option>
										<Option value={3}>03: Read Holding Registers</Option>
										<Option value={4}>04: Read Input Registers</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Write Function Code (writeFC)" name={['config', 'writeFC']} required>
									<Select>
										<Option value={0}>00: Not Available</Option>
										<Option value={5}>05: Write Single Coil</Option>
										<Option value={6}>06: Write Single Register</Option>
										<Option value={15}>15: Write Multiple Coils</Option>
										<Option value={16}>16: Write Multiple Registers</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Data Type (datatype)" name={['config', 'modbusDataType']} required>
									<Select>
										<Option value={1}>1: Int</Option>
										<Option value={2}>2: Discrete</Option>
										<Option value={3}>3: Float</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Decimal Place (dp)" name={['config', 'dp']} initialValue={1}>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Scaler" name={['config', 'scaler']} initialValue={0.1}>
									<InputNumber style={{ width: '100%' }} step={0.1} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Offset" name={['config', 'offset']} initialValue={0}>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Timeout (ms)" name={['config', 'timeout']} initialValue={200}>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Polling Speed" name={['config', 'pollSpeed']}>
									<Select>
										<Option value={0}>0: NA</Option>
										<Option value={1}>1: Fast</Option>
										<Option value={2}>2: Medium</Option>
										<Option value={3}>3: Slow</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</>
				);
			case 'DI':
				return (
					<>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Pin" name={['config', 'pin']} required>
									<Select options={pinOptions} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Invert" name={['config', 'invert']} required>
									<Select options={invertOptions} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Enable (en)" name={['config', 'en']} required>
									<Select options={enableOptions} />
								</Form.Item>
							</Col>
						</Row>
					</>
				);
			case 'DO':
				return (
					<>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Pin" name={['config', 'pin']} required>
									<Select options={pinOptions} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Default Value" name={['config', 'default_val']} required>
									<Select options={doDefaultOptions} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Enable (en)" name={['config', 'en']} required>
									<Select options={enableOptions} />
								</Form.Item>
							</Col>
						</Row>
					</>
				);
			case 'AI':
				return (
					<>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Pin" name={['config', 'pin']} required>
									<Select options={pinOptions} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Unit" name="unit" required>
									<Select options={unitOptions} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Scaler" name={['config', 'scaler']} initialValue={1}>
									<InputNumber style={{ width: '100%' }} step={0.1} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Offset" name={['config', 'offset']} initialValue={0}>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Decimal Place (dp)" name={['config', 'dp']} initialValue={2}>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Sensitivity" name={['config', 'sensitivity']} initialValue={0.1}>
									<InputNumber style={{ width: '100%' }} step={0.1} />
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Enable (en)" name={['config', 'en']} required>
									<Select options={enableOptions} />
								</Form.Item>
							</Col>
						</Row>
					</>
				);
			case 'zigbee':
				return <Text type="secondary">Zigbee configuration will be available soon.</Text>;
			default:
				return <Text type="secondary">No configuration needed for this source type.</Text>;
		}
	};

	const steps = [
		{
			title: 'Basic Info',
			description: 'Define parameter details',
			icon: <InfoCircleOutlined />,
			content: (
				<div>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								label="Select Model"
								name="model_id"
								rules={[{ required: true, message: 'Please select a model' }]}
							>
								<Select
									showSearch
									placeholder="Search and select model"
									optionFilterProp="label"
									options={mockModels.map(model => ({
										value: model.id,
										label: `${model.name} (${model.type})`,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Divider />
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label="Parameter Name" name="name" required>
								<Input placeholder="e.g., Temperature" />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Attribute Name" name="attributeName" required tooltip="Unique identifier">
								<Input placeholder="e.g., temp_01" />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label="Unit" name="unit">
								<Select options={unitOptions} showSearch />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Bit" name="bit">
								<Select options={bitOptions} />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label="Data Type" name="dataType">
								<Select options={dataTypeOptions} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="RW (Read/Write)" name="rw">
								<Select options={rwOptions} />
							</Form.Item>
						</Col>
					</Row>
					{rw === 'rw' && (
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Lower Limit" name="lowerLimit" required>
									<InputNumber style={{ width: '100%' }} placeholder="e.g., 0" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Upper Limit" name="upperLimit" required>
									<InputNumber style={{ width: '100%' }} placeholder="e.g., 100" />
								</Form.Item>
							</Col>
						</Row>
					)}
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label="Source Interface" name="sourceType" required>
								<Select options={sourceOptions} />
							</Form.Item>
						</Col>
					</Row>
					<div style={{ marginTop: 24, textAlign: 'right' }}>
						<Button 
							type="primary" 
							size="large"
							style={{ backgroundColor: '#003A70' }}
							onClick={handleNext}
						>
							Next
						</Button>
					</div>
				</div>
			),
		},
		{
			title: 'Source Config',
			description: 'Configure source interface',
			icon: <SettingOutlined />,
			content: (
				<div>
					<div style={{ background: '#fafafa', padding: 24, borderRadius: 8, marginBottom: 24 }}>
						<Space align="center" style={{ marginBottom: 24 }}>
							<SettingOutlined />
							<Text strong>Configuration for {sourceType?.toUpperCase()}</Text>
						</Space>
						{renderConfigFields()}
					</div>
					<div style={{ marginTop: 24, textAlign: 'right' }}>
						<Button 
							size="large"
							style={{ marginRight: 8 }} 
							onClick={handlePrev}
						>
							Previous
						</Button>
						<Button 
							type="primary" 
							size="large"
							loading={loading}
							style={{ backgroundColor: '#003A70' }}
							onClick={handleSubmit}
						>
							Create Parameter
						</Button>
					</div>
				</div>
			),
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<PlusOutlined /> Supplement Add Parameter
					</Title>
					<Paragraph type="secondary">
						Add a single parameter to an existing model.
					</Paragraph>

					<Steps current={currentStep} style={{ marginBottom: 32 }}>
						{steps.map(item => (
							<Steps.Step key={item.title} title={item.title} description={item.description} icon={item.icon} />
						))}
					</Steps>

					<Form
						form={form}
						layout="vertical"
						initialValues={{
							bit: 99,
							dataType: 'integer',
							rw: 'r',
							sourceType: 'modbus'
						}}
					>
						<div className="steps-content">
							{steps[currentStep].content}
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default AddParameter;
