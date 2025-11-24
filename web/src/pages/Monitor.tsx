import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, message, Input, Select, DatePicker, Row, Col, Progress, Badge } from 'antd';
import { 
	FireOutlined, 
	WarningOutlined, 
	InfoCircleOutlined, 
	ReloadOutlined,
	ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNotifications, type NotificationItem } from '../context/NotificationContext';

const { RangePicker } = DatePicker;
const { Search } = Input;

const Monitor: React.FC = () => {
	const { notifications, updateNotificationStatus } = useNotifications();
	const [loading, setLoading] = useState(false);
	
	// Filter states
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState<string>('all');
	const [filterSeverity, setFilterSeverity] = useState<string>('all');
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

	const handleAction = (id: string, action: 'acknowledged' | 'ignored') => {
		setLoading(true);
		// Simulate API delay
		setTimeout(() => {
			updateNotificationStatus(id, action);
			message.success(`Notification ${action}`);
			setLoading(false);
		}, 500);
	};

	const handleReset = () => {
		setSearchText('');
		setFilterType('all');
		setFilterSeverity('all');
		setDateRange([null, null]);
	};

	// Filter logic
	const filteredData = notifications.filter(item => {
		// Search Text (Device Name or Title)
		if (searchText && !item.deviceName.toLowerCase().includes(searchText.toLowerCase()) && !item.title.toLowerCase().includes(searchText.toLowerCase())) {
			return false;
		}

		// Type Filter
		if (filterType !== 'all' && item.type !== filterType) {
			return false;
		}

		// Severity Filter
		if (filterSeverity !== 'all' && item.severity !== filterSeverity) {
			return false;
		}

		// Date Range Filter
		if (dateRange[0] && dateRange[1]) {
			const latestEvent = item.events[item.events.length - 1];
			const itemDate = dayjs.unix(latestEvent.timestamp);
			if (itemDate.isBefore(dateRange[0]) || itemDate.isAfter(dateRange[1])) {
				return false;
			}
		}

		return true;
	});

	// Statistics
	const totalEvents = filteredData.length;
	const activeTriggers = filteredData.filter(item => item.events[item.events.length - 1].type === 'triggered').length;
	const criticalEvents = filteredData.filter(item => item.severity === 'critical').length;
	const acknowledgedEvents = filteredData.filter(item => item.userStatus === 'acknowledged').length;
	
	// Calculate percentages for progress bars
	const activeRate = totalEvents > 0 ? (activeTriggers / totalEvents) * 100 : 0;
	const criticalRate = totalEvents > 0 ? (criticalEvents / totalEvents) * 100 : 0;
	const ackRate = totalEvents > 0 ? (acknowledgedEvents / totalEvents) * 100 : 0;

	const columns: ColumnsType<NotificationItem> = [
		{
			title: 'Time',
			dataIndex: 'time',
			key: 'time',
			width: 180,
			render: (_, record) => {
				const latestEvent = record.events[record.events.length - 1];
				return (
					<Typography.Text>{dayjs.unix(latestEvent.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
				);
			},
			sorter: (a, b) => {
				const timeA = a.events[a.events.length - 1].timestamp;
				const timeB = b.events[b.events.length - 1].timestamp;
				return timeB - timeA;
			},
			defaultSortOrder: 'ascend',
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			width: 100,
			render: (type: string) => (
				<Typography.Text style={{ border: '1px solid #d9d9d9', padding: '0 7px', borderRadius: '2px', fontSize: '12px' }}>
					{type ? type.toUpperCase() : 'ALARM'}
				</Typography.Text>
			),
		},
		{
			title: 'Severity',
			dataIndex: 'severity',
			key: 'severity',
			width: 120,
			render: (severity: string) => {
				let icon = <InfoCircleOutlined />;
				let color = 'green';
				
				if (severity === 'critical') {
					icon = <FireOutlined />;
					color = 'red';
				} else if (severity === 'warning') {
					icon = <WarningOutlined />;
					color = 'orange';
				}

				return (
					<Space size={4}>
						{React.cloneElement(icon, { style: { color, fontSize: 14 } })}
						<Typography.Text style={{ color, fontSize: 13 }}>
							{severity.charAt(0).toUpperCase() + severity.slice(1)}
						</Typography.Text>
					</Space>
				);
			},
		},
		{
			title: 'Name',
			dataIndex: 'title',
			key: 'title',
			width: 240,
			render: (text) => (
				<Typography.Text strong>{text}</Typography.Text>
			),
		},
		{
			title: 'Status',
			key: 'status',
			width: 140,
			render: (_, record) => {
				const latestEvent = record.events[record.events.length - 1];
				const isTriggered = latestEvent.type === 'triggered';
				
				return (
					<Badge 
						status={isTriggered ? 'error' : 'success'}
						text={isTriggered ? 'TRIGGERED' : 'NORMALIZED'}
					/>
				);
			},
		},
		{
			title: '',
			key: 'relativeTime',
			width: 100,
			render: (_, record) => (
				<Typography.Text type="secondary" style={{ fontSize: 12 }}>{record.time}</Typography.Text>
			),
		},
		{
			title: 'User Action',
			key: 'userAction',
			width: 320,
			align: 'right',
			render: (_, record) => {
				if (record.userStatus !== 'new') {
					return (
						<Typography.Text style={{ 
							color: record.userStatus === 'acknowledged' ? '#003A70' : '#000',
							padding: '0 8px',
							borderRadius: '2px',
							fontSize: '12px'
						}}>
							{record.userStatus.toUpperCase()}
						</Typography.Text>
					);
				}

				return (
					<Space>
						<Button 
							size="small" 
							onClick={() => handleAction(record.id, 'ignored')}
							style={{ 
								backgroundColor: '#fff',
								borderColor: '#d9d9d9',
								color: '#000'
							}}
						>
							Mark as Ignored
						</Button>
						<Button 
							type="primary" 
							size="small" 
							onClick={() => handleAction(record.id, 'acknowledged')}
							style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
						>
							Acknowledge
						</Button>
					</Space>
				);
			},
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
			{/* Statistics Cards */}
			<Row gutter={16}>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Total Events</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0 }}>{totalEvents}</Typography.Title>
							<Progress percent={100} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Active Triggers</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>{activeTriggers}</Typography.Title>
							<Progress percent={activeRate} showInfo={false} strokeColor="#ff4d4f" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Critical Severity</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#cf1322' }}>{criticalEvents}</Typography.Title>
							<Progress percent={criticalRate} showInfo={false} strokeColor="#cf1322" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Acknowledged</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#003A70' }}>{acknowledgedEvents}</Typography.Title>
							<Progress percent={ackRate} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Filter Bar */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Search
							placeholder="Search device or message..."
							allowClear
							style={{ width: 260 }}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						
						<Select
							placeholder="Type"
							style={{ width: 120 }}
							value={filterType}
							onChange={setFilterType}
						>
							<Select.Option value="all">All Types</Select.Option>
							<Select.Option value="alarm">Alarm</Select.Option>
							<Select.Option value="rule">Rule</Select.Option>
						</Select>

						<Select
							placeholder="Severity"
							style={{ width: 120 }}
							value={filterSeverity}
							onChange={setFilterSeverity}
						>
							<Select.Option value="all">All Severities</Select.Option>
							<Select.Option value="critical">Critical</Select.Option>
							<Select.Option value="warning">Warning</Select.Option>
							<Select.Option value="info">Info</Select.Option>
						</Select>

						<RangePicker
							style={{ width: 240 }}
							value={dateRange}
							onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
						/>
					</Space>

					<Space size={8}>
						<Button icon={<ReloadOutlined />} onClick={handleReset}>Reset</Button>
						<Button icon={<ExportOutlined />}>Export</Button>
					</Space>
				</Space>
			</Card>

			{/* Table Card */}
			<Card 
				title={`Alarm & Rule Status (${totalEvents})`}
				bordered
				style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				bodyStyle={{ padding: 0, flex: 1, overflow: 'hidden' }}
			>
				<Table
					columns={columns}
					dataSource={filteredData}
					rowKey="id"
					pagination={false}
					scroll={{ y: 'calc(100vh - 420px)' }}
					loading={loading}
					size="middle"
				/>
			</Card>
		</div>
	);
};

export default Monitor;
