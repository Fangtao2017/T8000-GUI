import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Typography, Input, Select, Progress, message, Modal, Badge } from 'antd';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

const { Search } = Input;

interface AlarmRow {
	key: string;
	alarmTime: string;
	deviceName: string;
	deviceType: string;
	Alarmname: string;
	// Alarm log details
	logId?: number;
	deviceId?: number;
	parameterId?: number;
	value?: number;
	alarmId?: number;
	alarmState?: number;
}

interface AlarmHistoryItem {
	time: string;
	status: 'triggered' | 'normalized';
	value: number;
}

const alarmRows: AlarmRow[] = [
	{ key: '1', alarmTime: '2025-11-12 14:25:30', deviceName: 'Temperature Sensor 1', deviceType: 'Temp', Alarmname: 'Temperature exceeds threshold', logId: 1, deviceId: 1, parameterId: 10, value: 10, alarmId: 1, alarmState: 1 },
	{ key: '2', alarmTime: '2025-11-12 14:20:15', deviceName: 'Controller C5', deviceType: 'Actuator', Alarmname: 'Connection timeout', logId: 2, deviceId: 2, parameterId: 15, value: 0, alarmId: 2, alarmState: 1 },
	{ key: '3', alarmTime: '2025-11-12 14:15:45', deviceName: 'IR', deviceType: 'IR', Alarmname: 'Connection lost', logId: 3, deviceId: 3, parameterId: 20, value: 0, alarmId: 3, alarmState: 1 },
	{ key: '4', alarmTime: '2025-11-12 13:30:20', deviceName: 'Temperature Sensor 2', deviceType: 'Temp', Alarmname: 'Firmware update available' },
	{ key: '5', alarmTime: '2025-11-12 13:55:10', deviceName: 'Sensor A3', deviceType: 'Pressure', Alarmname: 'Pressure value unstable' },
	{ key: '6', alarmTime: '2025-11-12 14:22:50', deviceName: 'Sensor B4', deviceType: 'Humidity', Alarmname: 'Power voltage low' },
	{ key: '7', alarmTime: '2025-11-12 14:10:35', deviceName: 'Temperature Sensor 3', deviceType: 'Temp', Alarmname: 'Temperature fluctuation detected' },
	{ key: '8', alarmTime: '2025-11-12 12:45:00', deviceName: 'T-FM-001', deviceType: 'Flow Meter', Alarmname: 'Flow rate abnormal' },
	{ key: '9', alarmTime: '2025-11-12 14:05:22', deviceName: 'Gateway Main', deviceType: 'Gateway', Alarmname: 'High memory usage detected' },
	{ key: '10', alarmTime: '2025-11-12 13:48:15', deviceName: 'Dimmer Control 1', deviceType: 'Actuator', Alarmname: 'Load current exceeds limit' },
	{ key: '11', alarmTime: '2025-11-12 13:22:40', deviceName: 'Energy Meter 3-Phase', deviceType: 'Pressure', Alarmname: 'Phase imbalance detected' },
	{ key: '12', alarmTime: '2025-11-12 12:58:33', deviceName: 'Occupancy Sensor A1', deviceType: 'Humidity', Alarmname: 'Battery level low' },
	{ key: '13', alarmTime: '2025-11-12 12:35:18', deviceName: 'Air Conditioning Panel', deviceType: 'Actuator', Alarmname: 'Filter maintenance required' },
	{ key: '14', alarmTime: '2025-11-12 12:10:55', deviceName: 'Tank Level Sensor', deviceType: 'Pressure', Alarmname: 'Water level critical low' },
	{ key: '15', alarmTime: '2025-11-12 11:55:42', deviceName: 'Digital I/O Module', deviceType: 'Actuator', Alarmname: 'Input signal error' },
	{ key: '16', alarmTime: '2025-11-12 11:32:27', deviceName: 'Temperature Sensor 4', deviceType: 'Temp', Alarmname: 'Sensor calibration needed' },
	{ key: '17', alarmTime: '2025-11-12 11:15:08', deviceName: 'Humidity Sensor C1', deviceType: 'Humidity', Alarmname: 'Humidity reading out of range' },
	{ key: '18', alarmTime: '2025-11-12 10:58:51', deviceName: 'Pressure Sensor A5', deviceType: 'Pressure', Alarmname: 'Pressure spike detected' },
	{ key: '19', alarmTime: '2025-11-12 10:42:36', deviceName: 'Gateway G2', deviceType: 'Gateway', Alarmname: 'Network latency high' },
	{ key: '20', alarmTime: '2025-11-12 10:25:19', deviceName: 'Dimmer Control 2', deviceType: 'Actuator', Alarmname: 'Overheating warning' },
	{ key: '21', alarmTime: '2025-11-12 10:08:44', deviceName: 'AC Panel Meeting Room B', deviceType: 'Actuator', Alarmname: 'Compressor fault' },
	{ key: '22', alarmTime: '2025-11-12 09:52:31', deviceName: 'Flow Meter Main', deviceType: 'Pressure', Alarmname: 'Flow sensor malfunction' },
	{ key: '23', alarmTime: '2025-11-12 09:35:17', deviceName: 'Temperature Sensor 5', deviceType: 'Temp', Alarmname: 'Temperature sensor disconnected' },
	{ key: '24', alarmTime: '2025-11-12 09:18:02', deviceName: 'Energy Meter Building 2', deviceType: 'Pressure', Alarmname: 'Power quality issue' },
	{ key: '25', alarmTime: '2025-11-12 09:02:48', deviceName: 'Occupancy Sensor C3', deviceType: 'Temp', Alarmname: 'Motion detection error' },
	{ key: '26', alarmTime: '2025-11-12 08:45:33', deviceName: 'Digital I/O Module 2', deviceType: 'Actuator', Alarmname: 'Output relay stuck' },
	{ key: '27', alarmTime: '2025-11-12 08:28:19', deviceName: 'Humidity Sensor D4', deviceType: 'Humidity', Alarmname: 'Sensor drift detected' },
	{ key: '28', alarmTime: '2025-11-12 08:12:05', deviceName: 'Gateway G3', deviceType: 'Gateway', Alarmname: 'Communication error' },
	{ key: '29', alarmTime: '2025-11-12 07:55:51', deviceName: 'Multi Interface Unit', deviceType: 'Gateway', Alarmname: 'Configuration mismatch' },
	{ key: '30', alarmTime: '2025-11-12 07:38:37', deviceName: 'Electric Meter Main', deviceType: 'Gateway', Alarmname: 'Energy consumption spike' },
];

const Alarms: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);
	const [selectedAlarm, setSelectedAlarm] = useState<AlarmRow | null>(null);
	const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

	// Mock alarm history data
	const mockAlarmHistory: AlarmHistoryItem[] = [
		{ time: '2025-11-12 14:25:30', status: 'triggered', value: 85 },
		{ time: '2025-11-12 12:10:15', status: 'triggered', value: 87 },
		{ time: '2025-11-12 10:05:42', status: 'triggered', value: 83 },
		{ time: '2025-11-11 18:30:20', status: 'triggered', value: 86 },
		{ time: '2025-11-11 15:45:10', status: 'normalized', value: 72 },
		{ time: '2025-11-11 14:22:55', status: 'triggered', value: 84 },
		{ time: '2025-11-10 22:15:30', status: 'triggered', value: 88 },
		{ time: '2025-11-10 20:08:45', status: 'normalized', value: 70 },
	];

	const handleRefresh = () => {
		setRefreshing(true);
		message.success('Data refreshed successfully');
		setTimeout(() => setRefreshing(false), 1000);
	};

	const handleViewDetails = (alarm: AlarmRow) => {
		setSelectedAlarm(alarm);
		setIsDetailModalVisible(true);
	};

	// Filter alarms based on search and type
	const filteredAlarms = useMemo(() => {
		return alarmRows.filter(alarm => {
			const matchSearch = searchText === '' ||
				alarm.deviceName.toLowerCase().includes(searchText.toLowerCase()) ||
				alarm.Alarmname.toLowerCase().includes(searchText.toLowerCase()) ||
				alarm.alarmTime.includes(searchText);
			
			const matchType = filterType === 'all' || alarm.deviceType === filterType;
			
			return matchSearch && matchType;
		});
	}, [searchText, filterType]);

	// Get unique device types for filter
	const uniqueTypes = useMemo(() => {
		return Array.from(new Set(alarmRows.map(a => a.deviceType))).sort();
	}, []);

	// Statistics for alarms
	const totalAlarms = filteredAlarms.length;
	const pendingAlarms = 3;
	const acknowledgedAlarms = 2;
	const closedAlarms = 2;

	const alarmColumns: ColumnType<AlarmRow>[] = [
		{
			title: 'Alarm Time',
			dataIndex: 'alarmTime',
			key: 'alarmTime',
			width: 180,
		},
		{
			title: 'Device Name',
			dataIndex: 'deviceName',
			key: 'deviceName',
			width: 200,
			render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
		},
		{
			title: 'Device Type',
			dataIndex: 'deviceType',
			key: 'deviceType',
			width: 150,
			render: (type: string) => <Tag color="default">{type}</Tag>,
		},
		{
			title: 'Alarm Name',
			dataIndex: 'Alarmname',
			key: 'Alarmname',
			ellipsis: true,
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 120,
			fixed: 'right',
			render: (_, record) => (
				<Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} style={{ color: '#003A70' }}>
					Details
				</Button>
			),
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
			{/* Statistics Cards with Progress Bars - Matching All Devices Design */}
			<Row gutter={16}>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Total Alarms</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0 }}>{totalAlarms}</Typography.Title>
							<Progress percent={100} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Pending</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#003A70' }}>{pendingAlarms}</Typography.Title>
							<Progress percent={(pendingAlarms / totalAlarms) * 100} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Acknowledged</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#faad14' }}>{acknowledgedAlarms}</Typography.Title>
							<Progress percent={(acknowledgedAlarms / totalAlarms) * 100} showInfo={false} strokeColor="#faad14" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Closed</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#52c41a' }}>{closedAlarms}</Typography.Title>
							<Progress percent={(closedAlarms / totalAlarms) * 100} showInfo={false} strokeColor="#52c41a" />
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Search and Filter Bar - All Filters on Same Row */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Search
							placeholder="Search by device name, alarm, or time..."
							allowClear
							style={{ width: 300 }}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						<Select
							placeholder="Device Type"
							style={{ width: 160 }}
							value={filterType}
							onChange={setFilterType}
						>
							<Select.Option value="all">All Types</Select.Option>
							{uniqueTypes.map(type => (
								<Select.Option key={type} value={type}>{type}</Select.Option>
							))}
						</Select>
						<Typography.Text type="secondary" style={{ fontSize: 12, alignSelf: 'center' }}>
							{filteredAlarms.length} of {alarmRows.length} alarms
						</Typography.Text>
					</Space>
					<Space size={8}>
						<Button
							icon={<ReloadOutlined />}
							onClick={() => {
								setSearchText('');
								setFilterType('all');
							}}
						>
							Reset Filters
						</Button>
					<Button type="primary" icon={<ReloadOutlined />} loading={refreshing} onClick={handleRefresh} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
						Refresh Data
					</Button>
					</Space>
				</Space>
			</Card>

			{/* Alarm Table - Takes remaining space with internal scroll */}
			<Card 
				title="Alarm History" 
				bordered 
				style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<div style={{ flex: 1, overflow: 'auto' }}>
					<Table
						size="small"
						columns={alarmColumns}
						dataSource={filteredAlarms}
						pagination={false}
						scroll={{ x: 1200 }}
					/>
				</div>
			</Card>

			{/* Alarm Detail Modal */}
			<Modal
				title="Alarm Details"
				open={isDetailModalVisible}
				onCancel={() => setIsDetailModalVisible(false)}
				footer={null}
				width="90%"
				style={{ top: 20 }}
				bodyStyle={{ padding: '24px' }}
				zIndex={1050}
			>
				{selectedAlarm && (
					<div>
						{/* Alarm Basic Info Header */}
						<Card 
							bordered={false} 
							style={{ marginBottom: 24, backgroundColor: '#fafafa' }}
							bodyStyle={{ padding: '16px 24px' }}
						>
							<Row gutter={32}>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Alarm Time</Typography.Text>
										<Typography.Title level={5} style={{ margin: 0 }}>{selectedAlarm.alarmTime}</Typography.Title>
									</Space>
								</Col>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Device Name</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{selectedAlarm.deviceName}</Typography.Text>
									</Space>
								</Col>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Alarm Status</Typography.Text>
										<Space>
											<Badge status="error" />
											<Typography.Text strong style={{ color: '#ff4d4f' }}>Triggered</Typography.Text>
										</Space>
									</Space>
								</Col>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Alarm Name</Typography.Text>
										<Typography.Text strong>{selectedAlarm.Alarmname}</Typography.Text>
									</Space>
								</Col>
							</Row>
						</Card>

						{/* Main Content - Log Parameters and History */}
						<Row gutter={16}>
						{/* Left: Log Parameters Panel */}
						<Col span={8}>
							<Card 
								title="Log Parameters" 
								bordered
								style={{ height: '500px' }}
								bodyStyle={{ 
									padding: '16px',
									height: 'calc(100% - 57px)',
									overflow: 'auto'
								}}
							>
									<Row gutter={[16, 16]}>
										{/* ID */}
										<Col span={12}>
											<Card
												size="small"
												style={{ 
													backgroundColor: '#FFFFFF', border: '1px solid #d9d9d9'
												}}
												bodyStyle={{ padding: '12px' }}
											>
												<Space direction="vertical" size={4} style={{ width: '100%' }}>
													<Typography.Text style={{ color: '#8c8c8c', fontSize: 11, textTransform: 'uppercase' }}>
														LOG ID (4 bytes)
													</Typography.Text>
													<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
														{selectedAlarm.logId || 1}
													</Typography.Text>
												</Space>
											</Card>
										</Col>

										{/* Time */}
										<Col span={12}>
											<Card
												size="small"
												style={{ 
													backgroundColor: '#FFFFFF', border: '1px solid #d9d9d9'
												}}
												bodyStyle={{ padding: '12px' }}
											>
												<Space direction="vertical" size={4} style={{ width: '100%' }}>
													<Typography.Text style={{ color: '#8c8c8c', fontSize: 11, textTransform: 'uppercase' }}>
														TIME (sec, 4 bytes)
													</Typography.Text>
													<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
														{Math.floor(new Date(selectedAlarm.alarmTime).getTime() / 1000)}
													</Typography.Text>
												</Space>
											</Card>
										</Col>

										{/* Device ID */}
										<Col span={12}>
											<Card
												size="small"
												style={{ 
													backgroundColor: '#FFFFFF', border: '1px solid #d9d9d9'
												}}
												bodyStyle={{ padding: '12px' }}
											>
												<Space direction="vertical" size={4} style={{ width: '100%' }}>
													<Typography.Text style={{ color: '#8c8c8c', fontSize: 11, textTransform: 'uppercase' }}>
														DEVICE ID (2 bytes)
													</Typography.Text>
													<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
														{selectedAlarm.deviceId || 1}
													</Typography.Text>
												</Space>
											</Card>
										</Col>

										{/* Parameter ID */}
										<Col span={12}>
											<Card
												size="small"
												style={{ 
													backgroundColor: '#FFFFFF', border: '1px solid #d9d9d9'
												}}
												bodyStyle={{ padding: '12px' }}
											>
												<Space direction="vertical" size={4} style={{ width: '100%' }}>
													<Typography.Text style={{ color: '#8c8c8c', fontSize: 11, textTransform: 'uppercase' }}>
														PARAMETER ID (2 bytes)
													</Typography.Text>
													<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
														{selectedAlarm.parameterId || 10}
													</Typography.Text>
												</Space>
											</Card>
										</Col>

										{/* Value */}
										<Col span={12}>
											<Card
												size="small"
												style={{ 
													backgroundColor: '#FFFFFF', border: '1px solid #d9d9d9'
												}}
												bodyStyle={{ padding: '12px' }}
											>
												<Space direction="vertical" size={4} style={{ width: '100%' }}>
													<Typography.Text style={{ color: '#8c8c8c', fontSize: 11, textTransform: 'uppercase' }}>
														VALUE (float, 4 bytes)
													</Typography.Text>
													<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
														{selectedAlarm.value !== undefined ? selectedAlarm.value : 10}
													</Typography.Text>
												</Space>
											</Card>
										</Col>

										{/* Alarm ID */}
										<Col span={12}>
											<Card
												size="small"
												style={{ 
													backgroundColor: '#FFFFFF', border: '1px solid #d9d9d9'
												}}
												bodyStyle={{ padding: '12px' }}
											>
												<Space direction="vertical" size={4} style={{ width: '100%' }}>
													<Typography.Text style={{ color: '#8c8c8c', fontSize: 11, textTransform: 'uppercase' }}>
														ALARM ID (2 bytes)
													</Typography.Text>
													<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
														{selectedAlarm.alarmId || 1}
													</Typography.Text>
												</Space>
											</Card>
										</Col>

										{/* Alarm State - Full Width */}
										<Col span={24}>
											<Card
												size="small"
												style={{ 
													backgroundColor: '#FFFFFF', border: '1px solid #d9d9d9'
												}}
												bodyStyle={{ padding: '12px' }}
											>
												<Space direction="vertical" size={4} style={{ width: '100%' }}>
													<Typography.Text style={{ color: '#8c8c8c', fontSize: 11, textTransform: 'uppercase' }}>
														ALARM STATE (1 byte)
													</Typography.Text>
													<Space>
														<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
															{selectedAlarm.alarmState !== undefined ? selectedAlarm.alarmState : 1}
														</Typography.Text>
														<Tag color={selectedAlarm.alarmState === 1 ? 'red' : 'green'}>
															{selectedAlarm.alarmState === 1 ? 'Triggered' : 'Normalized'}
														</Tag>
													</Space>
												</Space>
											</Card>
										</Col>
									</Row>
								</Card>
							</Col>

							{/* Right: Alarm History List */}
							<Col span={16}>
								<Card 
									title="Alarm History" 
									bordered
									extra={
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>
											Previous occurrences of this alarm
										</Typography.Text>
									}
									style={{ height: '500px' }}
									bodyStyle={{ padding: 0, height: 'calc(100% - 57px)', overflow: 'auto' }}
								>
									<Table
										dataSource={mockAlarmHistory.map((item, index) => ({
											key: index,
											...item
										}))}
										pagination={false}
										size="small"
										columns={[
											{
												title: 'Trigger Time',
												dataIndex: 'time',
												key: 'time',
												width: 200,
											},
											{
												title: 'Status',
												dataIndex: 'status',
												key: 'status',
												width: 150,
												render: (status: string) => (
													<Tag color={status === 'triggered' ? 'red' : 'green'}>
														{status === 'triggered' ? 'Triggered' : 'Normalized'}
													</Tag>
												),
											},
											{
												title: 'Value',
												dataIndex: 'value',
												key: 'value',
												width: 120,
												render: (value: number) => (
													<Typography.Text strong>{value}</Typography.Text>
												),
											},
											{
												title: 'Description',
												key: 'description',
												render: (_, record) => (
													<Typography.Text type="secondary">
														{record.status === 'triggered' 
															? `Temperature exceeded threshold (${record.value}°C > 80°C)` 
															: `Temperature returned to normal (${record.value}°C)`
														}
													</Typography.Text>
												),
											},
										]}
									/>
								</Card>
							</Col>
						</Row>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Alarms;





