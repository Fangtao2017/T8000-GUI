import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Option } = Select;
const { Search } = Input;

interface ParameterData {
	key: string;
	name: string;
	device: string;
	dataType: string;
	unit: string;
	access: string;
	sourceInterface: string;
	bit: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

const AllParameters: React.FC = () => {
	const navigate = useNavigate();
	const { deviceId } = useParams<{ deviceId: string }>();
	const [searchText, setSearchText] = useState('');
	const [filterAccess, setFilterAccess] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);

	// Mock data
	const [parameters] = useState<ParameterData[]>([
		{
			key: '1',
			name: 'Occupancy',
			device: 'T-OCC-01',
			dataType: 'Boolean',
			unit: '-',
			access: 'Read Only',
			sourceInterface: 'DI',
			bit: '0',
			description: 'Room occupancy status',
			createdAt: '2024-01-15',
			updatedAt: '2025-11-25 10:00:00',
		},
		{
			key: '2',
			name: 'Light Level',
			device: 'T-OCC-01',
			dataType: 'Integer',
			unit: 'lux',
			access: 'Read Only',
			sourceInterface: 'AI',
			bit: '99',
			description: 'Ambient light level',
			createdAt: '2024-01-15',
			updatedAt: '2025-11-24 14:30:00',
		},
		{
			key: '3',
			name: 'Temperature',
			device: 'T-TEM-01',
			dataType: 'Float',
			unit: '°C',
			access: 'Read Only',
			sourceInterface: 'Modbus',
			bit: '99',
			description: 'Current temperature',
			createdAt: '2024-01-20',
			updatedAt: '2025-11-23 09:15:00',
		},
		{
			key: '4',
			name: 'Temperature Setpoint',
			device: 'T-TEM-01',
			dataType: 'Float',
			unit: '°C',
			access: 'Read/Write',
			sourceInterface: 'Modbus',
			bit: '99',
			description: 'Target temperature setpoint',
			createdAt: '2024-01-20',
			updatedAt: '2025-11-22 16:45:00',
		},
		{
			key: '5',
			name: 'Humidity',
			device: 'T-OCC-01',
			dataType: 'Float',
			unit: '%',
			access: 'Read Only',
			sourceInterface: 'AI',
			bit: '99',
			description: 'Relative humidity',
			createdAt: '2024-02-01',
			updatedAt: '2025-11-21 11:20:00',
		},
		{
			key: '6',
			name: 'Fan Status',
			device: 'T-FAN-01',
			dataType: 'Boolean',
			unit: '-',
			access: 'Read Only',
			sourceInterface: 'DI',
			bit: '1',
			description: '', // Missing description
			createdAt: '2024-02-05',
			updatedAt: '2025-11-20 13:00:00',
		},
	]);

	const handleRefresh = () => {
		setRefreshing(true);
		message.success('Data refreshed successfully');
		setTimeout(() => setRefreshing(false), 1000);
	};

	const handleDelete = (record: ParameterData) => {
		Modal.confirm({
			title: 'Delete Parameter',
			content: `Are you sure you want to delete parameter "${record.name}"? This action cannot be undone.`,
			okText: 'Delete',
			okType: 'danger',
			onOk: () => {
				message.success(`Parameter "${record.name}" deleted successfully`);
			},
		});
	};

	const columns: ColumnsType<ParameterData> = [
		{
			title: 'Parameter Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Device Model',
			dataIndex: 'device',
			key: 'device',
			sorter: (a, b) => a.device.localeCompare(b.device),
		},
		{
			title: 'Data Type',
			dataIndex: 'dataType',
			key: 'dataType',
			render: (type: string) => (
				<Tag>{type}</Tag>
			),
		},
		{
			title: 'Unit',
			dataIndex: 'unit',
			key: 'unit',
			width: 80,
		},
		{
			title: 'Access',
			dataIndex: 'access',
			key: 'access',
			width: 120,
			render: (access: string) => (
				<Tag color={access === 'Read/Write' ? 'blue' : 'default'}>{access}</Tag>
			),
		},
		{
			title: 'Source Interface',
			dataIndex: 'sourceInterface',
			key: 'sourceInterface',
			width: 140,
			render: (text: string) => <Tag>{text}</Tag>,
		},
		{
			title: 'BIT',
			dataIndex: 'bit',
			key: 'bit',
			width: 80,
			render: (text: string) => text === '99' ? <span style={{ color: '#999' }}>NA</span> : <Tag>{text}</Tag>,
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
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
						onClick={() => navigate(deviceId ? `/device/${deviceId}/configuration/add-parameter?edit=${record.key}` : `/configuration/add-parameter?edit=${record.key}`)}
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

	const filteredData = parameters.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchText.toLowerCase()) ||
			item.device.toLowerCase().includes(searchText.toLowerCase()) ||
			item.description.toLowerCase().includes(searchText.toLowerCase());
		
		const matchesAccess = filterAccess === 'all' || item.access === filterAccess;
		
		return matchesSearch && matchesAccess;
	});

	// Statistics
	const totalParameters = parameters.length;
	const readOnlyCount = parameters.filter(p => p.access === 'Read Only').length;
	const readWriteCount = parameters.filter(p => p.access === 'Read/Write').length;
	// Assuming "missing required fields" means empty description or unit for this example, 
	// or we could define it as missing any optional field if we had them. 
	// Let's say description is required for a "complete" parameter.
	const missingFieldsCount = parameters.filter(p => !p.description || !p.unit).length;

	// Find latest updated time
	const sortedByDate = [...parameters].sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf());
	const lastUpdatedTime = sortedByDate.length > 0 ? dayjs(sortedByDate[0].updatedAt).fromNow() : 'N/A';

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
						<Typography.Text strong style={{ fontSize: 16 }}>Parameter Statistics</Typography.Text>
						
						<Space split={<Typography.Text type="secondary">|</Typography.Text>} size={16}>
							<Typography.Text>Total: <strong>{totalParameters}</strong></Typography.Text>
							<Typography.Text>Read Only: <strong>{readOnlyCount}</strong></Typography.Text>
							<Typography.Text>Read/Write: <strong>{readWriteCount}</strong></Typography.Text>
							<Typography.Text type={missingFieldsCount > 0 ? "warning" : undefined}>
								Missing Fields: <strong>{missingFieldsCount}</strong>
							</Typography.Text>
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
								placeholder="Search parameters..."
								allowClear
								style={{ width: 300 }}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Select
								value={filterAccess}
								onChange={setFilterAccess}
								style={{ width: 150 }}
								suffixIcon={<FilterOutlined />}
							>
								<Option value="all">All Access</Option>
								<Option value="Read Only">Read Only</Option>
								<Option value="Read/Write">Read/Write</Option>
							</Select>
							<Typography.Text type="secondary" style={{ fontSize: 12, alignSelf: 'center' }}>
								{filteredData.length} of {totalParameters} parameters
							</Typography.Text>
						</Space>
						<Space size={8}>
							<Button icon={<ReloadOutlined />} loading={refreshing} onClick={handleRefresh}>
								Refresh
							</Button>
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={() => navigate(deviceId ? `/device/${deviceId}/configuration/add-parameter` : '/configuration/add-parameter')}
								style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
							>
								Add New Parameter
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

export default AllParameters;
