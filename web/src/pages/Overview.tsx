import React, { useState, useMemo, useRef, useEffect } from 'react';
import './Home.css';
import {
	Badge,
	Card,
	Col,
	Row,
	Space,
	Table,
	Tag,
	Typography,
	List,
	Button,
	message,
	Input,
	Select,
	Progress,
	Modal,
	Timeline,
	Segmented,
	Popover,
	Descriptions,
	InputNumber,
	Switch
} from 'antd';
import {
	LaptopOutlined,
	ApiOutlined,
	InfoCircleOutlined,
	WarningOutlined,
	DisconnectOutlined,
	CheckCircleOutlined,
	FireOutlined,
	ReloadOutlined,
	RedoOutlined,
	PoweroffOutlined,
	SearchOutlined,
	FilterOutlined,
	RightOutlined,
	ClockCircleOutlined,
	EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { type DeviceData, allDevices, parameterUnits, writableConfigs } from '../data/devicesData';
import { useNotifications, type NotificationItem } from '../context/NotificationContext';

// deviceColumns moved inside component
const deviceColumns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		render: (text: string) => <Typography.Text>{text}</Typography.Text>,
	},
	{
		title: 'Model',
		dataIndex: 'model',
		key: 'model',
			render: (text: string) => <Tag>{text}</Tag>,
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (_: string, row: DeviceData) => {
			const statusText = row.status === 'online' ? 'Online' : 'Offline';
			const statusColor = row.status === 'online' ? 'success' : 'error';
			return <Badge status={statusColor} text={statusText} />;
		},
	},
	{
		title: 'Last seen',
		dataIndex: 'lastReport',
		key: 'lastReport',
			render: (text: string) => <Typography.Text>{text}</Typography.Text>,
	},
];

const Overview: React.FC = () => {
	// const navigate = useNavigate(); // Removed navigation
	const [refreshing, setRefreshing] = useState(false);
	
	// Filter states
	const [searchText, setSearchText] = useState('');
	const [modelFilter, setModelFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	// Device Modal states
	const [isDeviceModalVisible, setIsDeviceModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
	
	// Mocked data – replace with real API data later
	const device = {
		model: 'T8000',
		sn: '200310000092',
		firmware: 'v1.32.3.2',
		hwVersion: 'v2.1.0',
		location: 'Floor 2 / Zone 3',
		lastCommunication: '1 minutes ago',
		ipAddress: '192.168.1.100',
		macAddress: '04:a3:16:b0:93:b8',
		rtc: '19/11/2025 13:06:01 GMT+08',
		cpuUsage: 45,
		memoryUsage: 62,
		diskUsage: 38,
	};

	const systemRunning = true; // T8000 running status
	const mqttConnected = true;
	const networkOk = true;
	
	// Get unique device models for filter options
	const deviceModels = useMemo(() => {
		const models = new Set(allDevices.map(d => d.model));
		return Array.from(models).sort();
	}, []);

	
	// Filter and sort devices
	const filteredAndSortedDevices = useMemo(() => {
		let filtered = [...allDevices];
		
		// Apply search filter
		if (searchText) {
			const search = searchText.toLowerCase();
			filtered = filtered.filter(device => 
				device.name.toLowerCase().includes(search) ||
				device.model.toLowerCase().includes(search) ||
				device.status.toLowerCase().includes(search)
			);
		}
		
		// Apply model filter
		if (modelFilter !== 'all') {
			filtered = filtered.filter(device => device.model === modelFilter);
		}
		
		// Apply status filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter(device => device.status === statusFilter);
		}
		
		// Sort: offline first
		filtered.sort((a, b) => {
			if (a.status === 'offline' && b.status === 'online') return -1;
			if (a.status === 'online' && b.status === 'offline') return 1;
			return 0;
		});
		
		return filtered;
	}, [searchText, modelFilter, statusFilter]);
	
	// Notification state
	const { notifications, updateNotificationStatus } = useNotifications();
	const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [notificationFilter, setNotificationFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

	// Dynamic table height
	const [tableScrollHeight, setTableScrollHeight] = useState<number>(300);
	const tableContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				// Subtract header height (approx 40px for small table)
				setTableScrollHeight(entry.contentRect.height - 40);
			}
		});
		
		if (tableContainerRef.current) {
			observer.observe(tableContainerRef.current);
		}
		
		return () => observer.disconnect();
	}, []);

	// Filter notifications
	const filteredNotifications = useMemo(() => {
		return notifications.filter(n => {
			if (n.userStatus !== 'new') return false; // Only show new notifications in the main list
			if (notificationFilter === 'all') return true;
			return n.severity === notificationFilter;
		});
	}, [notifications, notificationFilter]);
	
	// Group counts for badges
	const counts = useMemo(() => {
		const newNotifications = notifications.filter(n => n.userStatus === 'new');
		return {
			all: newNotifications.length,
			critical: newNotifications.filter(n => n.severity === 'critical').length,
			warning: newNotifications.filter(n => n.severity === 'warning').length,
			info: newNotifications.filter(n => n.severity === 'info').length,
		};
	}, [notifications]);
	
	// Handle refresh
	const handleRefresh = () => {
		setRefreshing(true);
		message.loading('Refreshing overview...', 0.5);
		
		// Simulate API call
		setTimeout(() => {
			setRefreshing(false);
			message.success('Overview refreshed successfully');
		}, 1000);
	};
	
	// Quick actions handlers
	const handleRestartT8000 = () => {
		message.warning('Restart T8000 - This feature will be implemented');
	};

	const handleShutdown = () => {
		message.warning('Shutdown - This feature will be implemented');
	};

	// Notification handlers
	const handleNotificationClick = (item: NotificationItem) => {
		setSelectedNotification(item);
		setIsModalVisible(true);
	};

	const handleMarkAs = (status: 'acknowledged' | 'ignored') => {
		if (!selectedNotification) return;
		
		updateNotificationStatus(selectedNotification.id, status);
		
		setIsModalVisible(false);
		message.success(`Notification marked as ${status}`);
	};
	
	// Render notification item
	const renderNotificationItem = (item: NotificationItem) => {
		const iconMap = {
			critical: <FireOutlined style={{ color: '#D9534F', fontSize: 16 }} />,
			warning: <WarningOutlined style={{ color: '#faad14', fontSize: 16 }} />,
			info: <InfoCircleOutlined style={{ color: '#8CC63F', fontSize: 16 }} />
		};
		
		const getBorderColor = (severity: string) => {
			if (severity === 'critical') return '#D9534F';
			if (severity === 'warning') return '#faad14';
			return '#8CC63F';
		};
		
		return (
			<List.Item
				style={{
					padding: '12px 16px',
					background: '#ffffff',
					borderLeft: `3px solid ${getBorderColor(item.severity)}`,
					borderBottom: '1px solid #f0f0f0',
					transition: 'all 0.3s',
					cursor: 'pointer'
				}}
				onClick={() => handleNotificationClick(item)}
				className="notification-item"
			>
				<div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
					<div style={{ marginRight: 12, display: 'flex', alignItems: 'center' }}>
						{iconMap[item.severity]}
					</div>
					<div style={{ flex: 1 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
							<Typography.Text strong style={{ fontSize: 16 }}>{item.title}</Typography.Text>
							<Typography.Text type="secondary" style={{ fontSize: 14 }}>{item.time}</Typography.Text>
						</div>
						<div style={{ display: 'flex', gap: 16 }}>
							<Typography.Text type="secondary" style={{ fontSize: 14 }}>
								Device: <Typography.Text strong>{item.deviceName}</Typography.Text>
							</Typography.Text>
							<Typography.Text type="secondary" style={{ fontSize: 14 }}>
								Parameter: <Typography.Text strong>{item.parameter}</Typography.Text>
							</Typography.Text>
						</div>
					</div>
					<RightOutlined style={{ fontSize: 12, color: '#ccc', marginLeft: 8 }} />
				</div>
			</List.Item>
		);
	};

	// Helper for interval text
	const getIntervalText = (val?: number) => {
		const map: Record<number, string> = {
			0: 'Disabled', 1: '10min', 2: '15min', 3: '30min', 
			4: '1hour', 5: '6hour', 6: '12hour', 7: 'daily'
		};
		return val !== undefined ? map[val] || val.toString() : 'NULL';
	};

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			{/* Top Row: Device Info (Full Width) */}
			<Row gutter={16} style={{ marginBottom: 16, flexShrink: 0 }}>
				<Col xs={24}>
					<Card 
						title="Device Information" 
						bordered 
						headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }} 
						bodyStyle={{ padding: 16, backgroundColor: '#FFFFFF' }} 
						style={{ height: '100%', backgroundColor: '#FFFFFF', borderColor: '#E1E8ED' }}
						extra={
							<Space>
								<Button 
									type="primary" 
									icon={<ReloadOutlined spin={refreshing} />}
									onClick={handleRefresh}
									loading={refreshing}
									style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
								>
									Refresh
								</Button>
								<Button 
									type="primary"
									icon={<PoweroffOutlined />}
									onClick={handleShutdown}
									style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
								>
									Shutdown
								</Button>
								<Button 
									type="primary"
									icon={<RedoOutlined />}
									onClick={handleRestartT8000}
									style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
								>
									Restart T8000
								</Button>
							</Space>
						}
					>
						<Row gutter={24} align="middle">
							{/* Left: Device Icon */}
							<Col flex="none">
								<div
									style={{
										width: 64,
										height: 64,
										borderRadius: 8,
										background: 'linear-gradient(135deg, rgba(0,58,112,0.12) 0%, rgba(0,58,112,0.05) 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										border: '1px solid rgba(0,58,112,0.2)',
									}}
								>
									<LaptopOutlined style={{ fontSize: 32, color: '#003A70' }} />
								</div>
							</Col>
							
							{/* Middle: Device Info - Optimized Layout */}
							<Col flex="auto">
								<Row gutter={[16, 16]}>
									{/* Row 1 */}
									<Col span={4}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Device Model</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.model}</Typography.Text>
									</Col>
									<Col span={4}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Serial Number</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.sn}</Typography.Text>
									</Col>
									<Col span={3}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Firmware</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.firmware}</Typography.Text>
									</Col>
									<Col span={3}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Hardware</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.hwVersion}</Typography.Text>
									</Col>
									<Col span={3}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Location</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.location}</Typography.Text>
									</Col>
									<Col span={7}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>RTC</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.rtc}</Typography.Text>
									</Col>

									{/* Row 2 */}
									<Col span={4}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>MAC Address</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.macAddress}</Typography.Text>
									</Col>
									<Col span={4}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Network IP</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16, color: networkOk ? undefined : '#ff4d4f' }}>
											{networkOk ? device.ipAddress : 'Offline'}
										</Typography.Text>
									</Col>
									<Col span={3}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Last Comm</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{device.lastCommunication}</Typography.Text>
									</Col>
									<Col span={3}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Status</Typography.Text>
										<Space direction="vertical" size={0} style={{ width: '100%' }}>
											<Badge status={systemRunning ? 'processing' : 'default'} text={<span style={{fontSize: 14}}>Running</span>} />
											<Space size={4}>
												<ApiOutlined style={{ fontSize: 14, color: mqttConnected ? '#52c41a' : '#ff4d4f' }} />
												<span style={{fontSize: 14}}>MQTT Connected</span>
											</Space>
										</Space>
									</Col>
									<Col span={3}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>CPU</Typography.Text>
										<Progress 
											percent={device.cpuUsage} 
											size="small" 
											strokeColor={device.cpuUsage > 80 ? '#ff4d4f' : device.cpuUsage > 60 ? '#faad14' : '#52c41a'}
											showInfo={false}
											style={{ marginBottom: 0 }}
										/>
										<div style={{ fontSize: 13, textAlign: 'right', marginTop: -2 }}>{device.cpuUsage}%</div>
									</Col>
									<Col span={3}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Memory</Typography.Text>
										<Progress 
											percent={device.memoryUsage} 
											size="small" 
											strokeColor={device.memoryUsage > 80 ? '#ff4d4f' : device.memoryUsage > 60 ? '#faad14' : '#52c41a'}
											showInfo={false}
											style={{ marginBottom: 0 }}
										/>
										<div style={{ fontSize: 13, textAlign: 'right', marginTop: -2 }}>{device.memoryUsage}%</div>
									</Col>
									<Col span={4}>
										<Typography.Text type="secondary" style={{ fontSize: 15, display: 'block' }}>Disk</Typography.Text>
										<Progress 
											percent={device.diskUsage} 
											size="small" 
											strokeColor={device.diskUsage > 80 ? '#ff4d4f' : device.diskUsage > 60 ? '#faad14' : '#52c41a'}
											showInfo={false}
											style={{ marginBottom: 0 }}
										/>
										<div style={{ fontSize: 13, textAlign: 'right', marginTop: -2 }}>{device.diskUsage}%</div>
									</Col>
								</Row>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>

			{/* Middle: Notifications + Device Status Pie + Alarm Type Pie */}
			<Row gutter={16} style={{ flexShrink: 0, marginBottom: 16 }}>
				{/* Notifications Box with Segmented Filter */}
				<Col xs={24} lg={12}>
					<Card 
						title={
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
								<Space>
									<span>System Notifications</span>
									<Badge count={counts.all} style={{ backgroundColor: '#003A70' }} />
								</Space>
								<Segmented
									options={[
										{ label: 'All', value: 'all' },
										{ label: 'Critical', value: 'critical', icon: <FireOutlined style={{ color: '#D9534F' }} /> },
										{ label: 'Warning', value: 'warning', icon: <WarningOutlined style={{ color: '#faad14' }} /> },
										{ label: 'Info', value: 'info', icon: <InfoCircleOutlined style={{ color: '#8CC63F' }} /> },
									]}
									value={notificationFilter}
									onChange={(value) => setNotificationFilter(value as 'all' | 'critical' | 'warning' | 'info')}
									size="small"
								/>
							</div>
						}
						bordered 
						headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }}
						bodyStyle={{ padding: 0, backgroundColor: '#FFFFFF' }}
						style={{ height: 340, backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
					>
						<div style={{ 
							height: 268, 
							overflowY: 'auto',
							overflowX: 'hidden',
							borderRadius: '0 0 8px 8px',
						}}>
							<List
								dataSource={filteredNotifications}
								renderItem={renderNotificationItem}
								locale={{ emptyText: 'No new notifications' }}
							/>
						</div>
					</Card>
				</Col>
				
				{/* Right: Device Status (Merged) */}
				<Col xs={24} lg={12}>
					<Card 
						title="Device Status" 
						headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }} 
						bordered 
						bodyStyle={{ padding: 24, backgroundColor: '#FFFFFF', height: 'calc(100% - 57px)' }} 
						style={{ height: 340, backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
					>
						<Row align="middle" justify="center" style={{ height: '100%' }}>
							<Col span={10} style={{ display: 'flex', justifyContent: 'center' }}>
								<Progress
									type="circle"
									percent={Math.round((allDevices.filter(d => d.status === 'online').length / allDevices.length) * 100)}
									size={180}
									strokeColor="#8CC63F"
									trailColor="#D9534F"
									format={() => (
										<div style={{ textAlign: 'center' }}>
											<div style={{ fontSize: 36, fontWeight: 'bold', color: '#003A70' }}>
												{allDevices.length}
											</div>
											<div style={{ fontSize: 16, color: '#999' }}>Total Devices</div>
										</div>
									)}
								/>
							</Col>
							<Col span={14}>
								<Space direction="vertical" size="large" style={{ width: '100%', paddingLeft: 24 }}>
									<Popover 
										placement="right" 
										title="Online Devices" 
										content={
											<List
												size="small"
												dataSource={allDevices.filter(d => d.status === 'online')}
												renderItem={item => (
													<List.Item style={{ padding: '8px 12px' }}>
														<Space>
															<Badge status="success" />
															<Typography.Text>{item.name}</Typography.Text>
															<Tag style={{ marginLeft: 8 }}>{item.model}</Tag>
														</Space>
													</List.Item>
												)}
												style={{ maxHeight: 300, overflow: 'auto', width: 250 }}
											/>
										}
									>
										<div style={{ 
											cursor: 'pointer', 
											padding: '16px 20px', 
											borderRadius: 12, 
											border: '1px solid #f0f0f0', 
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'space-between',
											background: '#fafafa',
											transition: 'all 0.3s'
										}}
										onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8CC63F'}
										onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
										>
											<Space size={16}>
												<div style={{ 
													width: 40, 
													height: 40, 
													borderRadius: '50%', 
													background: 'rgba(140, 198, 63, 0.1)', 
													display: 'flex', 
													alignItems: 'center', 
													justifyContent: 'center' 
												}}>
													<CheckCircleOutlined style={{ color: '#8CC63F', fontSize: 20 }} />
												</div>
												<div>
													<div style={{ fontSize: 15, color: '#888' }}>Online Devices</div>
													<div style={{ fontSize: 28, fontWeight: 'bold', color: '#8CC63F', lineHeight: 1 }}>
														{allDevices.filter(d => d.status === 'online').length}
													</div>
												</div>
											</Space>
											<RightOutlined style={{ fontSize: 14, color: '#ccc' }} />
										</div>
									</Popover>

									<Popover 
										placement="right" 
										title="Offline Devices" 
										content={
											<List
												size="small"
												dataSource={allDevices.filter(d => d.status === 'offline')}
												renderItem={item => (
													<List.Item style={{ padding: '8px 12px' }}>
														<Space>
															<Badge status="error" />
															<Typography.Text>{item.name}</Typography.Text>
															<Tag style={{ marginLeft: 8 }}>{item.model}</Tag>
														</Space>
													</List.Item>
												)}
												style={{ maxHeight: 300, overflow: 'auto', width: 250 }}
											/>
										}
									>
										<div style={{ 
											cursor: 'pointer', 
											padding: '16px 20px', 
											borderRadius: 12, 
											border: '1px solid #f0f0f0', 
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'space-between',
											background: '#fafafa',
											transition: 'all 0.3s'
										}}
										onMouseEnter={(e) => e.currentTarget.style.borderColor = '#D9534F'}
										onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
										>
											<Space size={16}>
												<div style={{ 
													width: 40, 
													height: 40, 
													borderRadius: '50%', 
													background: 'rgba(217, 83, 79, 0.1)', 
													display: 'flex', 
													alignItems: 'center', 
													justifyContent: 'center' 
												}}>
													<DisconnectOutlined style={{ color: '#D9534F', fontSize: 20 }} />
												</div>
												<div>
													<div style={{ fontSize: 15, color: '#888' }}>Offline Devices</div>
													<div style={{ fontSize: 28, fontWeight: 'bold', color: '#D9534F', lineHeight: 1 }}>
														{allDevices.filter(d => d.status === 'offline').length}
													</div>
												</div>
											</Space>
											<RightOutlined style={{ fontSize: 14, color: '#ccc' }} />
										</div>
									</Popover>
								</Space>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>

			{/* Bottom: Devices List with filters and scrollbar - takes remaining space */}
			<div style={{ flex: 1, minHeight: 0 }}>
				<Card 
					title={
						<Space>
							<span>Devices List</span>
							<Badge count={filteredAndSortedDevices.length} style={{ backgroundColor: '#003A70' }} />
						</Space>
					}
					bordered 
					headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }}
					bodyStyle={{ padding: 0, flex: 1, overflow: 'hidden' }}
					style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
					extra={
						<Space size={8}>
							<Input
								placeholder="Search name, type, status..."
								prefix={<SearchOutlined />}
								allowClear
								style={{ width: 240 }}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<Select
								value={modelFilter}
								onChange={setModelFilter}
								style={{ width: 140 }}
								suffixIcon={<FilterOutlined />}
								options={[
									{ label: 'All Models', value: 'all' },
									...deviceModels.map(model => ({ label: model, value: model }))
								]}
							/>
							<Select
								value={statusFilter}
								onChange={setStatusFilter}
								style={{ width: 120 }}
								suffixIcon={<FilterOutlined />}
								options={[
									{ label: 'All Status', value: 'all' },
									{ label: 'Online', value: 'online' },
									{ label: 'Offline', value: 'offline' }
								]}
							/>
						</Space>
					}
				>
					<div ref={tableContainerRef} style={{ height: '100%', overflow: 'hidden' }}>
						<Table
							size="small"
							columns={deviceColumns}
							dataSource={filteredAndSortedDevices}
							pagination={false}
							scroll={{ y: tableScrollHeight }}
							rowClassName={(record) => record.status === 'offline' ? 'offline-row' : ''}
							onRow={(record) => ({
								onClick: () => {
									setSelectedDevice(record);
									setIsDeviceModalVisible(true);
								},
								style: { cursor: 'pointer' }
							})}
							locale={{
								emptyText: 'No devices match the filter criteria'
							}}
						/>
					</div>
					<style>{`
						.offline-row {
							background-color: #ffffff !important;
							border-left: 3px solid #D9534F;
						}
						.offline-row:hover td {
							background-color: #fafafa !important;
						}
					`}</style>
				</Card>
			</div>

			{/* Notification Details Modal */}
			<Modal
				title={
					<Space>
						{selectedNotification?.severity === 'critical' && <FireOutlined style={{ color: '#D9534F' }} />}
						{selectedNotification?.severity === 'warning' && <WarningOutlined style={{ color: '#faad14' }} />}
						{selectedNotification?.severity === 'info' && <InfoCircleOutlined style={{ color: '#8CC63F' }} />}
						<span>{selectedNotification?.title}</span>
					</Space>
				}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={[
					<Button key="ignore" onClick={() => handleMarkAs('ignored')}>
						Mark as Ignored
					</Button>,
					<Button 
						key="acknowledge" 
						type="primary" 
						onClick={() => handleMarkAs('acknowledged')}
						style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
					>
						Acknowledge
					</Button>,
				]}
			>
				{selectedNotification && (
					<div style={{ padding: '10px 0' }}>
						<div style={{ marginBottom: 24, background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
							<Row gutter={[16, 16]}>
								<Col span={12}>
									<Typography.Text type="secondary">Device</Typography.Text>
									<div><Typography.Text strong>{selectedNotification.deviceName}</Typography.Text></div>
								</Col>
								<Col span={12}>
									<Typography.Text type="secondary">Parameter</Typography.Text>
									<div><Typography.Text strong>{selectedNotification.parameter}</Typography.Text></div>
								</Col>
								<Col span={12}>
									<Typography.Text type="secondary">Time</Typography.Text>
									<div><Typography.Text>{selectedNotification.time}</Typography.Text></div>
								</Col>
								<Col span={12}>
									<Typography.Text type="secondary">Status</Typography.Text>
									<div>
										<Tag color="#003A70" style={{ border: 'none' }}>
											{selectedNotification.events[selectedNotification.events.length - 1].type === 'normalized' ? 'CLOSED' : 'PENDING'}
										</Tag>
									</div>
								</Col>
							</Row>
						</div>
						
						<Typography.Title level={5} style={{ fontSize: 14, marginBottom: 16 }}>Event Timeline</Typography.Title>
						<Timeline
							items={selectedNotification.events.map(event => ({
								color: event.type === 'triggered' ? 'red' : 'green',
								children: (
									<>
										<Typography.Text strong>{dayjs.unix(event.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
										<br />
										<Typography.Text type="secondary">
											{event.type === 'triggered' ? 'Triggered' : 'Normalized'}: {event.value}
										</Typography.Text>
									</>
								),
								dot: event.type === 'triggered' ? <ClockCircleOutlined style={{ fontSize: 16 }} /> : <CheckCircleOutlined style={{ fontSize: 16 }} />,
							}))}
						/>
					</div>
				)}
			</Modal>

			{/* Device Detail Modal */}
			<Modal
				title="Device Details"
				open={isDeviceModalVisible}
				onCancel={() => setIsDeviceModalVisible(false)}
				footer={null}
				width="95%"
				style={{ top: 20 }}
				bodyStyle={{ padding: 0, backgroundColor: '#f0f2f5' }}
				zIndex={1050}
			>
				{selectedDevice && (
					<div style={{ padding: '24px' }}>
						{/* Part 1: Top - Device Information (Merged Basic + Comm) */}
						<Card bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: '24px' }}>
							<Row gutter={[24, 16]}>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Device Name</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.name}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Model</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.model}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Serial Number</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.serialNumber}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Firmware Version</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.fw_ver ?? 'NULL'}</div>
								</Col>

								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Status</Typography.Text>
									<div><Badge status={selectedDevice.status === 'online' ? 'success' : 'error'} text={selectedDevice.status} /></div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Alarm State</Typography.Text>
									<div><Tag>{selectedDevice.alarm_state}</Tag></div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Error State</Typography.Text>
									<div><Tag>{selectedDevice.err_state}</Tag></div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Last Report</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.lastReport}</div>
								</Col>

								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Modbus Address</Typography.Text>
									<div style={{ fontSize: 14 }}>Pri: {selectedDevice.pri_addr ?? 'NULL'}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Secondary Address</Typography.Text>
									<div style={{ fontSize: 14 }}>{selectedDevice.sec_addr ?? 'NULL'}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Tertiary Address</Typography.Text>
									<div style={{ fontSize: 14 }}>{selectedDevice.ter_addr ?? 'NULL'}</div>
								</Col>
								<Col span={6}>
									{/* Empty spacer */}
								</Col>

								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Logging Interval</Typography.Text>
									<div style={{ fontSize: 14 }}>{getIntervalText(selectedDevice.log_intvl)}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Reporting Interval</Typography.Text>
									<div style={{ fontSize: 14 }}>{getIntervalText(selectedDevice.report_intvl)}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Health Interval</Typography.Text>
									<div style={{ fontSize: 14 }}>{getIntervalText(selectedDevice.health_intvl)}</div>
								</Col>
							</Row>
						</Card>

						<Row gutter={16}>
							{/* Part 2: Left - Location */}
							<Col span={8}>
								<Card title="Location Information" bordered={false} style={{ height: '100%' }}>
									<Descriptions column={1} size="small" bordered>
										<Descriptions.Item label="Location ID">{selectedDevice.loc_id ?? 'NULL'}</Descriptions.Item>
										<Descriptions.Item label="Location Name">{selectedDevice.loc_name ?? 'NULL'}</Descriptions.Item>
										<Descriptions.Item label="Subname">{selectedDevice.loc_subname ?? 'NULL'}</Descriptions.Item>
										<Descriptions.Item label="Block">{selectedDevice.loc_blk ?? 'NULL'}</Descriptions.Item>
										<Descriptions.Item label="Unit">{selectedDevice.loc_unit ?? 'NULL'}</Descriptions.Item>
										<Descriptions.Item label="Postal Code">{selectedDevice.postal_code ?? 'NULL'}</Descriptions.Item>
										<Descriptions.Item label="Address">{selectedDevice.loc_addr ?? 'NULL'}</Descriptions.Item>
										<Descriptions.Item label="Coordinates (X, Y)">
											{selectedDevice.x ?? 'NULL'}, {selectedDevice.y ?? 'NULL'}
										</Descriptions.Item>
										<Descriptions.Item label="Height (H)">{selectedDevice.h ?? 'NULL'}</Descriptions.Item>
									</Descriptions>
								</Card>
							</Col>

							{/* Part 3: Right - Parameters */}
							<Col span={16}>
								<Card 
									title="Device Parameters" 
									bordered={false}
									style={{ height: '480px', display: 'flex', flexDirection: 'column' }}
									bodyStyle={{ 
										padding: '16px',
										overflowY: 'auto',
										flex: 1,
									}}
								>
									<Row gutter={[16, 16]}>
										{selectedDevice.parameters && Object.entries(selectedDevice.parameters).map(([key, value]) => {
											const config = writableConfigs[key];
											const isWritable = !!config;
											
											return (
												<Col span={8} key={key}>
													<Card
														size="small"
														style={{ 
															backgroundColor: '#fafafa',
															border: isWritable ? '1px solid #1890ff' : '1px solid #d9d9d9',
															cursor: 'default',
															transition: 'all 0.3s'
														}}
														bodyStyle={{ padding: '12px' }}
														hoverable={false}
													>
														<Space direction="vertical" size={4} style={{ width: '100%' }}>
															<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
																<Typography.Text style={{ color: '#888', fontSize: 11, textTransform: 'uppercase' }}>
																	{key.replace(/([A-Z])/g, ' $1').trim()}
																	{parameterUnits[key] ? ` (${parameterUnits[key]})` : ''}
																</Typography.Text>
																{isWritable && <EditOutlined style={{ color: '#1890ff', fontSize: 12 }} />}
															</div>
															
															{isWritable ? (
																<div style={{ marginTop: 4 }}>
																	{config.type === 'number' && (
																		<InputNumber
																			size="middle"
																			value={value as number}
																			style={{ width: '100%' }}
																			onChange={(val) => {
																				if (selectedDevice && val !== null) {
																					setSelectedDevice({
																						...selectedDevice,
																						parameters: {
																							...selectedDevice.parameters,
																							[key]: val
																						}
																					});
																				}
																			}}
																		/>
																	)}
																	{config.type === 'select' && (
																		<Select
																			size="middle"
																			value={value as string}
																			style={{ width: '100%' }}
																			onChange={(val) => {
																				if (selectedDevice) {
																					setSelectedDevice({
																						...selectedDevice,
																						parameters: {
																							...selectedDevice.parameters,
																							[key]: val
																						}
																					});
																				}
																			}}
																		>
																			{config.options?.map(opt => (
																				<Select.Option key={opt} value={opt}>{opt}</Select.Option>
																			))}
																		</Select>
																	)}
																	{config.type === 'switch' && (
																		<Switch
																			checked={Number(value) === 1}
																			onChange={(checked) => {
																				if (selectedDevice) {
																					setSelectedDevice({
																						...selectedDevice,
																						parameters: {
																							...selectedDevice.parameters,
																							[key]: checked ? 1 : 0
																						}
																					});
																				}
																			}}
																		/>
																	)}
																</div>
															) : (
																<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
																	{typeof value === 'number' ? value.toFixed(2) : value}
																</Typography.Text>
															)}
														</Space>
													</Card>
												</Col>
											);
										})}
									</Row>
								</Card>
							</Col>
						</Row>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Overview;
