import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Table, Button, Space, Tag, Badge, Row, Col, Typography, Input, Select, Modal, message, List, Descriptions, Collapse, Spin } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SaveOutlined, CloseCircleOutlined, PlusOutlined, ArrowRightOutlined, FilterOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { type DeviceData } from '../data/devicesData';
import { fetchDevices, fetchDeviceParameters, unbindDeviceParameter, updateDevice, type DeviceParameter } from '../api/deviceApi';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

const { Search } = Input;

const Devices: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { deviceId } = useParams<{ deviceId: string }>();
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string>('all');
	const [filterModel, setFilterModel] = useState<string>('all');
	const [filterLocation] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);
	const [devices, setDevices] = useState<DeviceData[]>([]);

	useEffect(() => {
		const loadDevices = async () => {
			setRefreshing(true);
			try {
				const data = await fetchDevices();
				console.log('Devices loaded in component:', data);
				setDevices(data);
			} catch (error) {
				console.error('Failed to load devices:', error);
				message.error('Failed to load device list');
			} finally {
				setRefreshing(false);
			}
		};
		loadDevices();
	}, []);
	
	// Modal states
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
	const [editingDevice, setEditingDevice] = useState<DeviceData | null>(null);
    const [deviceParameters, setDeviceParameters] = useState<DeviceParameter[]>([]);

    useEffect(() => {
        if (selectedDevice && selectedDevice.id) {
            const loadParams = async () => {
                const params = await fetchDeviceParameters(Number(selectedDevice.id));
                setDeviceParameters(params);
            };
            loadParams();
        } else {
            setDeviceParameters([]);
        }
    }, [selectedDevice]);
	
	// Edit form states - based on database schema from images
	const [editForm, setEditForm] = useState({
		name: '',
		priAddr: '',
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

    const [initialEditForm, setInitialEditForm] = useState<typeof editForm | null>(null);
    const [isConfirmSaveVisible, setIsConfirmSaveVisible] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const isDirty = (field: keyof typeof editForm) => {
        if (!initialEditForm) return false;
        return editForm[field] !== initialEditForm[field];
    };

    const getDirtyFields = () => {
        if (!initialEditForm) return [];
        return Object.keys(editForm).filter(key => editForm[key as keyof typeof editForm] !== initialEditForm[key as keyof typeof editForm]);
    };

	// Parameter binding states
	const [boundParameters, setBoundParameters] = useState<Array<{id: string, mapId?: string, name: string, deviceName: string, type: string, unit: string}>>([]);
	const [parameterSearchText, setParameterSearchText] = useState('');
	const [isUnbindConfirmVisible, setIsUnbindConfirmVisible] = useState(false);
	const [isBindConfirmVisible, setIsBindConfirmVisible] = useState(false);
	const [selectedParameterToUnbind, setSelectedParameterToUnbind] = useState<string | null>(null);
	const [selectedParameterToBind, setSelectedParameterToBind] = useState<{id: string, name: string, deviceName: string, type: string, unit: string} | null>(null);
	const [unbindLoading, setUnbindLoading] = useState(false);
	
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
		if (state?.viewDeviceId && devices.length > 0) {
			const targetDevice = devices.find(d => d.key === state.viewDeviceId);
			if (targetDevice) {
				setSelectedDevice(targetDevice);
				setIsModalVisible(true);
				// Clear state to prevent reopening on refresh (optional, but good practice)
				window.history.replaceState({}, document.title);
			}
		}
	}, [location.state, devices]);

	const handleRefresh = async () => {
		setRefreshing(true);
		const data = await fetchDevices();
		setDevices(data);
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
		// Initialize form with actual device data
		const initialData = {
			name: device.name || '',
			priAddr: String(device.priAddr ?? ''),
			node_id: device.modelName || '',
			sec_addr: device.sec_addr || '',
			ter_addr: device.ter_addr || '',
			log_intvl: String(device.log_intvl ?? '0'),
			report_intvl: String(device.report_intvl ?? '0'),
			health_intvl: String(device.health_intvl ?? '0'),
			loc_id: device.loc_id || '',
			loc_name: device.loc_name || '',
			loc_subname: device.loc_subname || '',
			loc_blk: device.loc_blk || '',
			loc_unit: device.loc_unit || '',
			postal_code: device.postal_code || '',
			loc_addr: device.loc_addr || '',
			x: String(device.x ?? ''),
			y: String(device.y ?? ''),
			h: String(device.h ?? ''),
			fw_ver: device.fw_ver || '',
			alarm_state: device.alarm_state || 'Not alarm',
			err_state: device.err_state || 'No error',
		};
		setEditForm(initialData);
        setInitialEditForm(initialData);
		
		// Fetch actual parameters
		fetchDeviceParameters(Number(device.id)).then(params => {
			const mappedParams = params.map(p => ({
				id: String(p.id),
				mapId: p.mapId ? String(p.mapId) : undefined,
				name: p.name,
				deviceName: device.name || 'Unknown',
				type: p.dataType === 0 ? 'Boolean' : p.dataType === 1 ? 'Integer' : 'Float',
				unit: p.unit || ''
			}));
			setBoundParameters(mappedParams);
		}).catch(err => {
			console.error('Failed to fetch parameters:', err);
			setBoundParameters([]);
		});
	};

	const handleSaveEdit = () => {
		if (!editingDevice) return;
        const dirtyFields = getDirtyFields();
        if (dirtyFields.length === 0) {
            message.info('No changes detected');
            return;
        }
        setIsConfirmSaveVisible(true);
	};

    const handleConfirmSave = async () => {
        if (!editingDevice) return;
        
        // Close confirmation modal and show loading modal
        setIsConfirmSaveVisible(false);
        setSaveLoading(true);
        
        try {
            const dirtyFields = getDirtyFields();
            const payload: any = {};
            dirtyFields.forEach(field => {
                payload[field] = editForm[field as keyof typeof editForm];
            });
            
            await updateDevice(Number(editingDevice.id), payload);
            
            message.success(`Device ${editingDevice.name} updated successfully`);
            setIsEditModalVisible(false);
            handleRefresh();
        } catch (error) {
            console.error('Update failed:', error);
            message.error('Failed to update device');
        } finally {
            setSaveLoading(false);
        }
    };
	
	// Parameter binding handlers
	const handleUnbindParameter = (mapId: string) => {
		setSelectedParameterToUnbind(mapId);
		setIsUnbindConfirmVisible(true);
	};
	
	const confirmUnbindParameter = async () => {
		if (!selectedParameterToUnbind) return;
		
		setUnbindLoading(true);
		try {
			await unbindDeviceParameter(Number(selectedParameterToUnbind));
			
			// Update local state
			setBoundParameters(boundParameters.filter(p => p.mapId !== selectedParameterToUnbind));
			message.success('Unbound successfully');
			setIsUnbindConfirmVisible(false);
			setSelectedParameterToUnbind(null);
		} catch (error) {
			console.error('Unbind error:', error);
			message.error('Failed to unbind parameter');
		} finally {
			setUnbindLoading(false);
		}
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
	const filteredDevices = devices.filter(device => {
		const matchSearch = searchText === '' || 
			device.name.toLowerCase().includes(searchText.toLowerCase()) ||
			device.modelName.toLowerCase().includes(searchText.toLowerCase());
		
		const matchStatus = filterStatus === 'all' || 
            (filterStatus === 'online' && device.nwkStatus === 1) ||
            (filterStatus === 'offline' && device.nwkStatus === 0);
		const matchModel = filterModel === 'all' || device.modelName === filterModel;
		// const matchLocation = filterLocation === 'all' || device.location === filterLocation;

		return matchSearch && matchStatus && matchModel;
	}).sort((a, b) => {
		// Sort offline devices to the top
		if (a.nwkStatus === 0 && b.nwkStatus === 1) return -1;
		if (a.nwkStatus === 1 && b.nwkStatus === 0) return 1;
		return 0;
	});

	// Reset to page 1 when filters change
	React.useEffect(() => {
		// Filters changed, no pagination needed
	}, [searchText, filterStatus, filterModel, filterLocation]);

	// Get unique values for filter options
	const uniqueModels = Array.from(new Set(devices.map(d => d.modelName))).sort();

	// Statistics based on filtered data
	const totalDevices = filteredDevices.length;
	const onlineDevices = filteredDevices.filter(d => d.nwkStatus === 1).length;
	const offlineDevices = filteredDevices.filter(d => d.nwkStatus === 0).length;
	// const activeAlarmCount = filteredDevices.filter(d => d.alarm_state === 'Active Alarm').length; // Removed as per new requirements
    const activeAlarmCount = 0; // Placeholder
	const connectionRate = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;

	// Helper for interval text
	const getIntervalText = (val?: number | null) => {
		if (val === null || val === undefined) return 'null';
		const map: Record<number, string> = {
			0: 'Disabled', 1: '10min', 2: '15min', 3: '30min', 
			4: '1hour', 5: '6hour', 6: '12hour', 7: 'daily'
		};
		return map[val] || val.toString();
	};

	const formatCoords = (x: unknown, y: unknown) => {
		const xVal = x ?? '';
		const yVal = y ?? '';
		if (xVal === '' && yVal === '') return 'null';
		if (xVal === '') return String(yVal);
		if (yVal === '') return String(xVal);
		return `${String(xVal)}, ${String(yVal)}`;
	};

	const columns: ColumnsType<DeviceData> = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			width: 60,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: 150,
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Model Name',
			dataIndex: 'modelName',
			key: 'modelName',
			width: 150,
		},
		{
			title: 'Location',
			dataIndex: 'location',
			key: 'location',
			width: 150,
		},
		{
			title: 'Network Addr',
			dataIndex: 'priAddr',
			key: 'priAddr',
			width: 120,
		},
		{
			title: 'Network Status',
			dataIndex: 'nwkStatus',
			key: 'nwkStatus',
			width: 120,
			render: (status: number) => (
				<Badge 
					status={status === 1 ? 'success' : 'error'}
					text={status === 1 ? 'Online' : 'Offline'}
				/>
			),
		},
		{
			title: 'Enabled Status',
			dataIndex: 'enabled',
			key: 'enabled',
			width: 100,
			render: (enabled: number) => (
                <Tag color={enabled === 1 ? 'green' : 'red'}>
                    {enabled === 1 ? 'Enable' : 'Disable'}
                </Tag>
            ),
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 160,
			render: (_: unknown, record: DeviceData) => (
				<Space size={2}>
					<Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDevice(record)} style={{ borderColor: '#003A70', color: '#003A70' }}>DATA</Button>
					<Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditDevice(record)} style={{ color: '#003A70' }}>Edit</Button>
					<Button type="link" size="small" danger icon={<DeleteOutlined />}>Delete</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
			<div style={{ width: '100%', maxWidth: 1600, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
				
				{/* Layer 1: Info Bar */}
				<div style={{ 
					backgroundColor: '#fff', 
					border: '1px solid #d9d9d9',
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
						<Typography.Text strong style={{ fontSize: 16 }}>Device Statistics</Typography.Text>
						
						<Space split={<Typography.Text type="secondary">|</Typography.Text>} size={16}>
							<Typography.Text>Total: <strong>{totalDevices}</strong></Typography.Text>
							<Typography.Text>Online: <strong style={{ color: '#52c41a' }}>{onlineDevices}</strong></Typography.Text>
							<Typography.Text>Offline: <strong style={{ color: '#ff4d4f' }}>{offlineDevices}</strong></Typography.Text>
							<Typography.Text>Active Alarms: <strong style={{ color: '#ff4d4f' }}>{activeAlarmCount}</strong></Typography.Text>
							<Typography.Text>Connection Rate: <strong>{connectionRate}%</strong></Typography.Text>
						</Space>
					</Space>

					<Space>
						<Typography.Text type="secondary">Last Updated: {dayjs().format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
						<Button icon={<ReloadOutlined />} type="text" onClick={handleRefresh} loading={refreshing} />
					</Space>
				</div>

				{/* Layer 2: Toolbar */}
				<Card bordered bodyStyle={{ padding: '16px' }} style={{ flexShrink: 0 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Space size="middle">
							<Input 
								placeholder="" 
								prefix={<SearchOutlined />} 
								style={{ width: 240 }}
								value={searchText}
								onChange={e => setSearchText(e.target.value)}
							/>
							<Select 
								defaultValue="all" 
								style={{ width: 120 }}
								value={filterStatus}
								onChange={val => setFilterStatus(val)}
							>
								<Option value="all">All Status</Option>
								<Option value="online">Online</Option>
								<Option value="offline">Offline</Option>
							</Select>
							<Select 
								defaultValue="all" 
								style={{ width: 150 }}
								value={filterModel}
								onChange={val => setFilterModel(val)}
							>
								<Option value="all">All Models</Option>
								{uniqueModels.map(model => (
									<Option key={model} value={model}>{model}</Option>
								))}
							</Select>
						</Space>
						<Space>
							<Button icon={<FilterOutlined />}>Filters</Button>
							<Button icon={<ExportOutlined />}>Export</Button>
							<Button 
								type="primary" 
								icon={<PlusOutlined />} 
								onClick={() => navigate(deviceId ? `/device/${deviceId}/devices/add` : '/devices/add')}
								style={{ backgroundColor: '#003A70' }}
							>
								Add Device
							</Button>
						</Space>
					</div>
				</Card>

				{/* Layer 3: Table */}
				<Card 
					bordered
					style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
					bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				>
					{refreshing && devices.length === 0 ? (
						<div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
					) : (
						<Table 
							columns={columns} 
							dataSource={filteredDevices} 
							rowKey="id"
							pagination={false}
							scroll={{ x: 1100, y: 'calc(100vh - 350px)' }}
							size="small"
						/>
					)}
				</Card>

				{/* Device Detail Modal */}
				<Modal
					title="Device Details"
					open={isModalVisible}
					onCancel={() => setIsModalVisible(false)}
					footer={null}
					width="95%"
					style={{ top: 20 }}
					bodyStyle={{ padding: 0, backgroundColor: '#fff' }}
					zIndex={1050}
				>
				{selectedDevice && (
					<div style={{ padding: '16px' }}>
						{/* Part 1: Top - Device Information (Merged Basic + Comm) */}
						<Card bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px' }}>
							<Row gutter={[24, 16]}>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Device Name</Typography.Text>
										<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.name || 'null'}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Model</Typography.Text>
										<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.modelName || 'null'}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Firmware Version</Typography.Text>
										<div style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.fw_ver || 'null'}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Last Report</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>
                                        {selectedDevice.lastSeen ? dayjs.unix(selectedDevice.lastSeen).fromNow() : 'Never'}
                                    </div>
								</Col>

								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Modbus Address</Typography.Text>
										<div style={{ fontSize: 14 }}>{selectedDevice.priAddr ?? 'null'}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Secondary Address</Typography.Text>
										<div style={{ fontSize: 14 }}>{selectedDevice.sec_addr ?? 'null'}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Tertiary Address</Typography.Text>
										<div style={{ fontSize: 14 }}>{selectedDevice.ter_addr ?? 'null'}</div>
								</Col>

								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Logging Interval</Typography.Text>
									<div style={{ fontSize: 14 }}>{getIntervalText(selectedDevice.log_intvl)}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Reporting Interval</Typography.Text>
									<div style={{ fontSize: 14 }}>{getIntervalText(selectedDevice.report_intvl)}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Health Interval</Typography.Text>
									<div style={{ fontSize: 14 }}>{getIntervalText(selectedDevice.health_intvl)}</div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Enabled</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500 }}>
                                        <Badge 
                                            status={selectedDevice.enabled === 1 ? 'success' : 'default'} 
                                            text={selectedDevice.enabled === 1 ? 'Enabled' : 'Disabled'} 
                                        />
                                    </div>
								</Col>
								<Col flex="20%">
									<Typography.Text style={{ fontSize: 14, color: '#666' }}>Status</Typography.Text>
									<div><Badge status={selectedDevice.nwkStatus === 1 ? 'success' : 'error'} text={selectedDevice.nwkStatus === 1 ? 'Online' : 'Offline'} /></div>
								</Col>
							</Row>
						</Card>

						<Row gutter={16}>
							{/* Part 2: Left - Location */}
							<Col span={8}>
								<Card title="Location Information" bordered={false} style={{ height: '100%' }}>
									<Descriptions column={1} size="small" bordered>
										<Descriptions.Item label="Location ID">{selectedDevice.loc_id || 'null'}</Descriptions.Item>
										<Descriptions.Item label="Location Name">{selectedDevice.loc_name || 'null'}</Descriptions.Item>
										<Descriptions.Item label="Subname">{selectedDevice.loc_subname || 'null'}</Descriptions.Item>
										<Descriptions.Item label="Block">{selectedDevice.loc_blk || 'null'}</Descriptions.Item>
										<Descriptions.Item label="Unit">{selectedDevice.loc_unit || 'null'}</Descriptions.Item>
										<Descriptions.Item label="Postal Code">{selectedDevice.postal_code || 'null'}</Descriptions.Item>
										<Descriptions.Item label="Address">{selectedDevice.loc_addr || 'null'}</Descriptions.Item>
										<Descriptions.Item label="Coordinates (X, Y)">
											{formatCoords(selectedDevice.x, selectedDevice.y)}
										</Descriptions.Item>
										<Descriptions.Item label="Height (H)">{selectedDevice.h ?? 'null'}</Descriptions.Item>
									</Descriptions>
								</Card>
							</Col>

							{/* Part 3: Right - Parameters */}
							<Col span={16}>
								<Card 
									title="Device Parameters" 
									bordered={false}
									style={{ height: '460px', display: 'flex', flexDirection: 'column' }}
									bodyStyle={{ 
										padding: '16px',
										overflowY: 'auto',
										flex: 1,
									}}
								>
									<Row gutter={[16, 16]}>
										{deviceParameters.length > 0 ? (
											deviceParameters.map((param) => (
												<Col span={8} key={param.id}>
													<Card
														size="small"
														style={{ 
															backgroundColor: '#fafafa',
															border: '1px solid #d9d9d9',
															cursor: 'default'
														}}
														bodyStyle={{ padding: '12px' }}
														hoverable={false}
													>
														<Space direction="vertical" size={4} style={{ width: '100%' }}>
															<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
																<Typography.Text style={{ fontWeight: 500 }}>
																	{param.name}
																</Typography.Text>
																<Tag>{param.dataType === 0 ? 'Boolean' : param.dataType === 1 ? 'Integer' : 'Float'}</Tag>
															</div>
															<div style={{ fontSize: 12, color: '#666' }}>
																ID: {param.id} | Sensitivity: {param.sensitivity}
															</div>
															<div style={{ fontSize: 12, color: '#666' }}>
																Unit: {param.unit || 'N/A'} | Access: {param.rw === 1 ? 'R/W' : 'R'}
															</div>
														</Space>
													</Card>
												</Col>
											))
										) : (
											<Col span={24}>
												<div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
													No parameters found for this device.
												</div>
											</Col>
										)}
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
				width="95%"
				style={{ top: 20 }}
				bodyStyle={{ padding: 0, backgroundColor: '#fff' }}
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
					<div style={{ height: '80vh', overflow: 'auto', padding: '24px' }}>
						{/* Part 1: Top - Device Configuration (Matches View Modal Layout) */}
						<Card bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: '24px' }}>
							<Row gutter={[24, 16]}>
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Device Name</Typography.Text>
									<Input 
										value={editForm.name} 
										onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
										style={{ marginTop: 4, borderColor: isDirty('name') ? '#003A70' : undefined }} 
									/>
								</Col>
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Model Name</Typography.Text>
									<Input 
										value={editForm.node_id} 
										onChange={(e) => setEditForm({ ...editForm, node_id: e.target.value })}
										style={{ marginTop: 4, borderColor: isDirty('node_id') ? '#003A70' : undefined }}
									/>
								</Col>
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Firmware Version</Typography.Text>
									<Input 
										value={editForm.fw_ver} 
										onChange={(e) => setEditForm({ ...editForm, fw_ver: e.target.value })}
										style={{ marginTop: 4, borderColor: isDirty('fw_ver') ? '#003A70' : undefined }}
									/>
								</Col>
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Last Report</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>
										{editingDevice.lastSeen ? dayjs.unix(editingDevice.lastSeen).fromNow() : 'Never'}
									</div>
								</Col>

								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Modbus Address</Typography.Text>
									<Input 
										value={editForm.priAddr} 
										onChange={(e) => setEditForm({ ...editForm, priAddr: e.target.value })}
										style={{ marginTop: 4, borderColor: isDirty('priAddr') ? '#003A70' : undefined }} 
									/>
								</Col>
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Secondary Address</Typography.Text>
									<Input 
										value={editForm.sec_addr} 
										onChange={(e) => setEditForm({ ...editForm, sec_addr: e.target.value })}
										style={{ marginTop: 4, borderColor: isDirty('sec_addr') ? '#003A70' : undefined }}
									/>
								</Col>
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Tertiary Address</Typography.Text>
									<Input 
										value={editForm.ter_addr} 
										onChange={(e) => setEditForm({ ...editForm, ter_addr: e.target.value })}
										style={{ marginTop: 4, borderColor: isDirty('ter_addr') ? '#003A70' : undefined }}
									/>
								</Col>

								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Logging Interval</Typography.Text>
									<Select
										value={editForm.log_intvl}
										onChange={(value) => setEditForm({ ...editForm, log_intvl: value })}
										style={{ width: '100%', marginTop: 4, borderColor: isDirty('log_intvl') ? '#003A70' : undefined }}
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
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Reporting Interval</Typography.Text>
									<Select
										value={editForm.report_intvl}
										onChange={(value) => setEditForm({ ...editForm, report_intvl: value })}
										style={{ width: '100%', marginTop: 4, borderColor: isDirty('report_intvl') ? '#003A70' : undefined }}
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
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Health Interval</Typography.Text>
									<Select
										value={editForm.health_intvl}
										onChange={(value) => setEditForm({ ...editForm, health_intvl: value })}
										style={{ width: '100%', marginTop: 4, borderColor: isDirty('health_intvl') ? '#003A70' : undefined }}
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
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Enabled</Typography.Text>
									<div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>
										<Badge 
											status={editingDevice.enabled === 1 ? 'success' : 'default'} 
											text={editingDevice.enabled === 1 ? 'Enabled' : 'Disabled'} 
										/>
									</div>
								</Col>
								<Col flex="20%">
									<Typography.Text type="secondary" style={{ fontSize: 12 }}>Status</Typography.Text>
									<div style={{ marginTop: 4 }}><Badge status={editingDevice.nwkStatus === 1 ? 'success' : 'error'} text={editingDevice.nwkStatus === 1 ? 'Online' : 'Offline'} /></div>
								</Col>
							</Row>
						</Card>

						{/* Part 2: Middle - Location Information */}
						<Collapse 
							ghost 
							items={[{
								key: '1',
								label: <Typography.Text strong style={{ fontSize: 16 }}>Location Information</Typography.Text>,
								children: (
									<Row gutter={[24, 16]}>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Location ID</Typography.Text>
											<Input
												value={editForm.loc_id}
												onChange={(e) => setEditForm({ ...editForm, loc_id: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('loc_id') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Location Name</Typography.Text>
											<Input
												value={editForm.loc_name}
												onChange={(e) => setEditForm({ ...editForm, loc_name: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('loc_name') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Location Subname</Typography.Text>
											<Input
												value={editForm.loc_subname}
												onChange={(e) => setEditForm({ ...editForm, loc_subname: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('loc_subname') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Block Number/Name</Typography.Text>
											<Input
												value={editForm.loc_blk}
												onChange={(e) => setEditForm({ ...editForm, loc_blk: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('loc_blk') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Floor/Unit</Typography.Text>
											<Input
												value={editForm.loc_unit}
												onChange={(e) => setEditForm({ ...editForm, loc_unit: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('loc_unit') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Postal Code</Typography.Text>
											<Input
												value={editForm.postal_code}
												onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('postal_code') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Latitude (X)</Typography.Text>
											<Input
												value={editForm.x}
												onChange={(e) => setEditForm({ ...editForm, x: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('x') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Longitude (Y)</Typography.Text>
											<Input
												value={editForm.y}
												onChange={(e) => setEditForm({ ...editForm, y: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('y') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Height from Floor (H)</Typography.Text>
											<Input
												value={editForm.h}
												onChange={(e) => setEditForm({ ...editForm, h: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('h') ? '#003A70' : undefined }}
											/>
										</Col>
										<Col flex="20%">
											<Typography.Text type="secondary" style={{ fontSize: 12 }}>Location Address</Typography.Text>
											<Input
												value={editForm.loc_addr}
												onChange={(e) => setEditForm({ ...editForm, loc_addr: e.target.value })}
												style={{ marginTop: 4, borderColor: isDirty('loc_addr') ? '#003A70' : undefined }}
											/>
										</Col>
									</Row>
								)
							}]}
							style={{ marginBottom: 16, backgroundColor: '#fff' }}
						/>

						{/* Part 3: Bottom - Parameter Bindings */}
						<Card title="Parameter Bindings" bordered={false}>
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
										<div style={{ height: '250px', overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: '8px' }}>
											<List
												size="small"
												bordered={false}
												dataSource={boundParameters}
												renderItem={(item, index) => (
													<List.Item
														actions={[
															<Button 
																type="link" 
																danger 
																size="small"
																icon={<CloseCircleOutlined />}
																onClick={() => item.mapId && handleUnbindParameter(item.mapId)}
																disabled={!item.mapId}
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
										</div>
									)}
								</div>

								{/* Search and Add Parameters */}
								<div>
									<Typography.Text strong style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
										Add Parameter Binding
									</Typography.Text>
									<Space direction="vertical" size={12} style={{ width: '100%' }}>
										<Search
											placeholder=""
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
						</Card>
					</div>
				)}
			</Modal>

			{/* Unbind Confirmation Modal */}
			<Modal
				title="Confirm Unbind Parameter"
				open={isUnbindConfirmVisible}
				onOk={confirmUnbindParameter}
				confirmLoading={unbindLoading}
				onCancel={() => {
					if (!unbindLoading) {
						setIsUnbindConfirmVisible(false);
						setSelectedParameterToUnbind(null);
					}
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
					<strong>Parameter:</strong> {boundParameters.find(p => p.mapId === selectedParameterToUnbind)?.name} → {boundParameters.find(p => p.mapId === selectedParameterToUnbind)?.deviceName}
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

            <Modal
                title="Confirm Changes"
                open={isConfirmSaveVisible}
                onCancel={() => setIsConfirmSaveVisible(false)}
                onOk={handleConfirmSave}
                zIndex={1100}
            >
                <Typography.Paragraph>
                    You are about to update <strong>{getDirtyFields().length}</strong> fields for device <strong>{editingDevice?.name}</strong>.
                </Typography.Paragraph>
                <List
                    size="small"
                    bordered
                    dataSource={getDirtyFields()}
                    renderItem={field => (
                        <List.Item>
                            <Typography.Text strong>{field}: </Typography.Text>
                            <Typography.Text delete style={{ margin: '0 8px', color: 'red' }}>
                                {initialEditForm?.[field as keyof typeof editForm]}
                            </Typography.Text>
                            <ArrowRightOutlined style={{ marginRight: 8 }} />
                            <Typography.Text type="success">
                                {editForm[field as keyof typeof editForm]}
                            </Typography.Text>
                        </List.Item>
                    )}
                    style={{ maxHeight: '300px', overflowY: 'auto' }}
                />
            </Modal>

            {/* Loading Modal */}
            <Modal
                open={saveLoading}
                footer={null}
                closable={false}
                centered
                width={300}
                zIndex={1200}
            >
                <div style={{ textAlign: 'center', padding: '24px' }}>
                    <Spin size="large" />
                    <Typography.Title level={5} style={{ marginTop: 16, marginBottom: 0 }}>
                        Saving Changes...
                    </Typography.Title>
                    <Typography.Text type="secondary">
                        Please wait while the device is being updated.
                    </Typography.Text>
                </div>
            </Modal>
		</div>
		</div>
	);
};

export default Devices;
















