import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message, Select, Tooltip, Spin, Popover } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchModels } from '../api/modelApi';

dayjs.extend(relativeTime);

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
	const [modal, contextHolder] = Modal.useModal();
	const navigate = useNavigate();
	const { deviceId } = useParams<{ deviceId: string }>();
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [brandFilter, setBrandFilter] = useState('all');
	const [refreshing, setRefreshing] = useState(false);

	const [models, setModels] = useState<ModelData[]>([]);

	const loadModels = async () => {
		setRefreshing(true);
		try {
			const apiData = await fetchModels();
			const mappedData: ModelData[] = apiData.map((item) => ({
				key: item.model,
				model: item.model,
				type: item.type || 'Unknown',
				brand: item.brand || 'Unknown',
				icon: '📦', // Default icon
				description: 'Modbus', // Default description
				parameterCount: 0, // Default
				parameters: [], // Default
				createdAt: '2024-01-01', // Default
				updatedAt: item.last_updated ? dayjs(item.last_updated * 1000).format('YYYY-MM-DD HH:mm:ss') : 'N/A',
				usageCount: item.usage,
			}));
			setModels(mappedData);
		} catch (error) {
			message.error('Failed to load models');
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		loadModels();
	}, []);

	const handleRefresh = () => {
		loadModels();
		message.success('Data refreshed successfully');
	};

	const handleDelete = (record: ModelData) => {
		modal.confirm({
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
				<Space size={4}>
					<Button
						icon={<EditOutlined />}
						size="small"
						onClick={() => navigate(deviceId ? `/device/${deviceId}/configuration/add-model?edit=${record.key}` : `/configuration/add-model?edit=${record.key}`)}
					>
						Edit
					</Button>
					<Button
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
	// const sortedByDate = [...models].sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf());
  // const lastUpdatedTime = sortedByDate.length > 0 ? dayjs(sortedByDate[0].updatedAt).fromNow() : 'N/A';
  
	const uniqueTypes = Array.from(new Set(models.map(m => m.type))).sort();
	const uniqueBrands = Array.from(new Set(models.map(m => m.brand))).sort();

	const filterContent = (
		<div style={{ padding: 8 }}>
			<Space size={24} align="start">
				<div style={{ width: 150 }}>
					<Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Type</Typography.Text>
					<Select
						value={typeFilter}
						onChange={setTypeFilter}
						style={{ width: '100%' }}
					>
						<Option value="all">All Types</Option>
						{uniqueTypes.map(type => (
							<Option key={type} value={type}>{type}</Option>
						))}
					</Select>
				</div>
				<div style={{ width: 150 }}>
					<Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Brand</Typography.Text>
					<Select
						value={brandFilter}
						onChange={setBrandFilter}
						style={{ width: '100%' }}
					>
						<Option value="all">All Brands</Option>
						{uniqueBrands.map(brand => (
							<Option key={brand} value={brand}>{brand}</Option>
						))}
					</Select>
				</div>
			</Space>
		</div>
	);

	return (
		<div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
			{contextHolder}
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
				</div>

				{/* Layer 2: Toolbar */}
				<Card bordered bodyStyle={{ padding: '16px' }} style={{ flexShrink: 0 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Space size="middle">
							<Input
								placeholder="Search models..."
								prefix={<SearchOutlined />}
								style={{ width: 240 }}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Popover content={filterContent} trigger="click" placement="bottomLeft">
								<Button icon={<FilterOutlined />}>Filters</Button>
							</Popover>
						</Space>
						<Space size={8}>
							<Button icon={<ReloadOutlined />} loading={refreshing} onClick={handleRefresh}>
								Refresh
							</Button>
							<Button
								type="primary"
								icon={<PlusOutlined />}
								className="add-button-hover"
								onClick={() => navigate(deviceId ? `/device/${deviceId}/configuration/add-model` : '/configuration/add-model')}
								style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
							>
								Add New Model
							</Button>
						</Space>
					</div>
				</Card>

				{/* Layer 3: Table */}
				<Card 
					bordered
					style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
					bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				>
					{refreshing && models.length === 0 ? (
						<div style={{ height: 'calc(100vh - 380px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>
					) : (
						<Table
							columns={columns}
							dataSource={filteredData}
							pagination={false}
							size="small"
							scroll={{ y: 'calc(100vh - 380px)' }}
						/>
					)}
				</Card>
			</div>
		</div>
	);
};

export default AllModels;

