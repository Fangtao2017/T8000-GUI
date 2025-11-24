import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Table, Button, Space, Tag, Badge, Row, Col, Typography, Progress, Input, Select, Modal, message, List, Switch, Descriptions, InputNumber } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SaveOutlined, CloseCircleOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { type DeviceData, allDevices, parameterUnits, writableConfigs } from '../data/devicesData';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;

const Devices: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { deviceId } = useParams<{ deviceId: string }>();
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string>('all');
	const [filterModel, setFilterModel] = useState<string>('all');
	const [filterLocation, setFilterLocation] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);
	
	// Modal states
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
	const [editingDevice, setEditingDevice] = useState<DeviceData | null>(null);
	
	// Edit form states - based on database schema from images
	const [editForm, setEditForm] = useState({
		node_id: '',
		sec_addr: '',
		ter_addr: '',
		log_intvl: '',
		report_intvl: '',
		health_intvl: '',
		loc_id: '',
		loc_name: '',
		loc_subname: '',
		loc_blk: '',
		loc_unit: '',
		postal_code: '',
		loc_addr: '',
		x: '',
		y: '',
		h: '',
		fw_ver: '',
		alarm_state: 'Not alarm',
		err_state: 'No error',
	});

	// Parameter binding states
	const [boundParameters, setBoundParameters] = useState<Array<{id: string, name: string, deviceName: string, type: string, unit: string}>>([]);
	const [parameterSearchText, setParameterSearchText] = useState('');
	const [isUnbindConfirmVisible, setIsUnbindConfirmVisible] = useState(false);
	const [isBindConfirmVisible, setIsBindConfirmVisible] = useState(false);
	const [selectedParameterToUnbind, setSelectedParameterToUnbind] = useState<string | null>(null);
	const [selectedParameterToBind, setSelectedParameterToBind] = useState<{id: string, name: string, deviceName: string, type: string, unit: string} | null>(null);
	
	// Mock available parameters for search
	// Format: parameter name, bound to which device, parameter type
	const availableParameters = [
		{ id: 'P001', name: 'Temperature', deviceName: 'Temperature Sensor 1', type: 'Analog Input', unit: '°C' },
		{ id: 'P002', name: 'Humidity', deviceName: 'Humidity Sensor 1', type: 'Analog Input', unit: '%' },
		{ id: 'P003', name: 'Voltage', deviceName: 'Voltage Meter', type: 'Analog Input', unit: 'V' },
		{ id: 'P004', name: 'Current', deviceName: 'Current Sensor', type: 'Analog Input', unit: 'A' },
		{ id: 'P005', name: 'Power', deviceName: 'Power Meter', type: 'Analog Input', unit: 'W' },
		{ id: 'P006', name: 'Pressure', deviceName: 'Pressure Sensor', type: 'Analog Input', unit: 'bar' },
		{ id: 'P007', name: 'Flow Rate', deviceName: 'Flow Meter', type: 'Analog Input', unit: 'L/min' },
		{ id: 'P008', name: 'Illuminance', deviceName: 'Light Sensor', type: 'Analog Input', unit: 'lux' },
		{ id: 'P009', name: 'CO2 Level', deviceName: 'CO2 Sensor', type: 'Analog Input', unit: 'ppm' },
		{ id: 'P010', name: 'Occupancy', deviceName: 'Motion Detector', type: 'Digital Input', unit: '' },
	];


	// Handle navigation from Dashboard
	useEffect(() => {
		const state = location.state as { viewDeviceId?: string } | null;
		if (state?.viewDeviceId) {
			const targetDevice = allDevices.find(d => d.key === state.viewDeviceId);
			if (targetDevice) {
				setSelectedDevice(targetDevice);
				setIsModalVisible(true);
				// Clear state to prevent reopening on refresh (optional, but good practice)
				window.history.replaceState({}, document.title);
			}
		}
	}, [location.state]);

	const handleRefresh = () => {
		setRefreshing(true);
		message.success('Data refreshed successfully');
		setTimeout(() => setRefreshing(false), 1000);
	};

	const handleViewDevice = (device: DeviceData) => {
		setSelectedDevice(device);
		setIsModalVisible(true);
	};

	const handleEditDevice = (device: DeviceData) => {
		setEditingDevice(device);
		setIsEditModalVisible(true);
		// Initialize form with device data (using NULL as placeholder for empty fields)
		setEditForm({
			node_id: device.serialNumber || 'NULL',
			sec_addr: 'NULL',
			ter_addr: 'NULL',
			log_intvl: '4',
			report_intvl: '4',
			health_intvl: '4',
			loc_id: 'NULL',
			loc_name: 'NULL',
			loc_subname: 'NULL',
			loc_blk: 'NULL',
			loc_unit: 'NULL',
			postal_code: 'NULL',
			loc_addr: 'NULL',
			x: 'NULL',
			y: 'NULL',
			h: 'NULL',
			fw_ver: '1.32.3.4',
			alarm_state: device.alarm_state,
			err_state: device.err_state,
		});
		// Initialize with mock bound parameters (in real app, fetch from API)
		setBoundParameters([
			{ id: 'P001', name: 'Temperature', deviceName: 'Temperature Sensor 1', type: 'Analog Input', unit: '°C' },
			{ id: 'P003', name: 'Voltage', deviceName: 'Voltage Meter', type: 'Analog Input', unit: 'V' },
		]);
	};

	const handleSaveEdit = () => {
		if (!editingDevice) return;
		
		// Here you would typically send the data to your API
		console.log('Saving device data:', editForm);
		console.log('Bound parameters:', boundParameters);
		message.success(`Device ${editingDevice.name} updated successfully`);
		setIsEditModalVisible(false);
	};
	
	// Parameter binding handlers
	const handleUnbindParameter = (parameterId: string) => {
		setSelectedParameterToUnbind(parameterId);
		setIsUnbindConfirmVisible(true);
	};
	
	const confirmUnbindParameter = () => {
		if (!selectedParameterToUnbind) return;
		
		const param = boundParameters.find(p => p.id === selectedParameterToUnbind);
		setBoundParameters(boundParameters.filter(p => p.id !== selectedParameterToUnbind));
		message.success(`Parameter "${param?.name}" has been unbound from this device`);
		setIsUnbindConfirmVisible(false);
		setSelectedParameterToUnbind(null);
	};
	
	const handleBindParameter = (parameter: {id: string, name: string, deviceName: string, type: string, unit: string}) => {
		// Check if already bound
		if (boundParameters.some(p => p.id === parameter.id)) {
			message.warning('This parameter is already bound to this device');
			return;
		}
		setSelectedParameterToBind(parameter);
		setIsBindConfirmVisible(true);
	};
	
	const confirmBindParameter = () => {
		if (!selectedParameterToBind) return;
		
		setBoundParameters([...boundParameters, selectedParameterToBind]);
		message.success(`Parameter "${selectedParameterToBind.name}" has been bound to this device`);
		setIsBindConfirmVisible(false);
		setSelectedParameterToBind(null);
		setParameterSearchText('');
	};
	
	// Filter available parameters based on search and exclude already bound ones
	const filteredAvailableParameters = availableParameters.filter(param => 
		!boundParameters.some(bp => bp.id === param.id) &&
		(param.name.toLowerCase().includes(parameterSearchText.toLowerCase()) ||
		 param.deviceName.toLowerCase().includes(parameterSearchText.toLowerCase()) ||
		 param.type.toLowerCase().includes(parameterSearchText.toLowerCase()) ||
		 param.id.toLowerCase().includes(parameterSearchText.toLowerCase()))
	);

	// Filter logic - supports multiple simultaneous filters
	const filteredDevices = allDevices.filter(device => {
		const matchSearch = searchText === '' || 
			device.name.toLowerCase().includes(searchText.toLowerCase()) ||
			device.serialNumber.toLowerCase().includes(searchText.toLowerCase()) ||
			device.model.toLowerCase().includes(searchText.toLowerCase());
		
		const matchStatus = filterStatus === 'all' || device.status === filterStatus;
		const matchModel = filterModel === 'all' || device.model === filterModel;
		const matchLocation = filterLocation === 'all' || device.location === filterLocation;

		return matchSearch && matchStatus && matchModel && matchLocation;
	}).sort((a, b) => {
		// Sort offline devices to the top
		if (a.status === 'offline' && b.status === 'online') return -1;
		if (a.status === 'online' && b.status === 'offline') return 1;
		return 0;
	});

	// Reset to page 1 when filters change
	React.useEffect(() => {
		// Filters changed, no pagination needed
	}, [searchText, filterStatus, filterModel, filterLocation]);

	// Get unique values for filter options
	const uniqueModels = Array.from(new Set(allDevices.map(d => d.model))).sort();
	const uniqueLocations = Array.from(new Set(allDevices.map(d => d.location))).sort();

	// Statistics based on filtered data
	const totalDevices = filteredDevices.length;
	const onlineDevices = filteredDevices.filter(d => d.status === 'online').length;
	const offlineDevices = filteredDevices.filter(d => d.status === 'offline').length;
	const connectionRate = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;

	// Helper for interval text
	const getIntervalText = (val?: number) => {
		const map: Record<number, string> = {
			0: 'Disabled', 1: '10min', 2: '15min', 3: '30min', 
			4: '1hour', 5: '6hour', 6: '12hour', 7: 'daily'
		};
		return val !== undefined ? map[val] || val.toString() : 'NULL';
	};

	const columns: ColumnsType<DeviceData> = [
		{
			title: 'Device Name',
			dataIndex: 'name',
			key: 'name',
			width: 180,
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Model',
			dataIndex: 'model',
			key: 'model',
			width: 130,
		},
		{
			title: 'Serial Number',
			dataIndex: 'serialNumber',
			key: 'serialNumber',
			width: 160,
		},
		{
			title: 'Alarm State',
			dataIndex: 'alarm_state',
			key: 'alarm_state',
			width: 120,
			render: (state: string) => (
				<Tag>{state}</Tag>
			),
		},
		{
			title: 'Error State',
			dataIndex: 'err_state',
			key: 'err_state',
			width: 120,
			render: (state: string) => (
				<Tag>{state}</Tag>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 100,
			render: (status: string) => (
				<Badge 
					status={status === 'online' ? 'success' : 'error'}
					text={status}
				/>
			),
		},
		{
			title: 'Location',
			dataIndex: 'location',
			key: 'location',
			width: 160,
		},
		{
			title: 'Last Report',
			dataIndex: 'lastReport',
			key: 'lastReport',
			width: 140,
		},
		{
			title: 'Enable',
			dataIndex: 'enabled',
			key: 'enabled',
			width: 80,
			render: (enabled: boolean) => <Switch size="small" checked={enabled !== false} />,
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 200,
			render: (_: unknown, record: DeviceData) => (
				<Space size="small">
					<Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDevice(record)}>View Data</Button>
					<Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditDevice(record)} style={{ color: '#003A70' }}>Edit</Button>
					<Button type="link" size="small" danger icon={<DeleteOutlined />}>Delete</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
			{/* Compact Dashboard - Statistics Cards with Progress */}
			<Row gutter={16}>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Total Devices</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0 }}>{totalDevices}</Typography.Title>
							<Progress percent={100} showInfo={false} strokeColor="#003A70" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Online</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#52c41a' }}>{onlineDevices}</Typography.Title>
							<Progress percent={(onlineDevices / totalDevices) * 100} showInfo={false} strokeColor="#52c41a" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Offline</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>{offlineDevices}</Typography.Title>
							<Progress percent={(offlineDevices / totalDevices) * 100} showInfo={false} strokeColor="#ff4d4f" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Connection Rate</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: connectionRate === 100 ? '#52c41a' : '#ff4d4f' }}>{connectionRate}%</Typography.Title>
							<Progress percent={connectionRate} showInfo={false} strokeColor={connectionRate === 100 ? '#52c41a' : '#ff4d4f'} />
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Search and Filter Bar - All on Same Row */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Search
							placeholder="Search by name, S/N, model..."
							allowClear
							style={{ width: 300 }}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						<Select
							placeholder="Status"
							style={{ width: 130 }}
							value={filterStatus}
							onChange={setFilterStatus}
						>
							<Select.Option value="all">All Status</Select.Option>
							<Select.Option value="online">Online</Select.Option>
							<Select.Option value="offline">Offline</Select.Option>
						</Select>
						<Select
							placeholder="Model"
							style={{ width: 160 }}
							value={filterModel}
							onChange={setFilterModel}
						>
							<Select.Option value="all">All Models</Select.Option>
							{uniqueModels.map(model => (
								<Select.Option key={model} value={model}>{model}</Select.Option>
							))}
						</Select>
						<Select
							placeholder="Location"
							style={{ width: 200 }}
							value={filterLocation}
							onChange={setFilterLocation}
							showSearch
						>
							<Select.Option value="all">All Locations</Select.Option>
							{uniqueLocations.map(location => (
								<Select.Option key={location} value={location}>{location}</Select.Option>
							))}
						</Select>
						<Typography.Text type="secondary" style={{ fontSize: 12, alignSelf: 'center' }}>
							{filteredDevices.length} of {allDevices.length} devices
						</Typography.Text>
					</Space>
					<Space size={8}>
						<Button icon={<ReloadOutlined />} onClick={() => {
							setSearchText('');
							setFilterStatus('all');
							setFilterModel('all');
							setFilterLocation('all');
						}}>Reset All Filters</Button>
						<Button type="primary" icon={<ReloadOutlined />} loading={refreshing} onClick={handleRefresh} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
							Refresh Data
						</Button>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => navigate(deviceId ? `/device/${deviceId}/devices/add` : '/devices/add')}
							style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
						>
							Add Device
						</Button>
					</Space>
				</Space>
			</Card>

			{/* Devices Table */}
			<Card 
				title={`All Devices (${totalDevices})`} 
				bordered
				style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<div style={{ flex: 1, overflow: 'auto' }}>
					<Table
						columns={columns}
						dataSource={filteredDevices}
						pagination={false}
						scroll={{ x: 1400 }}
						size="small"
					/>
				</div>
			</Card>

			{/* Device Detail Modal */}
			<Modal
				title="Device Details"
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
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
			</Modal>			{/* Device Edit Modal */}
			<Modal
				title={<Typography.Title level={4} style={{ margin: 0 }}>Edit Device: {editingDevice?.name || ''}</Typography.Title>}
				open={isEditModalVisible}
				onCancel={() => setIsEditModalVisible(false)}
				width="60%"
				style={{ top: 20 }}
				bodyStyle={{ padding: 0, backgroundColor: '#E8EDF2' }}
				zIndex={1050}
				footer={[
					<Button key="cancel" size="large" onClick={() => setIsEditModalVisible(false)}>
						Cancel
					</Button>,
					<Button key="save" type="primary" size="large" icon={<SaveOutlined />} onClick={handleSaveEdit} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
						Save Changes
					</Button>,
				]}
			>
				{editingDevice && (
					<div style={{ height: '70vh', overflow: 'auto', padding: '24px' }}>
						{/* Device Configuration Section */}
						<Typography.Title level={5} style={{ marginBottom: 16, color: '#003A70' }}>
							Device Configuration
						</Typography.Title>
						
						<Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 32 }}>
							<Row gutter={16}>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Serial Number
									</Typography.Text>
									<Input
										value={editForm.node_id}
										onChange={(e) => setEditForm({ ...editForm, node_id: e.target.value })}
										placeholder="AR-QL-0001"
									/>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Device ID
									</Typography.Text>
									<Input
										value={editingDevice.key}
										disabled
										placeholder="Device ID"
									/>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Model ID
									</Typography.Text>
									<Input
										value={editingDevice.model}
										disabled
										placeholder="Model ID"
									/>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Alarm State
									</Typography.Text>
									<Select
										value={editForm.alarm_state}
										onChange={(value) => setEditForm({ ...editForm, alarm_state: value })}
										style={{ width: '100%' }}
									>
										<Select.Option value="Not alarm">Not alarm</Select.Option>
										<Select.Option value="Active Alarm">Active Alarm</Select.Option>
									</Select>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Error State
									</Typography.Text>
									<Select
										value={editForm.err_state}
										onChange={(value) => setEditForm({ ...editForm, err_state: value })}
										style={{ width: '100%' }}
									>
										<Select.Option value="No error">No error</Select.Option>
										<Select.Option value="Error">Error</Select.Option>
									</Select>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Secondary Address
									</Typography.Text>
									<Input
										value={editForm.sec_addr}
										onChange={(e) => setEditForm({ ...editForm, sec_addr: e.target.value })}
										placeholder="NULL"
									/>
								</Col>
							</Row>

							<Row gutter={16} style={{ marginTop: 12 }}>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Tertiary Address
									</Typography.Text>
									<Input
										value={editForm.ter_addr}
										onChange={(e) => setEditForm({ ...editForm, ter_addr: e.target.value })}
										placeholder="NULL"
									/>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Logging Interval
									</Typography.Text>
									<Select
										value={editForm.log_intvl}
										onChange={(value) => setEditForm({ ...editForm, log_intvl: value })}
										style={{ width: '100%' }}
									>
										<Select.Option value="0">Disabled</Select.Option>
										<Select.Option value="1">10min</Select.Option>
										<Select.Option value="2">15min</Select.Option>
										<Select.Option value="3">30min</Select.Option>
										<Select.Option value="4">1hour</Select.Option>
										<Select.Option value="5">6hour</Select.Option>
										<Select.Option value="6">12hour</Select.Option>
										<Select.Option value="7">daily</Select.Option>
									</Select>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Reporting Interval
									</Typography.Text>
									<Select
										value={editForm.report_intvl}
										onChange={(value) => setEditForm({ ...editForm, report_intvl: value })}
										style={{ width: '100%' }}
									>
										<Select.Option value="0">Disabled</Select.Option>
										<Select.Option value="1">10min</Select.Option>
										<Select.Option value="2">15min</Select.Option>
										<Select.Option value="3">30min</Select.Option>
										<Select.Option value="4">1hour</Select.Option>
										<Select.Option value="5">6hour</Select.Option>
										<Select.Option value="6">12hour</Select.Option>
										<Select.Option value="7">daily</Select.Option>
									</Select>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Health Reporting Interval
									</Typography.Text>
									<Select
										value={editForm.health_intvl}
										onChange={(value) => setEditForm({ ...editForm, health_intvl: value })}
										style={{ width: '100%' }}
									>
										<Select.Option value="0">Disabled</Select.Option>
										<Select.Option value="1">10min</Select.Option>
										<Select.Option value="2">15min</Select.Option>
										<Select.Option value="3">30min</Select.Option>
										<Select.Option value="4">1hour</Select.Option>
										<Select.Option value="5">6hour</Select.Option>
										<Select.Option value="6">12hour</Select.Option>
										<Select.Option value="7">daily</Select.Option>
									</Select>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Firmware Version
									</Typography.Text>
									<Input
										value={editForm.fw_ver}
										onChange={(e) => setEditForm({ ...editForm, fw_ver: e.target.value })}
										placeholder="1.32.3.4"
									/>
								</Col>
							</Row>
						</Space>

						{/* Location Information Section */}
						<Typography.Title level={5} style={{ marginBottom: 16, color: '#003A70' }}>
							Location Information
						</Typography.Title>
						
						<Space direction="vertical" size={12} style={{ width: '100%' }}>
							<Row gutter={16}>
								<Col span={12}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Location ID
									</Typography.Text>
									<Input
										value={editForm.loc_id}
										onChange={(e) => setEditForm({ ...editForm, loc_id: e.target.value })}
										placeholder="PS0001"
									/>
								</Col>
								<Col span={12}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Location Name
									</Typography.Text>
									<Input
										value={editForm.loc_name}
										onChange={(e) => setEditForm({ ...editForm, loc_name: e.target.value })}
										placeholder="TOWNSVILLE PRIMARY SCHOOL"
									/>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={12}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Location Subname
									</Typography.Text>
									<Input
										value={editForm.loc_subname}
										onChange={(e) => setEditForm({ ...editForm, loc_subname: e.target.value })}
										placeholder="Admin Room"
									/>
								</Col>
								<Col span={12}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Block Number/Name
									</Typography.Text>
									<Input
										value={editForm.loc_blk}
										onChange={(e) => setEditForm({ ...editForm, loc_blk: e.target.value })}
										placeholder="5A"
									/>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={12}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Floor/Unit
									</Typography.Text>
									<Input
										value={editForm.loc_unit}
										onChange={(e) => setEditForm({ ...editForm, loc_unit: e.target.value })}
										placeholder="03-24"
									/>
								</Col>
								<Col span={12}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Postal Code
									</Typography.Text>
									<Input
										value={editForm.postal_code}
										onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
										placeholder="569730"
									/>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={24}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Location Address
									</Typography.Text>
									<Input
										value={editForm.loc_addr}
										onChange={(e) => setEditForm({ ...editForm, loc_addr: e.target.value })}
										placeholder="Ang Mo Kio Avenue 10"
									/>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Latitude (X)
									</Typography.Text>
									<Input
										value={editForm.x}
										onChange={(e) => setEditForm({ ...editForm, x: e.target.value })}
										placeholder="1.348299"
									/>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Longitude (Y)
									</Typography.Text>
									<Input
										value={editForm.y}
										onChange={(e) => setEditForm({ ...editForm, y: e.target.value })}
										placeholder="103.936847"
									/>
								</Col>
								<Col span={8}>
									<Typography.Text strong style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
										Height from Floor (H)
									</Typography.Text>
									<Input
										value={editForm.h}
										onChange={(e) => setEditForm({ ...editForm, h: e.target.value })}
										placeholder="1.5"
									/>
								</Col>
							</Row>
						</Space>

						{/* Parameter Binding Section */}
						<Typography.Title level={5} style={{ marginBottom: 16, marginTop: 32, color: '#003A70' }}>
							Parameter Bindings
						</Typography.Title>
						
						<Space direction="vertical" size={12} style={{ width: '100%' }}>
							{/* Current Bound Parameters */}
							<div>
								<Typography.Text strong style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
									Current Bound Parameters ({boundParameters.length})
								</Typography.Text>
								{boundParameters.length === 0 ? (
									<Card size="small" style={{ background: '#fafafa', textAlign: 'center' }}>
										<Typography.Text type="secondary">No parameters bound to this device</Typography.Text>
									</Card>
								) : (
									<List
										size="small"
										bordered
										dataSource={boundParameters}
										renderItem={(item, index) => (
											<List.Item
												actions={[
													<Button 
														type="link" 
														danger 
														size="small"
														icon={<CloseCircleOutlined />}
														onClick={() => handleUnbindParameter(item.id)}
													>
														Unbind
													</Button>
												]}
											>
												<Space size={8} align="center">
													<div style={{ 
														display: 'inline-block',
														padding: '2px 8px',
														background: '#f0f0f0',
														border: '1px solid #d9d9d9',
														borderRadius: '4px',
														fontSize: '12px',
														color: '#595959'
													}}>
														{index + 1}
													</div>
													<Typography.Text style={{ fontSize: '14px', color: '#262626' }}>
														{item.name}
													</Typography.Text>
													<ArrowRightOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
													<Typography.Text style={{ fontSize: '14px', color: '#262626' }}>
														{item.deviceName}
													</Typography.Text>
													{item.unit && (
														<Typography.Text type="secondary" style={{ fontSize: '13px' }}>
															({item.unit})
														</Typography.Text>
													)}
													<Typography.Text type="secondary" style={{ fontSize: '12px' }}>
														[{item.type}]
													</Typography.Text>
												</Space>
											</List.Item>
										)}
									/>
								)}
							</div>

							{/* Search and Add Parameters */}
							<div>
								<Typography.Text strong style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
									Add Parameter Binding
								</Typography.Text>
								<Space direction="vertical" size={12} style={{ width: '100%' }}>
									<Search
										placeholder="Search parameters by name, type, or ID..."
										value={parameterSearchText}
										onChange={(e) => setParameterSearchText(e.target.value)}
										allowClear
									/>
									{parameterSearchText && (
										<Card 
											size="small" 
											style={{ maxHeight: '300px', overflow: 'auto' }}
											bodyStyle={{ padding: 0, backgroundColor: '#E8EDF2' }}
										>
											{filteredAvailableParameters.length === 0 ? (
												<div style={{ padding: '20px', textAlign: 'center' }}>
													<Typography.Text type="secondary">No parameters found</Typography.Text>
												</div>
											) : (
												<List
													size="small"
													dataSource={filteredAvailableParameters}
													renderItem={(item) => (
														<List.Item
															style={{ padding: '8px 16px', cursor: 'pointer' }}
															onClick={() => handleBindParameter(item)}
															actions={[
																<Button 
																	type="link" 
																	size="small"
																	icon={<PlusOutlined />}
																>
																	Bind
																</Button>
															]}
														>
															<Space size={8} align="center">
																<Typography.Text style={{ fontSize: '14px', color: '#262626' }}>
																	{item.name}
																</Typography.Text>
																<ArrowRightOutlined style={{ fontSize: '12px', color: '#8c8c8c' }} />
																<Typography.Text style={{ fontSize: '14px', color: '#262626' }}>
																	{item.deviceName}
																</Typography.Text>
																{item.unit && (
																	<Typography.Text type="secondary" style={{ fontSize: '13px' }}>
																		({item.unit})
																	</Typography.Text>
																)}
																<Typography.Text type="secondary" style={{ fontSize: '12px' }}>
																	[{item.type}]
																</Typography.Text>
															</Space>
														</List.Item>
													)}
												/>
											)}
										</Card>
									)}
								</Space>
							</div>
						</Space>
					</div>
				)}
			</Modal>

			{/* Unbind Confirmation Modal */}
			<Modal
				title="Confirm Unbind Parameter"
				open={isUnbindConfirmVisible}
				onOk={confirmUnbindParameter}
				onCancel={() => {
					setIsUnbindConfirmVisible(false);
					setSelectedParameterToUnbind(null);
				}}
				okText="Yes, Unbind"
				cancelText="Cancel"
				okButtonProps={{ danger: true }}
				zIndex={1100}
			>
				<Typography.Paragraph>
					Are you sure you want to unbind this parameter from the device?
				</Typography.Paragraph>
				<Typography.Paragraph type="secondary">
					<strong>Parameter:</strong> {boundParameters.find(p => p.id === selectedParameterToUnbind)?.name} → {boundParameters.find(p => p.id === selectedParameterToUnbind)?.deviceName}
				</Typography.Paragraph>
				<Typography.Paragraph type="warning" style={{ marginBottom: 0 }}>
					⚠️ This action will remove the association between this device and the parameter. 
					Data history will be preserved but new data will not be associated.
				</Typography.Paragraph>
			</Modal>

			{/* Bind Confirmation Modal */}
			<Modal
				title="Confirm Bind Parameter"
				open={isBindConfirmVisible}
				onOk={confirmBindParameter}
				onCancel={() => {
					setIsBindConfirmVisible(false);
					setSelectedParameterToBind(null);
				}}
				okText="Yes, Bind"
				cancelText="Cancel"
				okButtonProps={{ type: 'primary', style: { backgroundColor: '#FFFFFF', borderColor: '#003A70' } }}
				zIndex={1100}
			>
				<Typography.Paragraph>
					Are you sure you want to bind this parameter to the device?
				</Typography.Paragraph>
				<Typography.Paragraph type="secondary">
					<strong>Parameter:</strong> {selectedParameterToBind?.name} → {selectedParameterToBind?.deviceName}
				</Typography.Paragraph>
				<Typography.Paragraph type="secondary">
					<strong>Type:</strong> {selectedParameterToBind?.type}
				</Typography.Paragraph>
				<Typography.Paragraph type="warning" style={{ marginBottom: 0 }}>
					⚠️ This will create an association between this device and the parameter. 
					Future data from this parameter will be linked to this device.
				</Typography.Paragraph>
			</Modal>
		</div>
	);
};

export default Devices;















