import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message, Select, Row, Col, Progress } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Search } = Input;

interface ParameterData {
	key: string;
	name: string;
	device: string;
	dataType: string;
	unit: string;
	access: string;
	address: number;
	defaultValue: string;
	description: string;
	createdAt: string;
}

const AllParameters: React.FC = () => {
	const navigate = useNavigate();
	const [searchText, setSearchText] = useState('');
	const [filterAccess, setFilterAccess] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);

	// Mock data
	const [parameters] = useState<ParameterData[]>([
		{
			key: '1',
			name: 'Occupancy',
			device: 'T-OXM-001',
			dataType: 'Boolean',
			unit: '-',
			access: 'Read Only',
			address: 1001,
			defaultValue: 'false',
			description: 'Room occupancy status',
			createdAt: '2024-01-15',
		},
		{
			key: '2',
			name: 'Light Level',
			device: 'T-OXM-001',
			dataType: 'Integer',
			unit: 'lux',
			access: 'Read Only',
			address: 1002,
			defaultValue: '0',
			description: 'Ambient light level',
			createdAt: '2024-01-15',
		},
		{
			key: '3',
			name: 'Temperature',
			device: 'T-TEMP-01',
			dataType: 'Float',
			unit: '°C',
			access: 'Read Only',
			address: 2001,
			defaultValue: '20.0',
			description: 'Current temperature',
			createdAt: '2024-01-20',
		},
		{
			key: '4',
			name: 'Temperature Setpoint',
			device: 'T-TEMP-01',
			dataType: 'Float',
			unit: '°C',
			access: 'Read/Write',
			address: 2002,
			defaultValue: '22.0',
			description: 'Target temperature setpoint',
			createdAt: '2024-01-20',
		},
		{
			key: '5',
			name: 'Humidity',
			device: 'T-HUM-001',
			dataType: 'Float',
			unit: '%',
			access: 'Read Only',
			address: 3001,
			defaultValue: '50.0',
			description: 'Relative humidity',
			createdAt: '2024-02-01',
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
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
			width: 100,
			sorter: (a, b) => a.address - b.address,
		},
		{
			title: 'Default Value',
			dataIndex: 'defaultValue',
			key: 'defaultValue',
			width: 120,
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
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
						onClick={() => navigate(`/configuration/add-parameter?edit=${record.key}`)}
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

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
			{/* Statistics Cards */}
			<Row gutter={16}>
				<Col span={8}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Total Parameters</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0 }}>{totalParameters}</Typography.Title>
							<Progress percent={100} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
				<Col span={8}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Read Only</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#8c8c8c' }}>{readOnlyCount}</Typography.Title>
							<Progress percent={totalParameters > 0 ? (readOnlyCount / totalParameters) * 100 : 0} showInfo={false} strokeColor="#8c8c8c" />
						</Space>
					</Card>
				</Col>
				<Col span={8}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Read/Write</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#1890ff' }}>{readWriteCount}</Typography.Title>
							<Progress percent={totalParameters > 0 ? (readWriteCount / totalParameters) * 100 : 0} showInfo={false} strokeColor="#1890ff" />
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Search and Filter Bar */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
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
							onClick={() => navigate('/configuration/add-parameter')}
							style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
						>
							Add New Parameter
						</Button>
					</Space>
				</Space>
			</Card>

			{/* Parameters Table */}
			<Card 
				title={`All Parameters (${filteredData.length})`}
				bordered
				style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
				bodyStyle={{ padding: 16, flex: 1, overflow: 'auto' }}
			>
				<Table
					columns={columns}
					dataSource={filteredData}
					pagination={false}
					size="small"
					scroll={{ x: 'max-content' }}
				/>
			</Card>
		</div>
	);
};

export default AllParameters;
