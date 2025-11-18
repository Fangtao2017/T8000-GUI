import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FormOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;
const { Option } = Select;

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
				<Tag style={{ background: '#f0f0f0', border: '1px solid #d9d9d9', color: '#595959' }}>{type}</Tag>
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
				<Tag style={{ background: '#f0f0f0', border: '1px solid #d9d9d9', color: '#595959' }}>{access}</Tag>
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
			width: 150,
			render: (_, record) => (
				<Space size="small">
					<Button
						type="link"
						icon={<EditOutlined />}
						size="small"
						onClick={() => navigate(`/configuration/add-parameter?edit=${record.key}`)}
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

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1600, margin: '0 auto' }}>
					<div style={{ marginBottom: 24 }}>
						<Title level={3}>
							<FormOutlined /> All Device Parameters
						</Title>
						<Paragraph type="secondary">
							Manage all device parameters across all models
						</Paragraph>
					</div>

					<Card>
						<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
							<Space>
								<Input
									placeholder="Search parameters..."
									prefix={<SearchOutlined />}
									value={searchText}
									onChange={(e) => setSearchText(e.target.value)}
									style={{ width: 300 }}
									allowClear
								/>
								<Select
									value={filterAccess}
									onChange={setFilterAccess}
									style={{ width: 150 }}
								>
									<Option value="all">All Access</Option>
									<Option value="Read Only">Read Only</Option>
									<Option value="Read/Write">Read/Write</Option>
								</Select>
							</Space>
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={() => navigate('/configuration/add-parameter')}
								style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
							>
								Add New Parameter
							</Button>
						</div>

						<Table
							columns={columns}
							dataSource={filteredData}
							pagination={{
								pageSize: 10,
								showSizeChanger: true,
								showTotal: (total) => `Total ${total} parameters`,
							}}
						/>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AllParameters;
