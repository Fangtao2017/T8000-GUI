import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message, Select, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchParameters, type ParameterApiData } from '../api/parameterApi';

dayjs.extend(relativeTime);

const { Option } = Select;
const { Search } = Input;

// Use the interface from API or extend it if needed
interface ParameterData extends ParameterApiData {
	parameter?: string; // Add optional parameter field in case backend sends it
}

const AllParameters: React.FC = () => {
	const navigate = useNavigate();
	const { deviceId } = useParams<{ deviceId: string }>();
	const [searchText, setSearchText] = useState('');
	const [filterAccess, setFilterAccess] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);
	const [parameters, setParameters] = useState<ParameterData[]>([]);

	const loadParameters = async () => {
		setRefreshing(true);
		try {
			const data = await fetchParameters();
			console.log('Loaded parameters:', data); // Debug log
			if (Array.isArray(data)) {
				// Ensure keys are strings for Ant Design Table
				const formattedData = data.map(item => ({
					...item,
					key: String(item.key)
				}));
				setParameters(formattedData);
			} else {
				console.error('Invalid data format received:', data);
				message.error('Invalid data format received');
			}
		} catch (error) {
			console.error('Failed to load parameters:', error);
			message.error('Failed to load parameters');
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		loadParameters();
	}, []);

	const handleRefresh = () => {
		loadParameters();
		message.success('Data refreshed successfully');
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
			sorter: (a, b) => (a.name || a.parameter || '').localeCompare(b.name || b.parameter || ''),
			render: (text: string, record: ParameterData) => {
				const val = text || record.parameter;
				return val ? <strong>{val}</strong> : <span style={{ color: '#ccc' }}>null</span>;
			},
		},
		{
			title: 'Device Model',
			dataIndex: 'device',
			key: 'device',
			sorter: (a, b) => (a.device || '').localeCompare(b.device || ''),
			render: (text: string) => text || <span style={{ color: '#ccc' }}>null</span>,
		},
		{
			title: 'Data Type',
			dataIndex: 'dataType',
			key: 'dataType',
			render: (type: string | number) => (
				type !== null && type !== undefined ? <Tag>{type}</Tag> : <span style={{ color: '#ccc' }}>null</span>
			),
		},
		{
			title: 'Unit',
			dataIndex: 'unit',
			key: 'unit',
			width: 80,
			render: (text: string) => text || <span style={{ color: '#ccc' }}>null</span>,
		},
		{
			title: 'Access',
			dataIndex: 'access',
			key: 'access',
			width: 120,
			render: (access: string) => (
				access ? <Tag color={access === 'Read/Write' ? 'blue' : 'default'}>{access}</Tag> : <span style={{ color: '#ccc' }}>null</span>
			),
		},
		{
			title: 'Source Interface',
			dataIndex: 'sourceInterface',
			key: 'sourceInterface',
			width: 140,
			render: (text: string) => text ? <Tag>{text}</Tag> : <span style={{ color: '#ccc' }}>null</span>,
		},
		{
			title: 'Channel',
			dataIndex: 'channel',
			key: 'channel',
			width: 100,
			render: (text: string | number) => (
				text !== null && text !== undefined ? <Tag>{text}</Tag> : <span style={{ color: '#ccc' }}>null</span>
			),
		},
		{
			title: 'Lower Limit',
			dataIndex: 'lowerLimit',
			key: 'lowerLimit',
			width: 100,
			render: (text: string | number) => (
				text !== null && text !== undefined ? text : <span style={{ color: '#ccc' }}>null</span>
			),
		},
		{
			title: 'Upper Limit',
			dataIndex: 'upperLimit',
			key: 'upperLimit',
			width: 100,
			render: (text: string | number) => (
				text !== null && text !== undefined ? text : <span style={{ color: '#ccc' }}>null</span>
			),
		},
		{
			title: 'BIT',
			dataIndex: 'bit',
			key: 'bit',
			width: 80,
			render: (text: string | number) => (
				text !== null && text !== undefined ? <Tag>{text}</Tag> : <span style={{ color: '#ccc' }}>null</span>
			),
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
		const searchLower = searchText.toLowerCase();
		const name = item.name || item.parameter || ''; // Check both name and parameter
		const matchesSearch =
			name.toLowerCase().includes(searchLower) ||
			(item.device || '').toLowerCase().includes(searchLower) ||
			(item.description || '').toLowerCase().includes(searchLower);
		
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
					{refreshing && parameters.length === 0 ? (
						<div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
					) : (
						<Table
							columns={columns}
							dataSource={filteredData}
							pagination={false}
							size="small"
							scroll={{ y: 'calc(100vh - 350px)' }}
						/>
					)}
				</Card>
			</div>
		</div>
	);
};

export default AllParameters;
