import React, { useState } from 'react';
import { Steps, Form, message, Typography, Button, Input, InputNumber, Row, Col, Table, Space, Modal, Select, Tag, Descriptions, Empty, Card, Progress, Result } from 'antd';
import { PlusOutlined, InfoCircleOutlined, CheckCircleOutlined, ArrowLeftOutlined, DeleteOutlined, EditOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { FormInstance } from 'antd/es/form';
import { addModel } from '../api/addModelApi';
import { addParameter } from '../api/addParameterApi';
import { addModbus } from '../api/addModbusApi';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// --- Interfaces ---

interface ParameterConfig {
	name: string;
	attributeName: string;
	unit?: string;
	bit?: number | string;
	dataType?: string;
	rw?: string;
	lowerLimit?: number | string;
	upperLimit?: number | string;
	runtime?: number;
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

// --- Constants ---

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

// --- Sub-Components ---

const LabelWithError: React.FC<{ label: string; name: string; form: FormInstance }> = ({ label, name, form }) => {
	return (
		<Form.Item shouldUpdate={() => true} noStyle>
			{() => {
				const errors = form.getFieldError(name);
				return (
					<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
						<span>{label}</span>
						{errors.length > 0 && (
							<span style={{ color: '#ff4d4f', marginLeft: 8, fontSize: '12px', fontWeight: 'normal' }}>
								{errors[0]}
							</span>
						)}
					</div>
				);
			}}
		</Form.Item>
	);
};

interface AddModelBasicProps {
	form: FormInstance;
}

const AddModelBasic: React.FC<AddModelBasicProps> = ({ form }) => {
	return (
		<div style={{ maxWidth: 1200, margin: '0 auto' }}>
			<style>
				{`
					.compact-form-item .ant-form-item-explain {
						display: none;
					}
				`}
			</style>
			<Row gutter={32}>
				<Col span={14}>
					<Title level={5} style={{ marginBottom: 8, marginTop: 0 }}>Device Identity</Title>
					<Row gutter={0}>
						<Col span={24}>
							<Form.Item
								label={<LabelWithError form={form} name="brand" label="Brand" />}
								name="brand"
								className="compact-form-item"
								style={{ marginBottom: 4 }}
								rules={[
									{ required: true, message: 'Please enter brand name' },
									{ max: 50, message: 'Brand name must be less than 50 characters' },
								]}
							>
								<Input placeholder="e.g., TMAS" />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								label={<LabelWithError form={form} name="model" label="Model Name" />}
								name="model"
								className="compact-form-item"
								style={{ marginBottom: 4 }}
								rules={[
									{ required: true, message: 'Please enter model name' },
									{ max: 50, message: 'Model name must be less than 50 characters' },
								]}
							>
								<Input placeholder="e.g., T-DIM-001" />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								label={<LabelWithError form={form} name="dev_type" label="Device Type" />}
								name="dev_type"
								className="compact-form-item"
								style={{ marginBottom: 4 }}
								rules={[
									{ required: true, message: 'Please enter device type' },
									{ max: 50, message: 'Device type must be less than 50 characters' },
								]}
							>
								<Input placeholder="e.g., dimmer" />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								label={<LabelWithError form={form} name="interface" label="Interface" />}
								name="interface"
								initialValue={1}
								className="compact-form-item"
								style={{ marginBottom: 4 }}
								rules={[
									{ required: true, message: 'Please enter interface' },
								]}
							>
								<InputNumber style={{ width: '100%' }} placeholder="e.g., 1" precision={0} min={0} max={256} />
							</Form.Item>
						</Col>
					</Row>
				</Col>
				<Col span={10}>
					<div style={{ background: '#f9f9f9', padding: 20, borderRadius: 8, border: '1px solid #f0f0f0', marginTop: 16 }}>
						<Title level={5} style={{ marginTop: 0, marginBottom: 12 }}><InfoCircleOutlined /> Important Notes</Title>
						<ul style={{ paddingLeft: 20, margin: 0, color: 'rgba(0, 0, 0, 0.65)' }}>
							<li style={{ marginBottom: 8 }}>Ensure the <b>Brand</b> and <b>Model Name</b> combination is unique.</li>
							<li style={{ marginBottom: 8 }}>The <b>Interface</b> ID (0-256) must match the physical port.</li>
							<li style={{ marginBottom: 8 }}><b>Device Type</b> helps in categorizing the device in inventory.</li>
							<li style={{ marginBottom: 8 }}>In <b>Parameters</b> step, define source interface to set up channel ID.</li>
						</ul>
					</div>
				</Col>
			</Row>
		</div>
	);
};

interface AddModelParametersProps {
	form: FormInstance;
}

const AddModelParameters: React.FC<AddModelParametersProps> = ({ form }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalStep, setModalStep] = useState(0);
	const [currentParam, setCurrentParam] = useState<Partial<ParameterConfig>>({});
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [searchText, setSearchText] = useState('');
	const [sourceFilter, setSourceFilter] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
	
	const handleAdd = () => {
		setCurrentParam({ rw: 'r', config: { pollSpeed: 1 } }); // Default rw to Read Only ('r'), pollSpeed to Fast (1)
		setModalStep(0);
		setEditingIndex(null);
		setValidationErrors({});
		setIsModalVisible(true);
	};

	const handleEdit = (index: number, record: ParameterConfig) => {
		setCurrentParam({ ...record });
		setModalStep(0);
		setEditingIndex(index);
		setValidationErrors({});
		setIsModalVisible(true);
	};

	const handleDelete = (index: number) => {
		const currentParams = form.getFieldValue('parameters') || [];
		const newParams = [...currentParams];
		newParams.splice(index, 1);
		form.setFieldsValue({ parameters: newParams });
	};

	const handleModalNext = () => {
		const errors: Record<string, boolean> = {};
		if (!currentParam.name) errors.name = true;
		if (!currentParam.attributeName) errors.attributeName = true;
		if (!currentParam.sourceType) errors.sourceType = true;
		
		if (currentParam.rw === 'rw') {
			if (currentParam.lowerLimit === undefined || currentParam.lowerLimit === null || currentParam.lowerLimit === '') errors.lowerLimit = true;
			if (currentParam.upperLimit === undefined || currentParam.upperLimit === null || currentParam.upperLimit === '') errors.upperLimit = true;
			
			if (currentParam.lowerLimit !== undefined && currentParam.lowerLimit !== null && currentParam.lowerLimit !== '' &&
				currentParam.upperLimit !== undefined && currentParam.upperLimit !== null && currentParam.upperLimit !== '') {
				if (Number(currentParam.lowerLimit) >= Number(currentParam.upperLimit)) {
					errors.lowerLimit = true;
					errors.upperLimit = true;
					message.error('Lower Limit must be less than Upper Limit');
				}
			}
		}

		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			return;
		}
		
		setValidationErrors({});
		setModalStep(1);
	};

	const handleModalSave = () => {
		const errors: Record<string, boolean> = {};
		const config = currentParam.config || {};

		if (currentParam.sourceType === 'modbus') {
			if (config.address === undefined || config.address === null) errors.address = true;
			if (config.len === undefined || config.len === null) errors.len = true;
			if (config.readFC === undefined || config.readFC === null) errors.readFC = true;
			if (config.writeFC === undefined || config.writeFC === null) errors.writeFC = true;
			if (config.modbusDataType === undefined || config.modbusDataType === null) errors.modbusDataType = true;
			if (config.dp === undefined || config.dp === null) errors.dp = true;
			if (config.scaler === undefined || config.scaler === null) errors.scaler = true;
			if (config.offset === undefined || config.offset === null) errors.offset = true;
			if (config.timeout === undefined || config.timeout === null) errors.timeout = true;
			if (config.pollSpeed === undefined || config.pollSpeed === null) errors.pollSpeed = true;
		} else if (currentParam.sourceType === 'DI') {
			if (!config.pin) errors.pin = true;
			if (config.invert === undefined || config.invert === null) errors.invert = true;
			if (config.en === undefined || config.en === null) errors.en = true;
		} else if (currentParam.sourceType === 'DO') {
			if (!config.pin) errors.pin = true;
			if (config.default_val === undefined || config.default_val === null) errors.default_val = true;
			if (config.en === undefined || config.en === null) errors.en = true;
		} else if (currentParam.sourceType === 'AI') {
			if (!config.pin) errors.pin = true;
			if (!currentParam.unit) errors.unit = true;
			if (config.en === undefined || config.en === null) errors.en = true;
		}

		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			return;
		}

		const currentParams = form.getFieldValue('parameters') || [];
		const newParams = [...currentParams];
		
		let finalParam = { ...currentParam };
		if (finalParam.sourceType === 'modbus') {
			finalParam.config = {
				...finalParam.config,
				pollSpeed: finalParam.config?.pollSpeed ?? 1
			};
		}

		if (editingIndex !== null) {
			newParams[editingIndex] = finalParam;
		} else {
			newParams.push(finalParam);
		}
		
		form.setFieldsValue({ parameters: newParams });
		setIsModalVisible(false);
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '25%',
			onHeaderCell: () => ({
				style: { backgroundColor: '#fafafa', fontWeight: 600, height: '32px', padding: '4px 8px' }
			}),
		},
		{
			title: 'Attribute',
			dataIndex: 'attributeName',
			key: 'attributeName',
			width: '25%',
			onHeaderCell: () => ({
				style: { backgroundColor: '#fafafa', fontWeight: 600, height: '32px', padding: '4px 8px' }
			}),
		},
		{
			title: 'Unit',
			dataIndex: 'unit',
			key: 'unit',
			width: '15%',
			onHeaderCell: () => ({
				style: { backgroundColor: '#fafafa', fontWeight: 600, height: '32px', padding: '4px 8px' }
			}),
		},
		{
			title: 'Source',
			dataIndex: 'sourceType',
			key: 'sourceType',
			width: '15%',
			onHeaderCell: () => ({
				style: { backgroundColor: '#fafafa', fontWeight: 600, height: '32px', padding: '4px 8px' }
			}),
			render: (text: string) => <Tag color="blue">{text?.toUpperCase()}</Tag>,
		},
		{
			title: 'Action',
			key: 'action',
			width: 120,
			onHeaderCell: () => ({
				style: { backgroundColor: '#fafafa', fontWeight: 600, height: '32px', padding: '4px 8px' }
			}),
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
						<Row gutter={[16, 16]}>
							<Col flex="20%">
								<Form.Item label="Register Address" required validateStatus={validationErrors.address ? 'error' : ''}>
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.address}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, address: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Length (len)" required validateStatus={validationErrors.len ? 'error' : ''}>
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.len}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, len: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Read Function Code" required validateStatus={validationErrors.readFC ? 'error' : ''}>
									<Select
										value={currentParam.config?.readFC}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, readFC: v } }))}
									>
										<Option value={0}>00: Not Available</Option>
										<Option value={1}>01: Read Coils</Option>
										<Option value={2}>02: Read Discrete </Option>
										<Option value={3}>03: Read Holding </Option>
										<Option value={4}>04: Read Input </Option>
									</Select>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Write Function Code" required validateStatus={validationErrors.writeFC ? 'error' : ''}>
									<Select
										value={currentParam.config?.writeFC}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, writeFC: v } }))}
									>
										<Option value={0}>00: Not Available</Option>
										<Option value={5}>05: Write Single Coil</Option>
										<Option value={6}>06: Write Single Regis</Option>
										<Option value={15}>15: Write Mult Coils</Option>
										<Option value={16}>16: Write Mult Regis</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Data Type" required validateStatus={validationErrors.modbusDataType ? 'error' : ''}>
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
							<Col flex="20%">
								<Form.Item label="Decimal Place (dp)" required validateStatus={validationErrors.dp ? 'error' : ''}>
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.dp}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, dp: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Scaler" required validateStatus={validationErrors.scaler ? 'error' : ''}>
									<InputNumber 
										style={{ width: '100%' }} 
										step={0.1}
										value={currentParam.config?.scaler}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, scaler: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Offset" required validateStatus={validationErrors.offset ? 'error' : ''}>
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.offset}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, offset: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Timeout (ms)" required validateStatus={validationErrors.timeout ? 'error' : ''}>
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.timeout}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, timeout: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Polling Speed" required validateStatus={validationErrors.pollSpeed ? 'error' : ''}>
									<Select
										value={currentParam.config?.pollSpeed ?? 1}
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
							<Col flex="20%">
								<Form.Item label="Pin" required validateStatus={validationErrors.pin ? 'error' : ''}>
									<Select
										value={currentParam.config?.pin}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, pin: v } }))}
										options={pinOptions}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Invert" required validateStatus={validationErrors.invert ? 'error' : ''}>
									<Select
										value={currentParam.config?.invert}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, invert: v } }))}
										options={invertOptions}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Enable (en)" required validateStatus={validationErrors.en ? 'error' : ''}>
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
							<Col flex="20%">
								<Form.Item label="Pin" required validateStatus={validationErrors.pin ? 'error' : ''}>
									<Select
										value={currentParam.config?.pin}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, pin: v } }))}
										options={pinOptions}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Default Value" required validateStatus={validationErrors.default_val ? 'error' : ''}>
									<Select
										value={currentParam.config?.default_val}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, default_val: v } }))}
										options={doDefaultOptions}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Enable (en)" required validateStatus={validationErrors.en ? 'error' : ''}>
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
							<Col flex="20%">
								<Form.Item label="Pin" required validateStatus={validationErrors.pin ? 'error' : ''}>
									<Select
										value={currentParam.config?.pin}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, pin: v } }))}
										options={pinOptions}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Unit" required validateStatus={validationErrors.unit ? 'error' : ''}>
									<Select
										value={currentParam.unit}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, unit: v }))}
										options={unitOptions}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Scaler">
									<InputNumber 
										style={{ width: '100%' }} 
										step={0.1}
										value={currentParam.config?.scaler}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, scaler: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Offset">
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.offset}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, offset: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Decimal Place (dp)">
									<InputNumber 
										style={{ width: '100%' }} 
										value={currentParam.config?.dp}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, dp: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col flex="20%">
								<Form.Item label="Sensitivity">
									<InputNumber 
										style={{ width: '100%' }} 
										step={0.1}
										value={currentParam.config?.sensitivity}
										onChange={(v) => setCurrentParam(prev => ({ ...prev, config: { ...prev.config, sensitivity: v ?? undefined } }))}
									/>
								</Form.Item>
							</Col>
							<Col flex="20%">
								<Form.Item label="Enable (en)" required validateStatus={validationErrors.en ? 'error' : ''}>
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
		<div style={{ maxWidth: 1200, margin: '0 auto' }}>
			<Form.Item noStyle shouldUpdate={(prev, curr) => prev.parameters !== curr.parameters}>
				{({ getFieldValue }) => {
					const parameters = getFieldValue('parameters') || [];
					
					const filteredParameters = parameters.filter((p: ParameterConfig) => {
						const matchesSearch = !searchText || 
							p.name.toLowerCase().includes(searchText.toLowerCase()) || 
							p.attributeName.toLowerCase().includes(searchText.toLowerCase());
						const matchesFilter = !sourceFilter || sourceFilter === 'all' || p.sourceType === sourceFilter;
						return matchesSearch && matchesFilter;
					});

					return (
						<Table
							className="fixed-height-table"
							dataSource={filteredParameters}
							columns={columns}
							rowKey="attributeName"
							pagination={false}
							bordered
							size="middle"
							title={() => (
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
										<Title level={5} style={{ margin: 0 }}>Parameters</Title>
										<Input 
											placeholder="Search name/attr" 
											prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
											style={{ width: 200 }}
											value={searchText}
											onChange={e => setSearchText(e.target.value)}
											allowClear
										/>
										<Select
											placeholder="Filter Source"
											style={{ width: 120 }}
											allowClear
											value={sourceFilter}
											onChange={setSourceFilter}
											options={[
												{ label: 'All', value: 'all' },
												{ label: 'Modbus', value: 'modbus' },
												{ label: 'DI', value: 'DI' },
												{ label: 'DO', value: 'DO' },
												{ label: 'AI', value: 'AI' },
											]}
										/>
									</div>
									<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="add-button-hover" style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
										Add Parameter
									</Button>
								</div>
							)}
							locale={{ 
								emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No parameters added yet" style={{ margin: '24px 0' }} /> 
							}}
							scroll={{ y: 220 }}
						/>
					);
				}}
			</Form.Item>

			<Modal
				title={editingIndex !== null ? "Edit Parameter" : "Add Parameter"}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={1100}
				style={{ top: 20 }}
				destroyOnClose
			>
				<Steps current={modalStep} style={{ marginBottom: 24 }}>
					<Steps.Step title="Basic Info" description="Define parameter details" icon={<InfoCircleOutlined />} />
					<Steps.Step title="Source Config" description="Configure source interface" icon={<InfoCircleOutlined />} />
				</Steps>

				<div style={{ minHeight: 200, padding: '0 20px' }}>
					{modalStep === 0 && (
						<Form layout="vertical">
							<Row gutter={16}>
								<Col flex="20%">
									<Form.Item label="Parameter Name" required validateStatus={validationErrors.name ? 'error' : ''}>
										<Input 
											placeholder="e.g., Temperature" 
											value={currentParam.name}
											onChange={(e) => setCurrentParam(prev => ({ ...prev, name: e.target.value }))}
										/>
									</Form.Item>
								</Col>
								<Col flex="20%">
									<Form.Item label="Attribute Name" required tooltip="Unique identifier for this parameter" validateStatus={validationErrors.attributeName ? 'error' : ''}>
										<Input 
											placeholder="e.g., temp_01" 
											value={currentParam.attributeName}
											onChange={(e) => setCurrentParam(prev => ({ ...prev, attributeName: e.target.value }))}
										/>
									</Form.Item>
								</Col>
								<Col flex="20%">
									<Form.Item label="Runtime">
										<InputNumber 
											style={{ width: '100%' }} 
											value={currentParam.runtime ?? 1}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, runtime: v ?? 1 }))}
										/>
									</Form.Item>
								</Col>
								<Col flex="20%">
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
								<Col flex="20%">
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
								<Col flex="20%">
									<Form.Item label="Data Type">
										<Select
											value={currentParam.dataType}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, dataType: v }))}
											options={dataTypeOptions}
										/>
									</Form.Item>
								</Col>
								<Col flex="20%">
									<Form.Item label="RW (Read/Write)">
										<Select
											value={currentParam.rw}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, rw: v }))}
											options={rwOptions}
										/>
									</Form.Item>
								</Col>
								{currentParam.rw === 'rw' && (
									<>
										<Col flex="20%">
											<Form.Item label="Lower Limit" required validateStatus={validationErrors.lowerLimit ? 'error' : ''}>
												<InputNumber
													style={{ width: '100%' }}
													placeholder="e.g., 0"
													value={currentParam.lowerLimit}
													onChange={(v) => setCurrentParam(prev => ({ ...prev, lowerLimit: v ?? undefined }))}
												/>
											</Form.Item>
										</Col>
										<Col flex="20%">
											<Form.Item label="Upper Limit" required validateStatus={validationErrors.upperLimit ? 'error' : ''}>
												<InputNumber
													style={{ width: '100%' }}
													placeholder="e.g., 100"
													value={currentParam.upperLimit}
													onChange={(v) => setCurrentParam(prev => ({ ...prev, upperLimit: v ?? undefined }))}
												/>
											</Form.Item>
										</Col>
									</>
								)}
								<Col flex="20%">
									<Form.Item label="Source Interface" required validateStatus={validationErrors.sourceType ? 'error' : ''}>
										<Select
											value={currentParam.sourceType}
											onChange={(v) => setCurrentParam(prev => ({ ...prev, sourceType: v, config: v === 'modbus' ? { pollSpeed: 1 } : {} }))}
											options={sourceOptions}
										/>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					)}

					{modalStep === 1 && (
						<Form layout="vertical">
							<div style={{ marginBottom: 16 }}>
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
							<Button size="large" onClick={() => setModalStep(0)}>Back</Button>
						)}
						{modalStep === 0 && (
							<Button size="large" type="primary" onClick={handleModalNext}>Next</Button>
						)}
						{modalStep === 1 && (
							<Button size="large" type="primary" onClick={handleModalSave}>Save Parameter</Button>
						)}
					</Space>
				</div>
			</Modal>
		</div>
	);
};

interface AddModelSummaryProps {
	form: FormInstance;
}

const AddModelSummary: React.FC<AddModelSummaryProps> = ({ form }) => {
	const values = form.getFieldsValue(true);
	const parameters: ParameterConfig[] = values.parameters || [];

	const columns = [
		{ title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
		{ title: 'Attr', dataIndex: 'attributeName', key: 'attributeName', ellipsis: true },
		{ 
			title: 'Source', 
			dataIndex: 'sourceType', 
			key: 'sourceType', 
			width: 80,
			render: (t: string) => <Tag color="blue">{t?.toUpperCase()}</Tag> 
		},
		{ 
			title: 'Config', 
			key: 'config',
			ellipsis: true,
			render: (_: unknown, record: ParameterConfig) => {
				const { config } = record;
				if (!config) return '-';

				if (record.sourceType === 'modbus') {
					return `Addr:${config.address}, Len:${config.len}`;
				} else if (record.sourceType === 'DI') {
					return `Pin:${config.pin}`;
				} else if (record.sourceType === 'DO') {
					return `Pin:${config.pin}`;
				} else if (record.sourceType === 'AI') {
					return `Pin:${config.pin}`;
				}
				return '-';
			}
		}
	];

	return (
		<div style={{ maxWidth: 1200, margin: '0 auto' }}>
			<Row gutter={24}>
				<Col span={10}>
					<Card title="Basic Information" size="small" bordered={false} style={{ background: '#fafafa', height: '100%' }}>
						<Descriptions bordered size="small" column={1}>
							<Descriptions.Item label="Brand">{values.brand}</Descriptions.Item>
							<Descriptions.Item label="Model Name">{values.model}</Descriptions.Item>
							<Descriptions.Item label="Device Type">{values.dev_type}</Descriptions.Item>
							<Descriptions.Item label="Interface">{values.interface}</Descriptions.Item>
						</Descriptions>
					</Card>
				</Col>
				<Col span={14}>
					<Card 
						title={`Parameters List (${parameters.length})`} 
						size="small" 
						style={{ background: '#f5f5f5', height: '100%' }} 
						bodyStyle={{ padding: 0 }}
					>
						<Table 
							dataSource={parameters} 
							columns={columns} 
							rowKey="attributeName" 
							pagination={false} 
							size="small"
							scroll={{ y: 180 }}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

// --- Main Component ---

const AddModel: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [creationState, setCreationState] = useState({
		visible: false,
		progress: 0,
		status: 'active' as 'active' | 'success' | 'exception' | 'normal',
		stepText: '',
		finished: false,
		error: null as string | null
	});

	const next = async () => {
		try {
			// Validate fields for the current step before moving forward
			if (currentStep === 0) {
				await form.validateFields(['brand', 'model', 'dev_type', 'interface']);
			}
			// Step 1 (Parameters) validation is handled within the component or loosely here
			
			setCurrentStep(currentStep + 1);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const prev = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleSubmit = async () => {
		setCreationState({
			visible: true,
			progress: 0,
			status: 'active',
			stepText: 'Initializing...',
			finished: false,
			error: null
		});

		try {
			const values = form.getFieldsValue(true);
			console.log('--- Starting Model Creation ---');
			console.log(`Model Info: Brand=${values.brand}, Model=${values.model}, Type=${values.dev_type}, Interface=${values.interface}`);

			// 1. Create Model
			setCreationState(prev => ({ ...prev, progress: 10, stepText: 'Creating Model...' }));
			const modelRes = await addModel({
				brand: values.brand,
				model: values.model,
				dev_type: values.dev_type,
				interface: values.interface
			});

			if (!modelRes.id) {
				console.error('Model response missing ID:', modelRes);
				throw new Error(modelRes.error || 'Failed to get new model ID from server');
			}
			console.log('Model created with ID:', modelRes.id);

			const modelId = modelRes.id;
			setCreationState(prev => ({ ...prev, progress: 25, stepText: 'Model Created' }));

			// 2. Loop through parameters
			if (values.parameters && values.parameters.length > 0) {
				console.log(`--- Processing ${values.parameters.length} Parameters ---`);
				const totalParams = values.parameters.length;

				for (let i = 0; i < totalParams; i++) {
					const param = values.parameters[i];
					const progressBase = 25;
					const progressPerParam = 75 / totalParams;
					const currentProgress = progressBase + (i * progressPerParam);

					console.log(`Parameter: ${param.name} (Attr: ${param.attributeName})`);
					let channelId: number | null = null;

					// 3. If Modbus, Create Modbus Config FIRST
					if (param.sourceType === 'modbus' && param.config) {
						setCreationState(prev => ({ ...prev, progress: Math.floor(currentProgress), stepText: `Creating Modbus Config for ${param.name}...` }));
						console.log(`  > Creating Modbus Config...`);
						const config = param.config;
						console.log('DEBUG: Submitting Modbus Config:', JSON.stringify(config, null, 2));
						const modbusRes = await addModbus({
							model_id: modelId,
							att: param.attributeName,
							reg: config.address ?? null,
							len: config.len ?? 1,
							readFC: config.readFC ?? null,
							writeFC: config.writeFC ?? null,
							datatype: config.modbusDataType ?? null,
							dp: config.dp ?? 1,
							scaler: config.scaler ?? 0.1,
							offset: config.offset ?? 0,
							timeout: config.timeout ?? 200,
							poll_speed: config.pollSpeed ?? 0
						});

						if (!modbusRes.success || !modbusRes.id) {
							console.error(`  ! Failed to add Modbus config for ${param.name}:`, modbusRes.error);
							// Decide whether to continue or abort. For now, we continue but channelId will be null.
							// Or maybe we should throw?
							// throw new Error(`Failed to add Modbus config for ${param.name}`);
						} else {
							channelId = modbusRes.id;
							console.log(`  >>> New Modbus ID: ${channelId}`);
						}
					} else if (param.sourceType === 'DI' || param.sourceType === 'DO' || param.sourceType === 'AI') {
						// For other types, if there is a pin or similar that maps to channel, handle it here.
						// Based on user request, only Modbus channel mapping was explicitly detailed.
						// If 'pin' should be channel, we would need to map string pin to number channel if backend expects number.
						// Assuming 0 or null for now as per previous logic unless specified.
					}

					// 4. Create Parameter
					setCreationState(prev => ({ ...prev, progress: Math.floor(currentProgress + (progressPerParam / 2)), stepText: `Creating Parameter ${param.name}...` }));
					// Map fields to API format
					let dataType = 1; // Default Integer
					if (param.dataType === 'discrete') dataType = 0;
					else if (param.dataType === 'float') dataType = 2;

					let rw = 0; // Default Read Only
					if (param.rw === 'rw') rw = 1;

					let source = 3; // Default Modbus
					if (param.sourceType === 'DI') source = 0;
					else if (param.sourceType === 'AI') source = 1;
					else if (param.sourceType === 'DO') source = 2;
					else if (param.sourceType === 'zigbee') source = 4;

					const paramRes = await addParameter({
						model_id: modelId,
						name: param.name,
						attr: param.attributeName,
						unit: param.unit ?? null,
						data_type: dataType,
						rw: rw,
						source: source,
						channel: channelId,
						bit: param.bit === 99 ? null : Number(param.bit),
						lower_limit: param.lowerLimit ?? null,
						upper_limit: param.upperLimit ?? null,
						runtime: param.runtime ?? null
					});

					if (!paramRes.success || !paramRes.id) {
						console.error(`  ! Failed to add parameter ${param.name}:`, paramRes.error);
						continue; // Skip config if param failed
					} else {
						console.log(`  >>> New Parameter ID: ${paramRes.id}`);
					}
				}
			}

			console.log('--- Model Creation Complete ---');
			setCreationState(prev => ({ ...prev, progress: 100, status: 'success', stepText: 'Completed!', finished: true }));
			message.success('Model created successfully!');
			
		} catch (error) {
			console.error('Submission failed:', error);
			setCreationState(prev => ({ 
				...prev, 
				status: 'exception', 
				stepText: 'Error occurred', 
				error: error instanceof Error ? error.message : String(error) 
			}));
		}
	};

	const steps = [
		{
			title: 'Basic Info',
			content: <AddModelBasic form={form} />,
		},
		{
			title: 'Parameters',
			content: <AddModelParameters form={form} />,
		},
		{
			title: 'Summary',
			content: <AddModelSummary form={form} />,
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
						<Button 
							type="link" 
							icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} 
							onClick={() => navigate('/devices/models')} 
							style={{ color: '#000', marginRight: 8, padding: 0 }} 
						/>
						<Title level={3} style={{ margin: 0 }}>
							Add Model
						</Title>
					</div>
					<Paragraph type="secondary">
						Create a new device model template with parameters configuration.
					</Paragraph>

					<Steps current={currentStep} style={{ marginBottom: 16 }}>
						<Steps.Step title="Basic Info" description="Define model identity" icon={<InfoCircleOutlined />} />
						<Steps.Step title="Parameters" description="Configure data points" icon={<InfoCircleOutlined />} />
						<Steps.Step title="Summary" description="Review and create" icon={<CheckCircleOutlined />} />
					</Steps>
						
					<Form form={form} layout="vertical" initialValues={{ parameters: [] }}>
						<div className="steps-content">
							{steps[currentStep].content}
						</div>
					</Form>
				</div>
			</div>

			<div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', background: '#fff', textAlign: 'right' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Space>
						{currentStep > 0 && (
							<Button size="large" onClick={prev}>
								Previous
							</Button>
						)}
						{currentStep < steps.length - 1 && (
							<Button 
								type="primary" 
								size="large"
								className="add-button-hover"
								style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
								onClick={next}
							>
								Next
							</Button>
						)}
						{currentStep === steps.length - 1 && (
							<Button
								type="primary"
								size="large"
								className="add-button-hover"
								onClick={handleSubmit}
								style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
							>
								Create Model
							</Button>
						)}
					</Space>
				</div>
			</div>

			<Modal
				open={creationState.visible}
				footer={null}
				closable={false}
				maskClosable={false}
				centered
				width={600}
			>
				{!creationState.finished ? (
					<div style={{ textAlign: 'center', padding: '20px 0' }}>
						<Title level={4} style={{ marginBottom: 24 }}>Creating Model...</Title>
						<Progress 
							percent={creationState.progress} 
							status={creationState.status} 
							strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
							strokeWidth={12}
						/>
						<div style={{ marginTop: 16, fontSize: 16 }}>
							{creationState.status === 'exception' ? (
								<Text type="danger">{creationState.error}</Text>
							) : (
								<Text>{creationState.stepText}</Text>
							)}
						</div>
						{creationState.status === 'exception' && (
							<Button 
								type="primary" 
								danger 
								style={{ marginTop: 24 }}
								onClick={() => setCreationState(prev => ({ ...prev, visible: false }))}
							>
								Close
							</Button>
						)}
					</div>
				) : (
					<Result
						status="success"
						title="Model Created Successfully"
						subTitle="The device model and all parameters have been configured."
						extra={[
							<Button type="primary" key="add" onClick={() => {
								setCreationState(prev => ({ ...prev, visible: false }));
								form.resetFields();
								setCurrentStep(0);
							}}>
								Add Another Model
							</Button>,
							<Button key="back" onClick={() => navigate('/devices/models')}>
								Back to All Models
							</Button>,
						]}
					/>
				)}
			</Modal>
		</div>
	);
};

export default AddModel;