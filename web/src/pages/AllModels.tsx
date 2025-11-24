import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message, Row, Col, Select, Tooltip, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface ModelData {
	key: string;
	model: string;
	type: string;
	brand: string;
	icon: string;
	description: string;
	parameterCount: number;
	parameters: string[];
	createdAt: string;
}

const AllModels: React.FC = () => {
	const navigate = useNavigate();
	const { deviceId } = useParams<{ deviceId: string }>();
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [brandFilter, setBrandFilter] = useState('all');
	const [refreshing, setRefreshing] = useState(false);

	// Mock data
	const [models] = useState<ModelData[]>([
		{
			key: '1',
			model: 'T-OXM-001',
			type: 'Sensor',
			brand: 'TMAS',
			icon: '📡',
			description: 'Modbus',
			parameterCount: 4,
			parameters: ['Occupancy', 'Light Level', 'Temperature', 'Humidity'],
			createdAt: '2024-01-15',
		},
		{
			key: '2',
			model: 'T-TEMP-01',
			type: 'Sensor',
			brand: 'TMAS',
			icon: '🌡️',
			description: 'AI',
			parameterCount: 3,
			parameters: ['Temperature', 'Status', 'Battery'],
			createdAt: '2024-01-20',
		},
		{
			key: '3',
			model: 'T-HUM-001',
			type: 'Sensor',
			brand: 'TMAS',
			icon: '💧',
			description: 'Modbus',
			parameterCount: 2,
			parameters: ['Humidity', 'Dew Point'],
			createdAt: '2024-02-01',
		},
		{
			key: '4',
			model: 'T-DIM-001',
			type: 'Dimmer',
			brand: 'TMAS',
			icon: '💡',
			description: 'DO',
			parameterCount: 4,
			parameters: ['Brightness', 'Power', 'Fade Rate', 'Current'],
			createdAt: '2024-02-05',
		},
		{
			key: '5',
			model: 'T-PM-001',
			type: 'Panel',
			brand: 'TMAS',
			icon: '❄️',
			description: 'Modbus',
			parameterCount: 5,
			parameters: ['Temperature', 'Setpoint', 'Fan Speed', 'Mode', 'Power'],
			createdAt: '2024-02-10',
		},
		{
			key: '6',
			model: 'T-RELAY-001',
			type: 'Relay',
			brand: 'TMAS',
			icon: '🔌',
			description: 'DO',
			parameterCount: 4,
			parameters: ['State', 'Mode', 'Delay', 'Fault'],
			createdAt: '2024-02-15',
		},
		{
			key: '7',
			model: 'T-SMOKE-001',
			type: 'Detector',
			brand: 'TMAS',
			icon: '🔥',
			description: 'DI',
			parameterCount: 4,
			parameters: ['Smoke Level', 'Alarm', 'Battery', 'Test'],
			createdAt: '2024-02-20',
		},
		{
			key: '8',
			model: 'T-PRESS-001',
			type: 'Sensor',
			brand: 'TMAS',
			icon: '🔧',
			description: 'AI',
			parameterCount: 4,
			parameters: ['Pressure', 'Temperature', 'Max', 'Min'],
			createdAt: '2024-02-25',
		},
		{
			key: '9',
			model: 'T-VALVE-001',
			type: 'Valve',
			brand: 'TMAS',
			icon: '🚰',
			description: 'DO',
			parameterCount: 4,
			parameters: ['Position', 'Flow', 'Mode', 'Status'],
			createdAt: '2024-03-01',
		},
		{
			key: '10',
			model: 'T-DOOR-001',
			type: 'Sensor',
			brand: 'TMAS',
			icon: '🚪',
			description: 'DI',
			parameterCount: 4,
			parameters: ['State', 'Count', 'Tamper', 'Battery'],
			createdAt: '2024-03-05',
		},
	]);

	const handleRefresh = () => {
		setRefreshing(true);
		message.success('Data refreshed successfully');
		setTimeout(() => setRefreshing(false), 1000);
	};

	const handleDelete = (record: ModelData) => {
		Modal.confirm({
			title: 'Delete Model',
			content: `Are you sure you want to delete model "${record.model}"? This action cannot be undone.`,
			okText: 'Delete',
			okType: 'danger',
			onOk: () => {
				message.success(`Model "${record.model}" deleted successfully`);
			},
		});
	};

	const columns: ColumnsType<ModelData> = [
		{
			title: 'Icon',
			dataIndex: 'icon',
			key: 'icon',
			width: 60,
			render: (icon: string) => <span style={{ fontSize: 24 }}>{icon}</span>,
		},
		{
			title: 'Model',
			dataIndex: 'model',
			key: 'model',
			sorter: (a, b) => a.model.localeCompare(b.model),
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => (
				<Tag color="default">{type}</Tag>
			),
		},
		{
			title: 'Brand',
			dataIndex: 'brand',
			key: 'brand',
		},
		{
			title: 'Hardware Interface',
			dataIndex: 'description',
			key: 'description',
			render: (text: string) => <Tag>{text}</Tag>,
		},
		{
			title: 'Parameters',
			dataIndex: 'parameterCount',
			key: 'parameterCount',
			width: 120,
			sorter: (a, b) => a.parameterCount - b.parameterCount,
			render: (count: number, record: ModelData) => (
				<Tooltip 
					title={
						<div style={{ fontSize: 12 }}>
							<div style={{ marginBottom: 4, fontWeight: 600 }}>Parameters:</div>
							<ul style={{ paddingLeft: 16, margin: 0 }}>
								{record.parameters.map((p, i) => <li key={i}>{p}</li>)}
							</ul>
						</div>
					}
					placement="top"
				>
					<Tag style={{ cursor: 'help' }}>{count}</Tag>
				</Tooltip>
			),
		},
		{
			title: 'Created Date',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: 120,
			sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
		},
		{
			title: 'Action',
			key: 'action',
			width: 180,
			fixed: 'right',
			render: (_, record) => (
				<Space size="middle">
					<Button
						type="link"
						icon={<EditOutlined />}
						size="small"
						onClick={() => navigate(deviceId ? `/device/${deviceId}/configuration/add-model?edit=${record.key}` : `/configuration/add-model?edit=${record.key}`)}
						style={{ color: '#003A70' }}
					>
						Edit
					</Button>
					<Button
						type="link"
						danger
						icon={<DeleteOutlined />}
						size="small"
						onClick={() => handleDelete(record)}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	const filteredData = models.filter((item) => {
		const matchesSearch = item.model.toLowerCase().includes(searchText.toLowerCase()) ||
			item.type.toLowerCase().includes(searchText.toLowerCase()) ||
			item.brand.toLowerCase().includes(searchText.toLowerCase()) ||
			item.description.toLowerCase().includes(searchText.toLowerCase());
		const matchesType = typeFilter === 'all' || item.type === typeFilter;
		const matchesBrand = brandFilter === 'all' || item.brand === brandFilter;
		return matchesSearch && matchesType && matchesBrand;
	});

	// Statistics
	const totalModels = models.length;
	const uniqueTypes = Array.from(new Set(models.map(m => m.type))).sort();
	const uniqueBrands = Array.from(new Set(models.map(m => m.brand))).sort();

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
			{/* Statistics Cards */}
			<Row gutter={16}>
				<Col span={8}>
					<Card bordered bodyStyle={{ padding: '20px 16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Total Models</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0 }}>{totalModels}</Typography.Title>
							<Progress percent={100} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
				<Col span={16}>
					<Card bordered bodyStyle={{ padding: '20px 16px' }}>
						<Row gutter={16} style={{ height: '100%' }} align="middle">
							<Col span={12}>
								<Space direction="vertical" size={4} style={{ width: '100%' }}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Sensors</Typography.Text>
									<Typography.Title level={2} style={{ margin: 0, color: '#1890ff' }}>
										{models.filter(m => m.type === 'Sensor').length}
									</Typography.Title>
									<Progress 
										percent={totalModels > 0 ? (models.filter(m => m.type === 'Sensor').length / totalModels) * 100 : 0} 
										showInfo={false} 
										strokeColor="#1890ff" 
									/>
								</Space>
							</Col>
							<Col span={12}>
								<Space direction="vertical" size={4} style={{ width: '100%' }}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Others</Typography.Text>
									<Typography.Title level={2} style={{ margin: 0, color: '#faad14' }}>
										{totalModels - models.filter(m => m.type === 'Sensor').length}
									</Typography.Title>
									<Progress 
										percent={totalModels > 0 ? ((totalModels - models.filter(m => m.type === 'Sensor').length) / totalModels) * 100 : 0} 
										showInfo={false} 
										strokeColor="#faad14" 
									/>
								</Space>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>

			{/* Search and Filter Bar */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Search
							placeholder="Search models..."
							allowClear
							style={{ width: 240 }}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						<Select
							value={typeFilter}
							onChange={setTypeFilter}
							style={{ width: 140 }}
							suffixIcon={<FilterOutlined />}
						>
							<Option value="all">All Types</Option>
							{uniqueTypes.map(type => (
								<Option key={type} value={type}>{type}</Option>
							))}
						</Select>
						<Select
							value={brandFilter}
							onChange={setBrandFilter}
							style={{ width: 140 }}
							suffixIcon={<FilterOutlined />}
						>
							<Option value="all">All Brands</Option>
							{uniqueBrands.map(brand => (
								<Option key={brand} value={brand}>{brand}</Option>
							))}
						</Select>
						<Typography.Text type="secondary" style={{ fontSize: 12, alignSelf: 'center' }}>
							{filteredData.length} of {totalModels} models
						</Typography.Text>
					</Space>
					<Space size={8}>
						<Button icon={<ReloadOutlined />} loading={refreshing} onClick={handleRefresh}>
							Refresh
						</Button>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => navigate(deviceId ? `/device/${deviceId}/configuration/add-model` : '/configuration/add-model')}
							style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
						>
							Add New Model
						</Button>
					</Space>
				</Space>
			</Card>

			{/* Models Table */}
			<Card 
				title={`All Models (${filteredData.length})`}
				bordered
				style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<div style={{ flex: 1, overflow: 'hidden' }}>
					<Table
						columns={columns}
						dataSource={filteredData}
						pagination={false}
						size="small"
						scroll={{ y: 'calc(100vh - 450px)' }}
					/>
				</div>
			</Card>
		</div>
	);
};

export default AllModels;
