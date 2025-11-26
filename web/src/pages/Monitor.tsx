import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, message, Input, Select, DatePicker, Switch, Badge, Tag } from 'antd';
import { 
	FireOutlined, 
	WarningOutlined, 
	InfoCircleOutlined, 
	ReloadOutlined,
	ExportOutlined,
	CheckCircleOutlined,
	BellOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNotifications, type NotificationItem } from '../context/NotificationContext';

dayjs.extend(relativeTime);

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
	const [onlyActive, setOnlyActive] = useState(false);
	const [onlyUnack, setOnlyUnack] = useState(false);

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
		setOnlyActive(false);
		setOnlyUnack(false);
	};

	const handleBulkAcknowledge = () => {
		message.success('Bulk acknowledge action triggered');
	};

	// Filter logic
	const filteredData = notifications.filter(item => {
		// Search Text
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

		// Toggle Filters
		const isTriggered = item.events[item.events.length - 1].type === 'triggered';
		if (onlyActive && !isTriggered) return false;
		if (onlyUnack && item.userStatus !== 'new') return false;

		return true;
	});

	// Info Bar Statistics (Global)
	const activeEvents = notifications.filter(n => n.events[n.events.length - 1].type === 'triggered');
	const activeCount = activeEvents.length;
	const criticalCount = activeEvents.filter(n => n.severity === 'critical').length;
	const warningCount = activeEvents.filter(n => n.severity === 'warning').length;
	const unackCount = notifications.filter(n => n.userStatus === 'new').length;
	
	const sortedByTime = [...notifications].sort((a, b) => {
		const timeA = a.events[a.events.length - 1].timestamp;
		const timeB = b.events[b.events.length - 1].timestamp;
		return timeB - timeA;
	});
	const lastAlarm = sortedByTime.length > 0 ? sortedByTime[0] : null;
	const lastAlarmTimeText = lastAlarm 
		? dayjs.unix(lastAlarm.events[lastAlarm.events.length - 1].timestamp).fromNow() 
		: 'No events';

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
				<Tag>{type ? type.toUpperCase() : 'ALARM'}</Tag>
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
			title: 'User Action',
			key: 'userAction',
			width: 280,
			align: 'right',
			render: (_, record) => {
				if (record.userStatus !== 'new') {
					const isAck = record.userStatus === 'acknowledged';
					return (
						<div style={{ 
							display: 'inline-block',
							border: `1px solid ${isAck ? '#003A70' : '#d9d9d9'}`,
							color: isAck ? '#fff' : 'rgba(0, 0, 0, 0.25)',
							backgroundColor: isAck ? '#003A70' : '#fff',
							padding: '0 15px',
							height: '24px',
							lineHeight: '22px',
							borderRadius: '2px',
							fontSize: '12px',
							textAlign: 'center',
							cursor: 'default',
							minWidth: '100px'
						}}>
							{record.userStatus.toUpperCase()}
						</div>
					);
				}

				return (
					<Space>
						<Button 
							size="small" 
							onClick={() => handleAction(record.id, 'ignored')}
						>
							Ignore
						</Button>
						<Button 
							size="small" 
							onClick={() => handleAction(record.id, 'acknowledged')}
						>
							Acknowledge
						</Button>
					</Space>
				);
			},
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
			<div style={{ width: '100%', maxWidth: 1600, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
				
				{/* Layer 1: Info Bar */}
				<div style={{ 
					backgroundColor: activeCount > 0 ? '#fff2f0' : '#f6ffed', 
					border: `1px solid ${activeCount > 0 ? '#ffccc7' : '#b7eb8f'}`,
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
						<Space>
							{activeCount > 0 ? <FireOutlined style={{ color: '#ff4d4f', fontSize: 20 }} /> : <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />}
							<Typography.Text strong style={{ fontSize: 16 }}>
								{activeCount > 0 ? `${activeCount} Active Alarms` : 'System Normal'}
							</Typography.Text>
						</Space>
						
						{activeCount > 0 && (
							<Space split={<Typography.Text type="secondary">|</Typography.Text>}>
								<Typography.Text>
									<span style={{ color: '#ff4d4f', fontWeight: 600 }}>{criticalCount}</span> Critical
								</Typography.Text>
								<Typography.Text>
									<span style={{ color: '#faad14', fontWeight: 600 }}>{warningCount}</span> Warning
								</Typography.Text>
							</Space>
						)}

						<Space>
							<BellOutlined />
							<Typography.Text>
								<strong>{unackCount}</strong> Unacknowledged
							</Typography.Text>
						</Space>
					</Space>

					<Typography.Text type="secondary">
						Last event: {lastAlarmTimeText}
					</Typography.Text>
				</div>

				{/* Layer 2: Toolbar */}
				<Card bordered bodyStyle={{ padding: '16px' }} style={{ flexShrink: 0 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
						<Space size={16} wrap>
							<Search
								placeholder="Search..."
								allowClear
								style={{ width: 240 }}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Select
								placeholder="Type"
								style={{ width: 120 }}
								value={filterType}
								onChange={setFilterType}
								options={[
									{ label: 'All Types', value: 'all' },
									{ label: 'Alarm', value: 'alarm' },
									{ label: 'Rule', value: 'rule' },
								]}
							/>
							<Select
								placeholder="Severity"
								style={{ width: 120 }}
								value={filterSeverity}
								onChange={setFilterSeverity}
								options={[
									{ label: 'All Severities', value: 'all' },
									{ label: 'Critical', value: 'critical' },
									{ label: 'Warning', value: 'warning' },
									{ label: 'Info', value: 'info' },
								]}
							/>
							<RangePicker
								style={{ width: 240 }}
								value={dateRange}
								onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
							/>
							
							<div style={{ width: 1, height: 24, backgroundColor: '#f0f0f0' }} />

							<Space>
								<Typography.Text style={{ fontSize: 13 }}>Active Only</Typography.Text>
								<Switch size="small" checked={onlyActive} onChange={setOnlyActive} />
							</Space>
							<Space>
								<Typography.Text style={{ fontSize: 13 }}>Unacknowledged Only</Typography.Text>
								<Switch size="small" checked={onlyUnack} onChange={setOnlyUnack} />
							</Space>
						</Space>

						<Space>
							<Button onClick={handleBulkAcknowledge}>Bulk Acknowledge</Button>
							<Button icon={<ExportOutlined />}>Export</Button>
							<Button icon={<ReloadOutlined />} onClick={handleReset} />
						</Space>
					</div>
				</Card>

				{/* Layer 3: Table */}
				<Card 
					bordered
					style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
					bodyStyle={{ padding: 0, flex: 1, overflow: 'hidden' }}
				>
					<Table
						columns={columns}
						dataSource={filteredData}
						rowKey="id"
						pagination={false}
						scroll={{ y: 'calc(100vh - 350px)' }}
						loading={loading}
						size="small"
					/>
				</Card>
			</div>
		</div>
	);
};

export default Monitor;
