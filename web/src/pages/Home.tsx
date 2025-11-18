import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
	Avatar,
	Button,
	Collapse,
	message,
	Input,
	Select,
	Progress,
} from 'antd';
import {
	LaptopOutlined,
	ApiOutlined,
	WifiOutlined,
	FieldTimeOutlined,
	InfoCircleOutlined,
	WarningOutlined,
	DisconnectOutlined,
	CheckCircleOutlined,
	FireOutlined,
	ReloadOutlined,
	RedoOutlined,
	RadarChartOutlined,
	FolderOpenOutlined,
	AppstoreOutlined,
	ControlOutlined,
	SearchOutlined,
	FilterOutlined,
} from '@ant-design/icons';

// Notification data
interface NotificationItem {
	id: string;
	type: 'alarm' | 'offline' | 'warning' | 'info';
	severity: 'critical' | 'warning' | 'info';
	title: string;
	message: string;
	time: string;
}

const notifications: NotificationItem[] = [
	{ id: '1', type: 'alarm', severity: 'critical', title: 'High Temperature Alert', message: 'Temperature Sensor 1 reading 85°C', time: '2 min ago' },
	{ id: '2', type: 'offline', severity: 'critical', title: 'Device Offline', message: 'Controller C5 disconnected', time: '10 min ago' },
	{ id: '3', type: 'warning', severity: 'warning', title: 'Low Battery Warning', message: 'Sensor A3 battery at 15%', time: '15 min ago' },
	{ id: '4', type: 'alarm', severity: 'critical', title: 'Pressure Exceeded', message: 'Sensor A3 reading 120 PSI', time: '20 min ago' },
	{ id: '5', type: 'info', severity: 'info', title: 'Firmware Update Available', message: 'Version v1.33.0.1 is now available', time: '1 hour ago' },
	{ id: '6', type: 'offline', severity: 'critical', title: 'Device Offline', message: 'Gateway G2 lost connection', time: '2 hours ago' },
	{ id: '7', type: 'warning', severity: 'warning', title: 'Network Latency', message: 'MQTT response time >500ms', time: '3 hours ago' },
	{ id: '8', type: 'warning', severity: 'warning', title: 'Memory Usage High', message: 'System memory usage at 85%', time: '4 hours ago' },
	{ id: '9', type: 'warning', severity: 'warning', title: 'Disk Space Low', message: 'Storage usage at 90%', time: '5 hours ago' },
	{ id: '10', type: 'info', severity: 'info', title: 'Device Added', message: 'New sensor B8 registered', time: '6 hours ago' },
	{ id: '11', type: 'info', severity: 'info', title: 'Configuration Updated', message: 'MQTT settings changed', time: '8 hours ago' },
	{ id: '12', type: 'info', severity: 'info', title: 'Routine Maintenance', message: 'System check completed successfully', time: '10 hours ago' },
];

// Simple device list columns definition
interface DeviceRow {
	key: string;
	name: string;
	type: string;
	status: 'online' | 'offline';
	lastSeen: string;
}

const deviceRows: DeviceRow[] = [
	{ key: '1', name: 'Temperature Sensor 1', type: 'Temp', status: 'online', lastSeen: 'Just now' },
	{ key: '2', name: 'Temperature Sensor 2', type: 'Temp', status: 'online', lastSeen: '1 min ago' },
	{ key: '3', name: 'Gateway G2', type: 'Gateway', status: 'online', lastSeen: '2 min ago' },
	{ key: '4', name: 'Controller C5', type: 'Actuator', status: 'offline', lastSeen: '10 min ago' },
	{ key: '5', name: 'Sensor A3', type: 'Pressure', status: 'online', lastSeen: '3 min ago' },
	{ key: '6', name: 'Sensor B4', type: 'Humidity', status: 'online', lastSeen: '5 min ago' },
	{ key: '7', name: 'Sensor B5', type: 'Humidity', status: 'online', lastSeen: '5 min ago' },
	{ key: '8', name: 'Energy Meter T-EMS-01', type: 'Energy', status: 'online', lastSeen: '1 min ago' },
	{ key: '9', name: 'Gateway G3', type: 'Gateway', status: 'offline', lastSeen: '25 min ago' },
	{ key: '10', name: 'Temperature Sensor 3', type: 'Temp', status: 'online', lastSeen: '2 min ago' },
	{ key: '11', name: 'Controller C6', type: 'Actuator', status: 'online', lastSeen: '4 min ago' },
	{ key: '12', name: 'Pressure Sensor A4', type: 'Pressure', status: 'online', lastSeen: '6 min ago' },
	{ key: '13', name: 'Humidity Sensor B6', type: 'Humidity', status: 'offline', lastSeen: '15 min ago' },
	{ key: '14', name: 'Temperature Sensor 4', type: 'Temp', status: 'online', lastSeen: '3 min ago' },
	{ key: '15', name: 'Gateway G4', type: 'Gateway', status: 'online', lastSeen: '1 min ago' },
	{ key: '16', name: 'Controller C7', type: 'Actuator', status: 'online', lastSeen: '7 min ago' },
	{ key: '17', name: 'Sensor A5', type: 'Pressure', status: 'online', lastSeen: '8 min ago' },
	{ key: '18', name: 'Sensor B7', type: 'Humidity', status: 'online', lastSeen: '9 min ago' },
	{ key: '19', name: 'Temperature Sensor 5', type: 'Temp', status: 'online', lastSeen: '2 min ago' },
	{ key: '20', name: 'Gateway G5', type: 'Gateway', status: 'online', lastSeen: 'Just now' },
];

const deviceColumns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		render: (text: string) => <Typography.Text>{text}</Typography.Text>,
	},
	{
		title: 'Type',
		dataIndex: 'type',
		key: 'type',
			render: (text: string) => <Tag>{text}</Tag>,
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (_: string, row: DeviceRow) => {
			const statusText = row.status === 'online' ? 'Online' : 'Offline';
			const statusColor = row.status === 'online' ? 'success' : 'error';
			return <Badge status={statusColor} text={statusText} />;
		},
	},
	{
		title: 'Last seen',
		dataIndex: 'lastSeen',
		key: 'lastSeen',
			render: (text: string) => <Typography.Text>{text}</Typography.Text>,
	},
];

const Home: React.FC = () => {
	const navigate = useNavigate();
	const [refreshing, setRefreshing] = useState(false);
	
	// Filter states
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	
	// Mocked data – replace with real API data later
	const device = {
		model: 'T8000',
		sn: '200310000092',
		firmware: 'v1.32.3.2',
		location: 'Floor 2 / Zone 3',
		lastCommunication: '1 minutes ago',
	};

	const systemRunning = true; // mock status
	const mqttOk = true;
	const networkOk = true;
	
	// Get unique device types for filter options
	const deviceTypes = useMemo(() => {
		const types = new Set(deviceRows.map(d => d.type));
		return Array.from(types).sort();
	}, []);
	
	// Filter and sort devices
	const filteredAndSortedDevices = useMemo(() => {
		let filtered = [...deviceRows];
		
		// Apply search filter
		if (searchText) {
			const search = searchText.toLowerCase();
			filtered = filtered.filter(device => 
				device.name.toLowerCase().includes(search) ||
				device.type.toLowerCase().includes(search) ||
				device.status.toLowerCase().includes(search)
			);
		}
		
		// Apply type filter
		if (typeFilter !== 'all') {
			filtered = filtered.filter(device => device.type === typeFilter);
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
	}, [searchText, typeFilter, statusFilter]);
	
	// Group notifications by severity
	const criticalNotifications = notifications.filter(n => n.severity === 'critical');
	const warningNotifications = notifications.filter(n => n.severity === 'warning');
	const infoNotifications = notifications.filter(n => n.severity === 'info');
	
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
	
	const handleRescanDevices = () => {
		message.info('Rescanning devices...');
		setTimeout(() => {
			message.success('Device scan completed');
		}, 1500);
	};
	
	const handleExportLogs = () => {
		message.info('Exporting logs...');
		setTimeout(() => {
			message.success('Logs exported successfully');
		}, 1000);
	};
	
	const handleJumpToDevices = () => {
		navigate('/devices');
	};
	
	const handleGoToRules = () => {
		navigate('/rules');
	};
	
	// Render notification item
	const renderNotificationItem = (item: NotificationItem) => {
		const iconMap = {
			alarm: <FireOutlined style={{ color: '#D9534F' }} />,
			offline: <DisconnectOutlined style={{ color: '#D9534F' }} />,
			warning: <WarningOutlined style={{ color: '#faad14' }} />,
			info: <CheckCircleOutlined style={{ color: '#8CC63F' }} />
		};
		
		// 所有通知使用白色背景 + 左侧彩色边条
		const getBorderStyle = (severity: string) => {
			if (severity === 'critical') {
				return '3px solid #D9534F';
			} else if (severity === 'warning') {
				return '3px solid #faad14';
			} else {
				return '3px solid #8CC63F';
			}
		};
		
		const getLabelColor = (severity: string) => {
			if (severity === 'critical') {
				return '#D9534F';
			} else if (severity === 'warning') {
				return '#faad14';
			} else {
				return '#8CC63F';
			}
		};
		
		const getLabelText = (severity: string) => {
			// 首字母大写
			return severity.charAt(0).toUpperCase() + severity.slice(1);
		};
		
		return (
			<List.Item
				style={{
					padding: '12px 16px',
					background: '#ffffff',
					borderLeft: getBorderStyle(item.severity),
					borderBottom: '1px solid #f0f0f0',
					transition: 'all 0.3s',
					cursor: 'pointer'
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = '#fafafa';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = '#ffffff';
				}}
			>
				<List.Item.Meta
					avatar={<Avatar icon={iconMap[item.type]} style={{ background: 'transparent' }} />}
					title={
						<Space>
							<Typography.Text strong style={{ fontSize: 13, color: getLabelColor(item.severity) }}>
								{getLabelText(item.severity)}
							</Typography.Text>
							<Typography.Text strong style={{ fontSize: 13 }}>{item.title}</Typography.Text>
							<Typography.Text type="secondary" style={{ fontSize: 11 }}>{item.time}</Typography.Text>
						</Space>
					}
					description={
						<Typography.Text style={{ fontSize: 12 }}>{item.message}</Typography.Text>
					}
				/>
			</List.Item>
		);
	};

	return (
		<div style={{ height: 'calc(100vh - 56px - 32px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			{/* Top Row: Device Info (Left) + Quick Actions (Right) */}
			<Row gutter={16} style={{ marginBottom: 16, flexShrink: 0 }}>
			{/* Left: Compact device info with Refresh button */}
			<Col xs={24} lg={12}>
				<Card title="Device Information" bordered headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }} bodyStyle={{ padding: 16, backgroundColor: '#FFFFFF' }} style={{ height: '100%', backgroundColor: '#FFFFFF', borderColor: '#E1E8ED' }}>
					<Row gutter={16} align="middle">
							{/* Device Icon */}
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
							
							{/* Device Info */}
							<Col flex="auto">
								<Space direction="vertical" size={4} style={{ width: '100%' }}>
									<Space size={16} align="baseline">
										<div>
											<Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Model</Typography.Text>
											<Typography.Title level={5} style={{ margin: 0, fontSize: 16 }}>{device.model}</Typography.Title>
										</div>
										<div>
											<Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Serial Number</Typography.Text>
											<Typography.Text strong style={{ fontSize: 13 }}>{device.sn}</Typography.Text>
										</div>
										<div>
											<Typography.Text type="secondary" style={{ fontSize: 12, display: 'block' }}>FW</Typography.Text>
											<Typography.Text strong style={{ fontSize: 13 }}>{device.firmware}</Typography.Text>
										</div>
									</Space>
									
									<Space size={6} wrap>
										<Badge color="#003A70" text={<span style={{ fontSize: 11 }}>{systemRunning ? 'Running' : 'Stopped'}</span>} />
										<Badge status={mqttOk ? 'success' : 'error'} text={<span style={{ fontSize: 11 }}><ApiOutlined /> MQTT {mqttOk ? 'OK' : 'Down'}</span>} />
										<Badge status={networkOk ? 'success' : 'error'} text={<span style={{ fontSize: 11 }}><WifiOutlined /> Network {networkOk ? 'Online' : 'Offline'}</span>} />
										<Tag icon={<FieldTimeOutlined />} style={{ fontSize: 11 }}>{device.lastCommunication}</Tag>
										<Tag style={{ fontSize: 11 }}>{device.location}</Tag>
									</Space>
								</Space>
							</Col>
							
							{/* Refresh Button */}
							<Col flex="none">
								<Button 
									type="primary" 
									icon={<ReloadOutlined spin={refreshing} />}
									onClick={handleRefresh}
									loading={refreshing}
									style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
								>
									Refresh
								</Button>
							</Col>
						</Row>
					</Card>
				</Col>
				
				{/* Right: Quick Actions */}
				<Col xs={24} lg={12}>
					<Card title="Quick Actions" bordered headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }} bodyStyle={{ padding: 16, backgroundColor: '#FFFFFF' }} style={{ height: '100%', backgroundColor: '#FFFFFF', borderColor: '#E1E8ED' }}>
						<Space size={8} wrap>
							<Button icon={<RedoOutlined />} onClick={handleRestartT8000} danger>
								Restart T8000
							</Button>
							<Button icon={<RadarChartOutlined />} onClick={handleRescanDevices}>
								Rescan Devices
							</Button>
							<Button icon={<FolderOpenOutlined />} onClick={handleExportLogs}>
								Export Logs
							</Button>
							<Button icon={<AppstoreOutlined />} onClick={handleJumpToDevices}>
								Device Page
							</Button>
							<Button icon={<ControlOutlined />} onClick={handleGoToRules}>
								Rule Engine
							</Button>
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Middle: Notifications + Device Status Pie + Alarm Type Pie */}
			<Row gutter={16} style={{ flexShrink: 0, marginBottom: 16 }}>
				{/* Notifications Box with Collapsible Sections */}
				<Col xs={24} lg={12}>
					<Card 
						title={
							<Space>
								<span>System Notifications</span>
								<Badge count={criticalNotifications.length} style={{ backgroundColor: '#003A70' }} />
							</Space>
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
							paddingRight: 4
						}}>
							<style>{`
								div::-webkit-scrollbar {
									width: 6px;
								}
								div::-webkit-scrollbar-track {
									background: transparent;
									margin-bottom: 8px;
								}
								div::-webkit-scrollbar-thumb {
									background: #d0d0d0;
									border-radius: 3px;
								}
								div::-webkit-scrollbar-thumb:hover {
									background: #b0b0b0;
								}
							`}</style>
							<Collapse 
								defaultActiveKey={['critical']} 
								ghost
								expandIconPosition="end"
								items={[
									{
										key: 'critical',
									label: (
										<Space style={{ width: '100%', justifyContent: 'space-between' }}>
											<Space>
												<FireOutlined style={{ color: '#D9534F' }} />
												<Typography.Text strong>Critical</Typography.Text>
												<Badge count={criticalNotifications.length} style={{ backgroundColor: '#D9534F' }} />
											</Space>
										</Space>
									),
										children: (
											<List
												dataSource={criticalNotifications}
												renderItem={renderNotificationItem}
												style={{ marginTop: -8 }}
											/>
										)
									},
									{
										key: 'warning',
										label: (
											<Space style={{ width: '100%', justifyContent: 'space-between' }}>
												<Space>
													<WarningOutlined style={{ color: '#faad14' }} />
													<Typography.Text strong>Warning</Typography.Text>
													<Badge count={warningNotifications.length} style={{ backgroundColor: '#faad14' }} />
													<Typography.Text type="secondary" style={{ fontSize: 11 }}>
														(showing {Math.min(3, warningNotifications.length)} of {warningNotifications.length})
													</Typography.Text>
												</Space>
											</Space>
										),
										children: (
											<List
												dataSource={warningNotifications.slice(0, 3)}
												renderItem={renderNotificationItem}
												style={{ marginTop: -8 }}
											/>
										)
									},
									{
										key: 'info',
										label: (
											<Space style={{ width: '100%', justifyContent: 'space-between' }}>
												<Space>
													<InfoCircleOutlined style={{ color: '#8CC63F' }} />
													<Typography.Text strong>Info</Typography.Text>
													<Badge count={infoNotifications.length} style={{ backgroundColor: '#8CC63F' }} />
												</Space>
											</Space>
										),
										children: (
											<List
												dataSource={infoNotifications}
												renderItem={renderNotificationItem}
												style={{ marginTop: -8 }}
											/>
										)
									}
								]}
							/>
						</div>
					</Card>
				</Col>
				
				{/* Right: Two Pie Charts */}
				<Col xs={24} lg={12}>
					<Row gutter={16} style={{ marginBottom: 16 }}>
						{/* Device Status */}
						<Col span={12}>
							<Card 
								title="Device Status" headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }} 
								bordered 
								bodyStyle={{ padding: 16, backgroundColor: '#FFFFFF' }} 
								style={{ height: 320, backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
							>
							{deviceRows.filter(d => d.status === 'offline').length > 0 && (
								<div style={{ 
									marginBottom: 12, 
									padding: '6px 10px', 
									backgroundColor: '#003A70', 
									border: '1px solid #003A70',
										borderRadius: 4,
										display: 'flex',
										alignItems: 'center'
									}}>
										<WarningOutlined style={{ color: '#ffffff', marginRight: 6, fontSize: 14 }} />
										<Typography.Text style={{ color: '#ffffff', fontSize: 11 }}>
											<strong>{deviceRows.filter(d => d.status === 'offline').length}</strong> device(s) offline
										</Typography.Text>
									</div>
								)}
								<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
									<Progress
										type="circle"
										percent={Math.round((deviceRows.filter(d => d.status === 'online').length / deviceRows.length) * 100)}
										size={150}
										strokeColor="#8CC63F"
										trailColor="#D9534F"
										format={() => (
											<div style={{ textAlign: 'center' }}>
												<div style={{ fontSize: 26, fontWeight: 'bold', color: '#8CC63F' }}>
													{deviceRows.filter(d => d.status === 'online').length}
												</div>
												<div style={{ fontSize: 12, color: '#999' }}>Online</div>
											</div>
										)}
									/>
								</div>
								<div style={{ 
									display: 'flex', 
									justifyContent: 'space-around', 
									alignItems: 'center',
									paddingTop: 8,
									paddingBottom: 8,
									borderTop: '1px solid #f0f0f0'
								}}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<CheckCircleOutlined style={{ fontSize: 16, color: '#8CC63F', marginRight: 6 }} />
										<Typography.Text strong style={{ fontSize: 12, marginRight: 4 }}>Online:</Typography.Text>
										<Typography.Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8CC63F' }}>
											{deviceRows.filter(d => d.status === 'online').length}
										</Typography.Text>
									</div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<DisconnectOutlined style={{ fontSize: 16, color: '#D9534F', marginRight: 6 }} />
										<Typography.Text strong style={{ fontSize: 12, marginRight: 4 }}>Offline:</Typography.Text>
										<Typography.Text style={{ fontSize: 16, fontWeight: 'bold', color: '#D9534F' }}>
											{deviceRows.filter(d => d.status === 'offline').length}
										</Typography.Text>
									</div>
								</div>
							</Card>
						</Col>
						
						{/* Alarm Types */}
						<Col span={12}>
							<Card 
								title="Alarm Types" headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }} 
								bordered 
								bodyStyle={{ padding: 16, backgroundColor: '#FFFFFF' }} 
								style={{ height: 320, backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
							>
							{criticalNotifications.length > 0 && (
								<div style={{ 
									marginBottom: 12, 
									padding: '6px 10px', 
									backgroundColor: '#003A70', 
									border: '1px solid #003A70',
									borderRadius: 4,
									display: 'flex',
									alignItems: 'center'
								}}>
									<FireOutlined style={{ color: '#ffffff', marginRight: 6, fontSize: 14 }} />
									<Typography.Text style={{ color: '#ffffff', fontSize: 11 }}>
										<strong>{criticalNotifications.length}</strong> critical alarm(s) triggered
									</Typography.Text>
								</div>
							)}
								<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
									<Progress
										type="circle"
										percent={100}
										size={150}
										strokeColor={{
											'0%': '#D9534F',
											[`${(criticalNotifications.length / notifications.length) * 100}%`]: '#D9534F',
											[`${(criticalNotifications.length / notifications.length) * 100}%`]: '#faad14',
											[`${((criticalNotifications.length + warningNotifications.length) / notifications.length) * 100}%`]: '#faad14',
											[`${((criticalNotifications.length + warningNotifications.length) / notifications.length) * 100}%`]: '#8CC63F',
											'100%': '#8CC63F'
										}}
										format={() => (
											<div style={{ textAlign: 'center' }}>
												<div style={{ fontSize: 26, fontWeight: 'bold', color: '#D9534F' }}>
													{notifications.length}
												</div>
												<div style={{ fontSize: 12, color: '#999' }}>Total</div>
											</div>
										)}
									/>
								</div>
								<div style={{ 
									display: 'flex', 
									justifyContent: 'space-around', 
									alignItems: 'center',
									paddingTop: 8,
									paddingBottom: 8,
									borderTop: '1px solid #f0f0f0'
								}}>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<FireOutlined style={{ fontSize: 14, color: '#D9534F', marginRight: 4 }} />
										<Typography.Text strong style={{ fontSize: 11, marginRight: 3 }}>Critical:</Typography.Text>
										<Typography.Text style={{ fontSize: 15, fontWeight: 'bold', color: '#D9534F' }}>
											{criticalNotifications.length}
										</Typography.Text>
									</div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<WarningOutlined style={{ fontSize: 14, color: '#faad14', marginRight: 4 }} />
										<Typography.Text strong style={{ fontSize: 11, marginRight: 3 }}>Warning:</Typography.Text>
										<Typography.Text style={{ fontSize: 15, fontWeight: 'bold', color: '#faad14' }}>
											{warningNotifications.length}
										</Typography.Text>
									</div>
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<InfoCircleOutlined style={{ fontSize: 14, color: '#8CC63F', marginRight: 4 }} />
										<Typography.Text strong style={{ fontSize: 11, marginRight: 3 }}>Info:</Typography.Text>
										<Typography.Text style={{ fontSize: 15, fontWeight: 'bold', color: '#8CC63F' }}>
											{infoNotifications.length}
										</Typography.Text>
									</div>
								</div>
							</Card>
						</Col>
					</Row>
				</Col>
			</Row>

			{/* Bottom: Devices List with filters and scrollbar - takes remaining space */}
			<div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
				<Card 
					title={
						<Space>
							<span>Devices List</span>
							<Badge count={filteredAndSortedDevices.length} style={{ backgroundColor: '#003A70' }} />
						</Space>
					}
					bordered 
			headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED' }}
	bodyStyle={{ padding: 0, height: 'calc(100% - 57px)' }}
					style={{ height: '100%', backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
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
								value={typeFilter}
								onChange={setTypeFilter}
								style={{ width: 140 }}
								suffixIcon={<FilterOutlined />}
								options={[
									{ label: 'All Types', value: 'all' },
									...deviceTypes.map(type => ({ label: type, value: type }))
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
					<div style={{ 
						height: '100%',
						overflowY: 'auto',
						overflowX: 'hidden'
					}}>
						<Table
							size="small"
							columns={deviceColumns}
							dataSource={filteredAndSortedDevices}
							pagination={false}
							rowClassName={(record) => record.status === 'offline' ? 'offline-row' : ''}
							style={{ marginBottom: 0 }}
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
		</div>
	);
};

export default Home;



