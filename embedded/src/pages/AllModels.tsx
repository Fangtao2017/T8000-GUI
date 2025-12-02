import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message, Select, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import t8000Icon from '../assets/T8000 outlined.png';

dayjs.extend(relativeTime);

const { Search } = Input;
const { Option } = Select;

interface ModelData {
	key: string;
	model: string;
	type: string;
	brand: string;
	icon: React.ReactNode;
	description: string;
	parameterCount: number;
	parameters: string[];
	createdAt: string;
	updatedAt: string;
	usageCount: number;
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
			model: 'T8000',
			type: 'Gateway',
			brand: 'TCAM',
			icon: t8000Icon,
			description: 'Modbus',
			parameterCount: 0,
			parameters: [],
			createdAt: '2024-01-01',
			updatedAt: '2025-11-20 10:00:00',
			usageCount: 5,
		},
		{
			key: '2',
			model: 'T-AOM-01',
			type: 'Module',
			brand: 'TCAM',
			icon: '🎛️',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Dimmable Light Control'],
			createdAt: '2024-01-02',
			updatedAt: '2025-10-15 14:30:00',
			usageCount: 12,
		},
		{
			key: '3',
			model: 'T-DIM-01',
			type: 'Dimmer',
			brand: 'TCAM',
			icon: '💡',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Dimming Level'],
			createdAt: '2024-01-03',
			updatedAt: '2025-09-01 09:15:00',
			usageCount: 8,
		},
		{
			key: '4',
			model: 'T-OCC-01',
			type: 'Sensor',
			brand: 'TCAM',
			icon: '🚶',
			description: 'Modbus',
			parameterCount: 2,
			parameters: ['Occupancy', 'Lux'],
			createdAt: '2024-01-04',
			updatedAt: '2025-11-24 16:45:00',
			usageCount: 20,
		},
		{
			key: '5',
			model: 'T-FM-01',
			type: 'Meter',
			brand: 'TCAM',
			icon: '💧',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Flow Rate'],
			createdAt: '2024-01-05',
			updatedAt: '2025-08-20 11:20:00',
			usageCount: 3,
		},
		{
			key: '6',
			model: 'T-TK-01',
			type: 'Tank',
			brand: 'TCAM',
			icon: '🛢️',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Level'],
			createdAt: '2024-01-06',
			updatedAt: '2025-07-10 13:00:00',
			usageCount: 0,
		},
		{
			key: '7',
			model: 'T-PP-01',
			type: 'Pump',
			brand: 'TCAM',
			icon: '⛽',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Status'],
			createdAt: '2024-01-07',
			updatedAt: '2025-06-05 15:40:00',
			usageCount: 2,
		},
		{
			key: '8',
			model: 'T-TEM-01',
			type: 'Sensor',
			brand: 'TCAM',
			icon: '🌡️',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Temperature'],
			createdAt: '2024-01-08',
			updatedAt: '2025-11-22 08:30:00',
			usageCount: 15,
		},
		{
			key: '9',
			model: 'T-TEM-02',
			type: 'Sensor',
			brand: 'TCAM',
			icon: '🌡️',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Temperature'],
			createdAt: '2024-01-09',
			updatedAt: '2025-11-10 12:10:00',
			usageCount: 0,
		},
		{
			key: '10',
			model: 'T-EMS-01',
			type: 'Meter',
			brand: 'TCAM',
			icon: '⚡',
			description: 'Modbus',
			parameterCount: 3,
			parameters: ['Voltage', 'Current', 'Power'],
			createdAt: '2024-01-10',
			updatedAt: '2025-10-01 10:00:00',
			usageCount: 7,
		},
		{
			key: '11',
			model: 'T-EMS-02',
			type: 'Meter',
			brand: 'TCAM',
			icon: '⚡',
			description: 'Modbus',
			parameterCount: 3,
			parameters: ['Voltage', 'Current', 'Power'],
			createdAt: '2024-01-11',
			updatedAt: '2025-09-15 14:20:00',
			usageCount: 4,
		},
		{
			key: '12',
			model: 'T-EMS-03',
			type: 'Meter',
			brand: 'TCAM',
			icon: '⚡',
			description: 'Modbus',
			parameterCount: 3,
			parameters: ['Voltage', 'Current', 'Power'],
			createdAt: '2024-01-12',
			updatedAt: '2025-08-05 09:50:00',
			usageCount: 0,
		},
		{
			key: '13',
			model: 'T-ACP-01',
			type: 'Panel',
			brand: 'TCAM',
			icon: '❄️',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Status'],
			createdAt: '2024-01-13',
			updatedAt: '2025-07-20 16:10:00',
			usageCount: 6,
		},
		{
			key: '14',
			model: 'T-AIS-001',
			type: 'Interface',
			brand: 'TCAM',
			icon: '🔌',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Status'],
			createdAt: '2024-01-14',
			updatedAt: '2025-06-30 11:00:00',
			usageCount: 0,
		},
		{
			key: '15',
			model: 'T-FP-001',
			type: 'Alarm',
			brand: 'TCAM',
			icon: '🔥',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Status'],
			createdAt: '2024-01-15',
			updatedAt: '2025-05-15 13:40:00',
			usageCount: 1,
		},
		{
			key: '16',
			model: 'T-DIDO-01',
			type: 'Module',
			brand: 'TCAM',
			icon: '🔌',
			description: 'DI',
			parameterCount: 2,
			parameters: ['Input Status', 'Output Control'],
			createdAt: '2024-01-16',
			updatedAt: '2025-04-10 10:30:00',
			usageCount: 9,
		},
		{
			key: '17',
			model: 'T-AIR-001',
			type: 'Module',
			brand: 'TCAM',
			icon: '📡',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['IR Command'],
			createdAt: '2024-01-17',
			updatedAt: '2025-03-20 15:15:00',
			usageCount: 0,
		},
		{
			key: '18',
			model: 'T-MIU-001',
			type: 'Interface',
			brand: 'TCAM',
			icon: '🔌',
			description: 'Modbus',
			parameterCount: 1,
			parameters: ['Status'],
			createdAt: '2024-01-18',
			updatedAt: '2025-02-15 09:00:00',
			usageCount: 2,
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
			title: 'Usage',
			dataIndex: 'usageCount',
			key: 'usageCount',
			width: 100,
			sorter: (a, b) => a.usageCount - b.usageCount,
			render: (count: number) => (
				<Tag 
					color={count > 0 ? '#003A70' : 'default'} 
					style={count > 0 ? { color: '#fff', borderColor: '#003A70' } : {}}
				>
					{count} Devices
				</Tag>
			),
		},
		{
			title: 'Last Updated',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			width: 150,
			sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
			render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
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
	const inUseModels = models.filter(m => m.usageCount > 0).length;
	const unusedModels = totalModels - inUseModels;
	const noParamModels = models.filter(m => m.parameterCount === 0).length;
	
	// Find latest updated time
	const sortedByDate = [...models].sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf());
	const lastUpdatedTime = sortedByDate.length > 0 ? dayjs(sortedByDate[0].updatedAt).fromNow() : 'N/A';

	const uniqueTypes = Array.from(new Set(models.map(m => m.type))).sort();
	const uniqueBrands = Array.from(new Set(models.map(m => m.brand))).sort();

	return (
		<div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
			<div style={{ width: '100%', maxWidth: 1600, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
				
				{/* Layer 1: Info Bar */}
				<div style={{ 
					backgroundColor: '#fff', 
					border: '1px solid #d9d9d9',
					borderRadius: 8,
					padding: '12px 24px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					gap: 16,
					flexShrink: 0
				}}>
					<Space size={24} style={{ flexWrap: 'wrap' }}>
						<Typography.Text strong style={{ fontSize: 16 }}>Model Statistics</Typography.Text>
						
						<Space split={<Typography.Text type="secondary">|</Typography.Text>} size={16}>
							<Typography.Text>Total Models: <strong>{totalModels}</strong></Typography.Text>
							<Typography.Text>In Use: <strong>{inUseModels}</strong></Typography.Text>
							<Typography.Text>Unused: <strong>{unusedModels}</strong></Typography.Text>
							<Typography.Text>No Parameters: <strong>{noParamModels}</strong></Typography.Text>
						</Space>
					</Space>

					<Typography.Text type="secondary">
						Last Updated: {lastUpdatedTime}
					</Typography.Text>
				</div>

				{/* Layer 2: Toolbar */}
				<Card bordered bodyStyle={{ padding: '16px' }} style={{ flexShrink: 0 }}>
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

				{/* Layer 3: Table */}
				<Card 
					bordered
					style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
					bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				>
					<Table
						columns={columns}
						dataSource={filteredData}
						pagination={false}
						size="small"
						scroll={{ y: 'calc(100vh - 350px)' }}
					/>
				</Card>
			</div>
		</div>
	);
};

export default AllModels;

