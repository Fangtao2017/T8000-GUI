import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
	Progress,
	Modal,
	Timeline,
	Segmented,
	Popover,
	Descriptions,
	InputNumber,
	Switch,
	Select,
	Spin
} from 'antd';
import {
	ApiOutlined,
	InfoCircleOutlined,
	WarningOutlined,
	DisconnectOutlined,
	CheckCircleOutlined,
	FireOutlined,
	ReloadOutlined,
	SearchOutlined,
	RightOutlined,
	ClockCircleOutlined,
	EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { type DeviceData, parameterUnits, writableConfigs } from '../data/devicesData';
import { fetchDevices } from '../api/deviceApi';
import { useNotifications, type NotificationItem } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

// Module-level cache to persist data across remounts (stale-while-revalidate)
let cachedSystemInfo: any = null;
let cachedDevices: DeviceData[] | null = null;

// deviceColumns moved inside component
const Overview: React.FC = () => {
	const navigate = useNavigate();
	
    // Initialize state from cache if available
	const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(!cachedSystemInfo); // Full page load only if no cache

	// Filter states
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');

	// Device Modal states
	const [isDeviceModalVisible, setIsDeviceModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
    
    // System Info State
    const [systemInfo, setSystemInfo] = useState(cachedSystemInfo || {
        device_count: 0,
        serial_number: 'Loading...',
        firmware_version: 'Loading...',
        hardware_version: 'Loading...',
        network_ip: 'Loading...',
        mac_address: 'Loading...',
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        rtc: 'Loading...'
    });

    // Devices State
    const [devices, setDevices] = useState<DeviceData[]>(cachedDevices || []);

    // Unified Fetch Function
    const fetchData = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else if (!cachedSystemInfo) {
            setLoading(true);
        }

        try {
            const overviewUrl = `/api/overview`;
            
            // Fetch both in parallel
            const [sysRes, devData] = await Promise.all([
                fetch(overviewUrl, { cache: 'no-store' }).then(res => {
                    if (!res.ok) throw new Error('System info fetch failed');
                    return res.json();
                }),
                fetchDevices()
            ]);

            // Update Cache
            cachedSystemInfo = sysRes;
            cachedDevices = devData;

            // Update State
            setSystemInfo(sysRes);
            setDevices(devData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval>;

        const startPolling = () => {
            if (intervalId) clearInterval(intervalId);
            // 2. Auto-refetch every 10 seconds (Optimized from 5s)
            intervalId = setInterval(() => {
                if (!document.hidden) {
                    fetchData(true);
                }
            }, 10000);
        };

        // 1. Always refetch on mount
        fetchData(false);
        startPolling();

        // 3. Visibility change handler
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearInterval(intervalId);
            } else {
                fetchData(true); // Immediate update
                startPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchData]);
	
    // Handle manual refresh
	const handleRefresh = () => {
        message.loading('Refreshing overview...', 0.5);
		fetchData(true);
	};
	
	// Mocked data – replace with real API data later
	const device = {
		model: 'T8000',
		sn: systemInfo.serial_number,
		firmware: systemInfo.firmware_version,
		hwVersion: systemInfo.hardware_version,
		location: 'Floor 2 / Zone 3', // Placeholder as API doesn't provide system location yet
		lastCommunication: '1 minutes ago',
		ipAddress: systemInfo.network_ip,
		macAddress: systemInfo.mac_address,
		rtc: systemInfo.rtc,
		cpuUsage: systemInfo.cpu_usage,
		memoryUsage: systemInfo.memory_usage,
		diskUsage: systemInfo.disk_usage,
	};

	const systemRunning = true; // T8000 running status
	const mqttConnected = true;
	const networkOk = true;
	
	// Filter and sort devices
	const filteredAndSortedDevices = useMemo(() => {
		let filtered = [...devices];
		
		// Apply search filter
		if (searchText) {
			const search = searchText.toLowerCase();
			filtered = filtered.filter(device => 
				device.name.toLowerCase().includes(search) ||
				device.modelName.toLowerCase().includes(search)
			);
		}
		
		// Apply status filter
		if (statusFilter !== 'all') {
            const statusVal = statusFilter === 'online' ? 1 : 0;
			filtered = filtered.filter(device => device.nwkStatus === statusVal);
		}
		
		// Sort: offline first
		filtered.sort((a, b) => {
			if (a.nwkStatus === 0 && b.nwkStatus === 1) return -1;
			if (a.nwkStatus === 1 && b.nwkStatus === 0) return 1;
			return 0;
		});
		
		return filtered;
	}, [searchText, statusFilter, devices]);

	// Controllable devices
	// const controllableDevices = useMemo(() => {
	// 	return allDevices.filter(d => 
	// 		d.parameters && Object.keys(d.parameters).some(k => writableConfigs[k])
	// 	);
	// }, []);

	// Control Modal states
	const [isControlModalVisible, setIsControlModalVisible] = useState(false);
	// const [controlDevice, setControlDevice] = useState<DeviceData | null>(null);
	const [controlDevice] = useState<DeviceData | null>(null);
	const [pendingControlChanges, setPendingControlChanges] = useState<Record<string, number | string | null>>({});

	// const handleControlClick = (device: DeviceData) => {
	// 	setControlDevice(device);
	// 	// Initialize pending changes with current values
	// 	const initialChanges: Record<string, any> = {};
	// 	if (device.parameters) {
	// 		Object.keys(device.parameters).forEach(key => {
	// 			if (writableConfigs[key]) {
	// 				initialChanges[key] = device.parameters![key];
	// 			}
	// 		});
	// 	}
	// 	setPendingControlChanges(initialChanges);
	// 	setIsControlModalVisible(true);
	// };

	const handleControlChange = (key: string, value: number | string | null) => {
		setPendingControlChanges(prev => ({
			...prev,
			[key]: value
		}));
	};

	const submitControlChanges = () => {
		Modal.confirm({
			title: 'Confirm Changes',
			content: `Are you sure you want to apply these changes to ${controlDevice?.name}?`,
			centered: true,
			onOk: () => {
				message.success('Parameters updated successfully');
				setIsControlModalVisible(false);
				// Here you would typically call an API to update the device
			}
		});
	};

	const deviceColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text: string) => <Typography.Text>{text}</Typography.Text>,
		},
		{
			title: 'Model',
			dataIndex: 'modelName',
			key: 'modelName',
				render: (text: string) => <Tag>{text}</Tag>,
		},
		{
			title: 'Status',
			dataIndex: 'nwkStatus',
			key: 'nwkStatus',
			render: (status: number) => {
				const statusText = status === 1 ? 'Online' : 'Offline';
				const statusColor = status === 1 ? 'success' : 'error';
				return <Badge status={statusColor} text={statusText} />;
			},
		},
		{
			title: 'Last seen',
			dataIndex: 'lastSeen',
			key: 'lastSeen',
				render: (timestamp: number) => {
                    if (!timestamp) return <Typography.Text type="secondary">Never</Typography.Text>;
                    // Convert unix timestamp (seconds) to dayjs object
                    return <Typography.Text>{dayjs.unix(timestamp).fromNow()}</Typography.Text>;
                },
		}
	];

	
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
	
	// Quick actions handlers
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
					padding: '8px 12px',
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
						<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
							<Typography.Text strong style={{ fontSize: 14 }}>{item.title}</Typography.Text>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>{item.time}</Typography.Text>
						</div>
						<div style={{ display: 'flex', gap: 16 }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>
								Device: <Typography.Text strong>{item.deviceName}</Typography.Text>
							</Typography.Text>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>
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
	const getIntervalText = (val?: number | null) => {
		if (val === null || val === undefined) return '';
		const map: Record<number, string> = {
			0: 'Disabled', 1: '10min', 2: '15min', 3: '30min', 
			4: '1hour', 5: '6hour', 6: '12hour', 7: 'daily'
		};
		return map[val] || val.toString();
	};

	const formatCoords = (x: unknown, y: unknown) => {
		const xVal = x ?? '';
		const yVal = y ?? '';
		if (xVal === '' && yVal === '') return '';
		if (xVal === '') return String(yVal);
		if (yVal === '') return String(xVal);
		return `${String(xVal)}, ${String(yVal)}`;
	};

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
				<Spin size="large" tip="Loading System Data..." />
			</div>
		);
	}

	return (
		<>
			{/* Top Row: Device Info (Full Width) */}
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
				<Col xs={24}>
					<Card 
						title="Device Information" 
						bordered 
						headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED', minHeight: '40px', padding: '0 16px' }} 
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
							</Space>
						}
					>
						<Row gutter={24} align="middle">
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

			{/* Main Content Grid */}
			<Row gutter={[16, 16]}>
				{/* Left Column: Notifications + Sensor Status */}
				<Col xs={24} lg={14}>
					{/* System Notifications */}
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
						headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED', minHeight: '40px', padding: '0 16px' }}
						bodyStyle={{ padding: 0, backgroundColor: '#FFFFFF' }}
						style={{ height: 220, marginBottom: 16, backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
					>
						<div style={{ 
							height: 179, 
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
					
					{/* Sensor Status */}
					<Card 
						title="Sensor Status" 
						headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED', minHeight: '40px', padding: '0 16px' }} 
						bordered 
						bodyStyle={{ padding: 12, backgroundColor: '#FFFFFF', height: 'calc(100% - 41px)' }} 
						style={{ height: 180, backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
					>
						<Row align="middle" justify="center" style={{ height: '100%' }}>
							<Col span={10} style={{ display: 'flex', justifyContent: 'center' }}>
								<Progress
									type="circle"
									percent={devices.length > 0 ? Math.round((devices.filter(d => d.nwkStatus === 1).length / devices.length) * 100) : 0}
									size={90}
									strokeColor="#8CC63F"
									trailColor="#D9534F"
									format={() => (
										<div style={{ textAlign: 'center' }}>
											<div style={{ fontSize: 24, fontWeight: 'bold', color: '#003A70' }}>
												{devices.length}
											</div>
											<div style={{ fontSize: 12, color: '#999' }}>Total Sensors</div>
										</div>
									)}
								/>
							</Col>
							<Col span={14}>
								<Space direction="vertical" size={12} style={{ width: '100%', paddingLeft: 12 }}>
									<Popover 
										placement="right" 
										title="Online Sensors" 
										content={
											<List
												size="small"
												dataSource={devices.filter(d => d.nwkStatus === 1)}
												renderItem={item => (
													<List.Item style={{ padding: '8px 12px' }}>
														<Space>
															<Badge status="success" />
															<Typography.Text>{item.name}</Typography.Text>
															<Tag style={{ marginLeft: 8 }}>{item.modelName}</Tag>
														</Space>
													</List.Item>
												)}
												style={{ maxHeight: 300, overflow: 'auto', width: 250 }}
											/>
										}
									>
										<div style={{ 
											cursor: 'pointer', 
											padding: '6px 16px', 
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
											<Space size={12}>
												<div style={{ 
													width: 32, 
													height: 32, 
													borderRadius: '50%', 
													background: 'rgba(140, 198, 63, 0.1)', 
													display: 'flex', 
													alignItems: 'center', 
													justifyContent: 'center' 
												}}>
													<CheckCircleOutlined style={{ color: '#8CC63F', fontSize: 16 }} />
												</div>
												<div>
													<div style={{ fontSize: 13, color: '#888' }}>Online Sensors</div>
													<div style={{ fontSize: 20, fontWeight: 'bold', color: '#8CC63F', lineHeight: 1 }}>
														{devices.filter(d => d.nwkStatus === 1).length}
													</div>
												</div>
											</Space>
											<RightOutlined style={{ fontSize: 12, color: '#ccc' }} />
										</div>
									</Popover>

									<Popover 
										placement="right" 
										title="Offline Sensors" 
										content={
											<List
												size="small"
												dataSource={devices.filter(d => d.nwkStatus === 0)}
												renderItem={item => (
													<List.Item style={{ padding: '8px 12px' }}>
														<Space>
															<Badge status="error" />
															<Typography.Text>{item.name}</Typography.Text>
															<Tag style={{ marginLeft: 8 }}>{item.modelName}</Tag>
														</Space>
													</List.Item>
												)}
												style={{ maxHeight: 300, overflow: 'auto', width: 250 }}
											/>
										}
									>
										<div style={{ 
											cursor: 'pointer', 
											padding: '6px 16px', 
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
											<Space size={12}>
												<div style={{ 
													width: 32, 
													height: 32, 
													borderRadius: '50%', 
													background: 'rgba(217, 83, 79, 0.1)', 
													display: 'flex', 
													alignItems: 'center', 
													justifyContent: 'center' 
												}}>
													<DisconnectOutlined style={{ color: '#D9534F', fontSize: 16 }} />
												</div>
												<div>
													<div style={{ fontSize: 13, color: '#888' }}>Offline Sensors</div>
													<div style={{ fontSize: 20, fontWeight: 'bold', color: '#D9534F', lineHeight: 1 }}>
														{devices.filter(d => d.nwkStatus === 0).length}
													</div>
												</div>
											</Space>
											<RightOutlined style={{ fontSize: 12, color: '#ccc' }} />
										</div>
									</Popover>
								</Space>
							</Col>
						</Row>
					</Card>
				</Col>

				{/* Right Column: Sensor List */}
				<Col xs={24} lg={10}>
					<Card 
						title={
							<Space>
								<span>Sensor List</span>
								<Badge count={filteredAndSortedDevices.length} style={{ backgroundColor: '#003A70' }} />
							</Space>
						}
						bordered 
						headStyle={{ backgroundColor: '#FAFBFC', borderBottom: '1px solid #E1E8ED', minHeight: '36px', padding: '0 16px' }}
						bodyStyle={{ padding: 0, flex: 1, overflow: 'hidden' }}
						style={{ height: 416, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', borderColor: '#E1E8ED', borderRadius: 8 }}
						extra={
							<Space size={8}>
								<Button 
									type="primary" 
									size="small"
									onClick={() => navigate('/monitor')}
									style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
								>
									Control Sensor
								</Button>
								<Input
									size="small"
									placeholder="Search..."
									prefix={<SearchOutlined />}
									allowClear
									style={{ width: 150 }}
									value={searchText}
									onChange={(e) => setSearchText(e.target.value)}
								/>
								<Select
									size="small"
									value={statusFilter}
									onChange={setStatusFilter}
									style={{ width: 100 }}
									options={[
										{ label: 'All', value: 'all' },
										{ label: 'Online', value: 'online' },
										{ label: 'Offline', value: 'offline' }
									]}
								/>
							</Space>
						}
					>
						<div ref={tableContainerRef} style={{ height: '100%', overflow: 'hidden' }}>
							<Table
								className="sensor-list-table"
								size="small"
								columns={deviceColumns}
								dataSource={filteredAndSortedDevices}
								pagination={false}
								scroll={{ y: tableScrollHeight }}
								rowClassName={(record) => record.nwkStatus === 0 ? 'offline-row' : ''}
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
					</Card>
				</Col>
			</Row>

			{/* Control Modal */}
			<Modal
				title={`Control: ${controlDevice?.name}`}
				open={isControlModalVisible}
				onCancel={() => setIsControlModalVisible(false)}
				onOk={submitControlChanges}
				centered
				okText="Apply Changes"
				okButtonProps={{ style: { backgroundColor: '#003A70' } }}
			>
				<div style={{ padding: '16px 0' }}>
					{controlDevice?.parameters && Object.keys(controlDevice.parameters).filter(k => writableConfigs[k]).map(key => {
						const config = writableConfigs[key];
						const value = pendingControlChanges[key];
						
						return (
							<div key={key} style={{ marginBottom: 16 }}>
								<div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
									<Typography.Text strong>
										{key.replace(/([A-Z])/g, ' $1').trim()}
									</Typography.Text>
									{parameterUnits[key] && (
										<Typography.Text type="secondary">
											({parameterUnits[key]})
										</Typography.Text>
									)}
								</div>
								
								{config.type === 'number' && (
									<InputNumber
										style={{ width: '100%' }}
										value={value}
										onChange={(val) => handleControlChange(key, val)}
									/>
								)}
								
								{config.type === 'select' && (
									<Select
										style={{ width: '100%' }}
										value={value}
										onChange={(val) => handleControlChange(key, val)}
									>
										{config.options?.map(opt => (
											<Select.Option key={opt} value={opt}>{opt}</Select.Option>
										))}
									</Select>
								)}
								
								{config.type === 'switch' && (
									<Switch
										checked={Number(value) === 1}
										onChange={(checked) => handleControlChange(key, checked ? 1 : 0)}
									/>
								)}
							</div>
						);
					})}
				</div>
			</Modal>

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
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.name || ''}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Model</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.modelName || ''}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Enabled</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>
                                        <Badge 
                                            status={selectedDevice.enabled === 1 ? 'success' : 'default'} 
                                            text={selectedDevice.enabled === 1 ? 'Enabled' : 'Disabled'} 
                                        />
                                    </div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Firmware Version</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.fw_ver || ''}</div>
								</Col>

								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Status</Typography.Text>
									<div><Badge status={selectedDevice.nwkStatus === 1 ? 'success' : 'error'} text={selectedDevice.nwkStatus === 1 ? 'Online' : 'Offline'} /></div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Alarm State</Typography.Text>
									<div><Tag>{selectedDevice.alarm_state || '---'}</Tag></div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Error State</Typography.Text>
									<div><Tag>{selectedDevice.err_state || '---'}</Tag></div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Last Report</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>
                                        {selectedDevice.lastSeen ? dayjs.unix(selectedDevice.lastSeen).fromNow() : 'Never'}
                                    </div>
								</Col>

								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Modbus Address</Typography.Text>
									<div style={{ fontSize: 14 }}>{selectedDevice.priAddr ?? ''}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Secondary Address</Typography.Text>
									<div style={{ fontSize: 14 }}>{selectedDevice.sec_addr ?? ''}</div>
								</Col>
								<Col span={6}>
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Tertiary Address</Typography.Text>
									<div style={{ fontSize: 14 }}>{selectedDevice.ter_addr ?? ''}</div>
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
										<Descriptions.Item label="Location ID">{selectedDevice.loc_id || ''}</Descriptions.Item>
										<Descriptions.Item label="Location Name">{selectedDevice.loc_name || ''}</Descriptions.Item>
										<Descriptions.Item label="Subname">{selectedDevice.loc_subname || ''}</Descriptions.Item>
										<Descriptions.Item label="Block">{selectedDevice.loc_blk || ''}</Descriptions.Item>
										<Descriptions.Item label="Unit">{selectedDevice.loc_unit || ''}</Descriptions.Item>
										<Descriptions.Item label="Postal Code">{selectedDevice.postal_code || ''}</Descriptions.Item>
										<Descriptions.Item label="Address">{selectedDevice.loc_addr || ''}</Descriptions.Item>
										<Descriptions.Item label="Coordinates (X, Y)">
											{formatCoords(selectedDevice.x, selectedDevice.y)}
										</Descriptions.Item>
										<Descriptions.Item label="Height (H)">{selectedDevice.h ?? ''}</Descriptions.Item>
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
		</>
	);
};

export default Overview;
