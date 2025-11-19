import React, { useState } from 'react';
import { Form, Button, Table, Space, Modal, Typography, Steps, Input, Select, InputNumber, Tag, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

const { Title, Text } = Typography;
const { Option } = Select;

interface AddModelParametersProps {
	form: FormInstance;
}

interface ParameterConfig {
	name: string;
	attributeName: string;
	unit?: string;
	bit?: number | string;
	dataType?: string;
	rw?: string;
	lowerLimit?: number | string;
	upperLimit?: number | string;
	sourceType: string;
	config: {
		address?: number;
		readFC?: number;
		writeFC?: number;
		len?: number;
		modbusDataType?: number;
		scaler?: number;
		offset?: number;
		dp?: number;
		timeout?: number;
		pollSpeed?: number;
		topic?: string;
		jsonPath?: string;
		pin?: string;
		invert?: number;
		en?: number;
		default_val?: number;
		sensitivity?: number;
		[key: string]: unknown;
	};
}

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

const AddModelParameters: React.FC<AddModelParametersProps> = ({ form }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalStep, setModalStep] = useState(0);
	const [currentParam, setCurrentParam] = useState<Partial<ParameterConfig>>({});
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	
	const handleAdd = () => {
		setCurrentParam({ sourceType: 'modbus', bit: 99, dataType: 'integer', rw: 'r' }); // Default
		setModalStep(0);
		setEditingIndex(null);
		setIsModalVisible(true);
	};

	const handleEdit = (index: number, record: ParameterConfig) => {
		setCurrentParam({ ...record });
		setModalStep(0);
		setEditingIndex(index);
		setIsModalVisible(true);
	};

	const handleDelete = (index: number) => {
		const currentParams = form.getFieldValue('parameters') || [];
		const newParams = [...currentParams];
		newParams.splice(index, 1);
		form.setFieldsValue({ parameters: newParams });
	};

	const handleModalNext = () => {
		// Basic validation for step 0
		if (!currentParam.name || !currentParam.attributeName || !currentParam.sourceType) {
			return; // Should add proper validation feedback
		}
		setModalStep(1);
	};

	const handleModalSave = () => {
		const currentParams = form.getFieldValue('parameters') || [];
		const newParams = [...currentParams];
		
		if (editingIndex !== null) {
			newParams[editingIndex] = currentParam;
		} else {
			newParams.push(currentParam);
		}
		
		form.setFieldsValue({ parameters: newParams });
		setIsModalVisible(false);
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Attribute',
			dataIndex: 'attributeName',
			key: 'attributeName',
		},
		{
			title: 'Unit',
			dataIndex: 'unit',
			key: 'unit',
		},
		{
			title: 'Source',
			dataIndex: 'sourceType',
			key: 'sourceType',
			render: (text: string) => <Tag color="blue">{text?.toUpperCase()}</Tag>,
		},
		{
			title: 'Action',
			key: 'action',
			render: (_: unknown, record: ParameterConfig, index: number) => (
				<Space>
					<Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(index, record)} />
					<Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(index)} />
				</Space>
			),
		},
	];

	// Render the configuration fields based on source type
	const renderConfigFields = () => {
		switch (currentParam.sourceType) {
			case 'modbus':
				return (
					<>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Register Address" required>
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.address}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, address: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Length (len)" required>
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.len ?? 1}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, len: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Read Function Code (readFC)" required>
									<Select
										value={currentParam.config?.readFC}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, readFC: v } }))}
									>
										<Option value={0}>00: Not Available</Option>
										<Option value={1}>01: Read Coils</Option>
										<Option value={2}>02: Read Discrete Inputs</Option>
										<Option value={3}>03: Read Holding Registers</Option>
										<Option value={4}>04: Read Input Registers</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Write Function Code (writeFC)" required>
									<Select
										value={currentParam.config?.writeFC}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, writeFC: v } }))}
									>
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
								<Form.Item label="Data Type (datatype)" required>
									<Select
										value={currentParam.config?.modbusDataType}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, modbusDataType: v } }))}
									>
										<Option value={1}>1: Int</Option>
										<Option value={2}>2: Discrete</Option>
										<Option value={3}>3: Float</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Decimal Place (dp)">
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.dp ?? 1}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, dp: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Scaler">
									<InputNumber 
										style={{ width: '100%' }} 
										step={0.1}
										value={currentParam.config?.scaler ?? 0.1}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, scaler: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Offset">
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.offset ?? 0}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, offset: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Timeout (ms)">
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.timeout ?? 200}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, timeout: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Polling Speed">
									<Select
										value={currentParam.config?.pollSpeed}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, pollSpeed: v } }))}
									>
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
								<Form.Item label="Pin" required>
									<Select
										value={currentParam.config?.pin}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, pin: v } }))}
										options={pinOptions}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Invert" required>
									<Select
										value={currentParam.config?.invert}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, invert: v } }))}
										options={invertOptions}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Enable (en)" required>
									<Select
										value={currentParam.config?.en}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, en: v } }))}
										options={enableOptions}
									/>
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
								<Form.Item label="Pin" required>
									<Select
										value={currentParam.config?.pin}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, pin: v } }))}
										options={pinOptions}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Default Value" required>
									<Select
										value={currentParam.config?.default_val}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, default_val: v } }))}
										options={doDefaultOptions}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Enable (en)" required>
									<Select
										value={currentParam.config?.en}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, en: v } }))}
										options={enableOptions}
									/>
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
								<Form.Item label="Pin" required>
									<Select
										value={currentParam.config?.pin}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, pin: v } }))}
										options={pinOptions}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Unit" required>
									<Select
										value={currentParam.unit}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, unit: v }))}
										options={unitOptions}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Scaler">
									<InputNumber 
										style={{ width: '100%' }} 
										step={0.1}
										value={currentParam.config?.scaler ?? 1}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, scaler: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Offset">
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.offset ?? 0}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, offset: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Decimal Place (dp)">
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.dp ?? 2}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, dp: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Sensitivity">
									<InputNumber 
										style={{ width: '100%' }} 
										step={0.1}
										value={currentParam.config?.sensitivity ?? 0.1}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, sensitivity: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label="Enable (en)" required>
									<Select
										value={currentParam.config?.en}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, en: v } }))}
										options={enableOptions}
									/>
								</Form.Item>
							</Col>
						</Row>
					</>
				);
			case 'zigbee':
				return (
					<Text type="secondary">Zigbee configuration will be available soon.</Text>
				);
			default:
				return <Text type="secondary">No configuration needed for this source type.</Text>;
		}
	};

	return (
		<div style={{ maxWidth: 1000, margin: '0 auto' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<div>
					<Title level={4}>Step 2: Define Parameters</Title>
					<Text type="secondary">Add parameters and configure their data sources.</Text>
				</div>
				<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ backgroundColor: '#003A70' }}>
					Add Parameter
				</Button>
			</div>

			<Form.Item noStyle shouldUpdate={(prev, curr) => prev.parameters !== curr.parameters}>
				{({ getFieldValue }) => {
					const parameters = getFieldValue('parameters') || [];
					return (
						<Table
							dataSource={parameters}
							columns={columns}
							rowKey="attributeName"
							pagination={false}
							locale={{ emptyText: 'No parameters added yet. Click "Add Parameter" to start.' }}
						/>
					);
				}}
			</Form.Item>

			<Modal
				title={editingIndex !== null ? "Edit Parameter" : "Add Parameter"}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={800}
				destroyOnClose
			>
				<Steps current={modalStep} style={{ marginBottom: 24 }}>
					<Steps.Step title="Basic Info" description="Define parameter details" icon={<InfoCircleOutlined />} />
					<Steps.Step title="Source Config" description="Configure source interface" icon={<InfoCircleOutlined />} />
				</Steps>

				<div style={{ minHeight: 200 }}>
					{modalStep === 0 && (
						<Form layout="vertical">
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item label="Parameter Name" required>
										<Input 
											placeholder="e.g., Temperature" 
											value={currentParam.name}
											onChange={(e) => setCurrentParam(prev => ({ ...prev, name: e.target.value }))}
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Attribute Name" required tooltip="Unique identifier for this parameter">
										<Input 
											placeholder="e.g., temp_01" 
											value={currentParam.attributeName}
											onChange={(e) => setCurrentParam(prev => ({ ...prev, attributeName: e.target.value }))}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item label="Unit">
										<Select
											placeholder="Select Unit"
											value={currentParam.unit}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, unit: v }))}
											options={unitOptions}
											showSearch
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Bit">
										<Select
											value={currentParam.bit}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, bit: v }))}
											options={bitOptions}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item label="Data Type">
										<Select
											value={currentParam.dataType}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, dataType: v }))}
											options={dataTypeOptions}
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="RW (Read/Write)">
										<Select
											value={currentParam.rw}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, rw: v }))}
											options={rwOptions}
										/>
									</Form.Item>
								</Col>
							</Row>
							{currentParam.rw === 'rw' && (
								<Row gutter={16}>
									<Col span={12}>
										<Form.Item label="Lower Limit" required>
											<InputNumber
												style={{ width: '100%' }}
												placeholder="e.g., 0"
												value={currentParam.lowerLimit}
												onChange={(v) => setCurrentParam(prev => ({ ...prev, lowerLimit: v ?? undefined }))}
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label="Upper Limit" required>
											<InputNumber
												style={{ width: '100%' }}
												placeholder="e.g., 100"
												value={currentParam.upperLimit}
												onChange={(v) => setCurrentParam(prev => ({ ...prev, upperLimit: v ?? undefined }))}
											/>
										</Form.Item>
									</Col>
								</Row>
							)}
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item label="Source Interface" required>
										<Select
											value={currentParam.sourceType}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, sourceType: v, config: {} }))}
											options={sourceOptions}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					)}

					{modalStep === 1 && (
						<Form layout="vertical">
							<div style={{ background: '#fafafa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
								<Space align="center" style={{ marginBottom: 16 }}>
									<SettingOutlined />
									<Text strong>Configuration for {currentParam.sourceType?.toUpperCase()}</Text>
								</Space>
								{renderConfigFields()}
							</div>
						</Form>
					)}
				</div>

				<div style={{ textAlign: 'right', marginTop: 24 }}>
					<Space>
						{modalStep > 0 && (
							<Button onClick={() => setModalStep(0)}>Back</Button>
						)}
						{modalStep === 0 && (
							<Button type="primary" onClick={handleModalNext}>Next</Button>
						)}
						{modalStep === 1 && (
							<Button type="primary" onClick={handleModalSave}>Save Parameter</Button>
						)}
					</Space>
				</div>
			</Modal>
		</div>
	);
};

export default AddModelParameters;
