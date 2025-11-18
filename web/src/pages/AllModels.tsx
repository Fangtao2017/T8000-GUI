import React, { useState } from 'react';
import { Table, Button, Space, Tag, Card, Typography, Input, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Title, Paragraph } = Typography;

interface ModelData {
	key: string;
	model: string;
	type: string;
	brand: string;
	icon: string;
	description: string;
	parameterCount: number;
	createdAt: string;
}

const AllModels: React.FC = () => {
	const navigate = useNavigate();
	const [searchText, setSearchText] = useState('');

	// Mock data
	const [models] = useState<ModelData[]>([
		{
			key: '1',
			model: 'T-OXM-001',
			type: 'Sensor',
			brand: 'TechCorp',
			icon: '📡',
			description: 'Occupancy and light sensor',
			parameterCount: 4,
			createdAt: '2024-01-15',
		},
		{
			key: '2',
			model: 'T-TEMP-01',
			type: 'Sensor',
			brand: 'TechCorp',
			icon: '🌡️',
			description: 'Temperature sensor',
			parameterCount: 3,
			createdAt: '2024-01-20',
		},
		{
			key: '3',
			model: 'T-HUM-001',
			type: 'Sensor',
			brand: 'TechCorp',
			icon: '💧',
			description: 'Humidity sensor',
			parameterCount: 2,
			createdAt: '2024-02-01',
		},
	]);

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
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => (
				<Tag style={{ background: '#f0f0f0', border: '1px solid #d9d9d9', color: '#595959' }}>{type}</Tag>
			),
		},
		{
			title: 'Brand',
			dataIndex: 'brand',
			key: 'brand',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			ellipsis: true,
		},
		{
			title: 'Parameters',
			dataIndex: 'parameterCount',
			key: 'parameterCount',
			width: 120,
			sorter: (a, b) => a.parameterCount - b.parameterCount,
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
			width: 150,
			render: (_, record) => (
				<Space size="small">
					<Button
						type="link"
						icon={<EditOutlined />}
						size="small"
						onClick={() => navigate(`/configuration/add-model?edit=${record.key}`)}
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

	const filteredData = models.filter(
		(item) =>
			item.model.toLowerCase().includes(searchText.toLowerCase()) ||
			item.type.toLowerCase().includes(searchText.toLowerCase()) ||
			item.brand.toLowerCase().includes(searchText.toLowerCase()) ||
			item.description.toLowerCase().includes(searchText.toLowerCase())
	);

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1400, margin: '0 auto' }}>
					<div style={{ marginBottom: 24 }}>
						<Title level={3}>
							<AppstoreOutlined /> All Device Models
						</Title>
						<Paragraph type="secondary">
							Manage all device model templates in your system
						</Paragraph>
					</div>

					<Card>
						<div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Input
								placeholder="Search models..."
								prefix={<SearchOutlined />}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								style={{ width: 300 }}
								allowClear
							/>
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={() => navigate('/configuration/add-model')}
								style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
							>
								Add New Model
							</Button>
						</div>

						<Table
							columns={columns}
							dataSource={filteredData}
							pagination={{
								pageSize: 10,
								showSizeChanger: true,
								showTotal: (total) => `Total ${total} models`,
							}}
						/>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AllModels;
