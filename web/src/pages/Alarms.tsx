import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Typography, Input, Select, Progress, message, Modal, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, FireOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

interface AlarmDefinition {
	key: string;
	name: string;
	deviceType: string;
	targetDevice: string; // Specific device name or 'All'
	parameter: string;
	condition: string; // e.g. "> 50"
	severity: 'Critical' | 'Warning' | 'Info';
	enabled: boolean;
	createdAt: string;
}

// Mock data for Alarm Definitions
const alarmDefinitions: AlarmDefinition[] = [
	{ key: '1', name: 'High Temperature Alert', deviceType: 'Temp', targetDevice: 'Temperature Sensor 1', parameter: 'Temperature', condition: '> 30°C', severity: 'Critical', enabled: true, createdAt: '2024-01-15' },
	{ key: '2', name: 'Low Humidity Warning', deviceType: 'Humidity', targetDevice: 'All', parameter: 'Humidity', condition: '< 30%', severity: 'Warning', enabled: true, createdAt: '2024-01-20' },
	{ key: '3', name: 'Connection Lost', deviceType: 'Gateway', targetDevice: 'Gateway Main', parameter: 'Status', condition: '== Offline', severity: 'Critical', enabled: true, createdAt: '2024-02-01' },
	{ key: '4', name: 'Voltage Spike', deviceType: 'Energy Meter', targetDevice: 'Energy Meter 3-Phase', parameter: 'Voltage', condition: '> 250V', severity: 'Critical', enabled: false, createdAt: '2024-02-10' },
	{ key: '5', name: 'Water Leak Detected', deviceType: 'Sensor', targetDevice: 'Water Leak Sensor 1', parameter: 'State', condition: '== Wet', severity: 'Critical', enabled: true, createdAt: '2024-02-15' },
];

const Alarms: React.FC = () => {
	const navigate = useNavigate();
	const [searchText, setSearchText] = useState('');
	const [filterSeverity, setFilterSeverity] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);
	const [data, setData] = useState<AlarmDefinition[]>(alarmDefinitions);

	const handleRefresh = () => {
		setRefreshing(true);
		message.success('Alarm definitions refreshed');
		setTimeout(() => setRefreshing(false), 1000);
	};

	const handleDelete = (key: string) => {
		Modal.confirm({
			title: 'Delete Alarm',
			content: 'Are you sure you want to delete this alarm definition?',
			okText: 'Delete',
			okType: 'danger',
			onOk: () => {
				setData(prev => prev.filter(item => item.key !== key));
				message.success('Alarm deleted successfully');
			},
		});
	};

	const handleToggleEnable = (key: string, checked: boolean) => {
		setData(prev => prev.map(item => item.key === key ? { ...item, enabled: checked } : item));
		message.success(`Alarm ${checked ? 'enabled' : 'disabled'}`);
	};

	const filteredData = data.filter(item => {
		const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
						  item.targetDevice.toLowerCase().includes(searchText.toLowerCase());
		const matchSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
		return matchSearch && matchSeverity;
	});

	// Stats
	const totalAlarms = data.length;
	const enabledAlarms = data.filter(a => a.enabled).length;
	const criticalAlarms = data.filter(a => a.severity === 'Critical').length;
	const warningAlarms = data.filter(a => a.severity === 'Warning').length;

	const columns: ColumnsType<AlarmDefinition> = [
		{
			title: 'Alarm Name',
			dataIndex: 'name',
			key: 'name',
			render: (text) => <strong>{text}</strong>,
		},
		{
			title: 'Severity',
			dataIndex: 'severity',
			key: 'severity',
			width: 120,
			render: (severity) => {
				let color = '#1890ff';
				let icon = <InfoCircleOutlined />;
				
				if (severity === 'Critical') {
					color = '#ff4d4f';
					icon = <FireOutlined />;
				} else if (severity === 'Warning') {
					color = '#faad14';
					icon = <WarningOutlined />;
				}

				return (
					<Space style={{ color: color }}>
						{icon}
						<span>{severity}</span>
					</Space>
				);
			}
		},
		{
			title: 'Target Device',
			dataIndex: 'targetDevice',
			key: 'targetDevice',
		},
		{
			title: 'Parameter',
			dataIndex: 'parameter',
			key: 'parameter',
		},
		{
			title: 'Condition',
			dataIndex: 'condition',
			key: 'condition',
			render: (text) => <Tag>{text}</Tag>
		},
		{
			title: 'Status',
			dataIndex: 'enabled',
			key: 'enabled',
			render: (enabled, record) => (
				<Switch 
					checked={enabled} 
					onChange={(checked) => handleToggleEnable(record.key, checked)}
					size="small"
				/>
			)
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 150,
			render: (_, record) => (
				<Space size="small">
					<Button 
						type="link" 
						icon={<EditOutlined />} 
						size="small"
						onClick={() => navigate(`/configuration/add-alarm?edit=${record.key}`)}
						style={{ color: '#003A70' }}
					>
						Edit
					</Button>
					<Button 
						type="link" 
						danger 
						icon={<DeleteOutlined />} 
						size="small"
						onClick={() => handleDelete(record.key)}
					>
						Delete
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
			 {/* Stats Cards */}
			<Row gutter={16}>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Total Definitions</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0 }}>{totalAlarms}</Typography.Title>
							<Progress percent={100} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Enabled</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#52c41a' }}>{enabledAlarms}</Typography.Title>
							<Progress percent={totalAlarms > 0 ? (enabledAlarms / totalAlarms) * 100 : 0} showInfo={false} strokeColor="#52c41a" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Critical</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>{criticalAlarms}</Typography.Title>
							<Progress percent={totalAlarms > 0 ? (criticalAlarms / totalAlarms) * 100 : 0} showInfo={false} strokeColor="#ff4d4f" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Warning</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#faad14' }}>{warningAlarms}</Typography.Title>
							<Progress percent={totalAlarms > 0 ? (warningAlarms / totalAlarms) * 100 : 0} showInfo={false} strokeColor="#faad14" />
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Filter Bar */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Search
							placeholder="Search alarms..."
							allowClear
							style={{ width: 300 }}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						<Select
							placeholder="Severity"
							style={{ width: 150 }}
							value={filterSeverity}
							onChange={setFilterSeverity}
						>
							<Select.Option value="all">All Severities</Select.Option>
							<Select.Option value="Critical">Critical</Select.Option>
							<Select.Option value="Warning">Warning</Select.Option>
							<Select.Option value="Info">Info</Select.Option>
						</Select>
						<Typography.Text type="secondary" style={{ fontSize: 12, alignSelf: 'center' }}>
							{filteredData.length} definitions
						</Typography.Text>
					</Space>
					<Space size={8}>
						<Button icon={<ReloadOutlined />} loading={refreshing} onClick={handleRefresh}>
							Refresh
						</Button>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => navigate('/configuration/add-alarm')}
							style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
						>
							Add Alarm
						</Button>
					</Space>
				</Space>
			</Card>

			{/* Table */}
			<Card 
				title="Alarm Definitions" 
				bordered 
				style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<div style={{ flex: 1, overflow: 'auto' }}>
					<Table
						columns={columns}
						dataSource={filteredData}
						pagination={false}
						size="small"
					/>
				</div>
			</Card>
		</div>
	);
};

export default Alarms;





