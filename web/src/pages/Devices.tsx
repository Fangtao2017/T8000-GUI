import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Badge, Row, Col, Typography, Progress, Input, Select, Modal, DatePicker, message, List } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, LineChartOutlined, DownloadOutlined, SaveOutlined, CloseCircleOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;

// Parameter unit mapping
const parameterUnits: Record<string, string> = {
	voltage: 'V',
	voltageL1: 'V',
	voltageL2: 'V',
	voltageL3: 'V',
	current: 'A',
	currentL1: 'A',
	currentL2: 'A',
	currentL3: 'A',
	power: 'W',
	energy: 'kWh',
	frequency: 'Hz',
	powerFactor: '',
	temperature: '°C',
	setTemp: '°C',
	currentTemp: '°C',
	setpoint: '°C',
	humidity: '%',
	brightness: '%',
	level: '%',
	pressure: 'bar',
	uptime: 'h',
	connectionCount: '',
	fanSpeed: '',
	mode: '',
	input1: '',
	input2: '',
	input3: '',
	input4: '',
	output1: '',
	output2: '',
	output3: '',
	output4: '',
	signalStrength: 'dBm',
};

interface DeviceData {
	key: string;
	name: string;
	model: string;
	serialNumber: string;
	type: string;
	priAddr: string;
	location: string;
	status: 'online' | 'offline';
	lastReport: string;
	parameters?: Record<string, number | string>; // Dynamic parameters
}

const Devices: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [filterType, setFilterType] = useState<string>('all');
	const [filterStatus, setFilterStatus] = useState<string>('all');
	const [filterModel, setFilterModel] = useState<string>('all');
	const [filterLocation, setFilterLocation] = useState<string>('all');
	const [refreshing, setRefreshing] = useState(false);
	
	// Modal states
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
	const [editingDevice, setEditingDevice] = useState<DeviceData | null>(null);
	const [selectedParam1, setSelectedParam1] = useState<string>('');
	const [selectedParam2, setSelectedParam2] = useState<string>('');
	const [dateRange1, setDateRange1] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
	const [dateRange2, setDateRange2] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
	
	// Edit form states - based on database schema from images
	const [editForm, setEditForm] = useState({
		node_id: '',
		pri_addr: '',
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

	// Mock data with models from image
	const allDevices: DeviceData[] = [
		{ key: '1', name: 'Gateway Main', model: 'T8000', serialNumber: '200310000092', type: 'Gateway', priAddr: '1', location: 'Office Area NE Corner', status: 'online', lastReport: 'Just now', parameters: { voltage: 220, current: 2.5, power: 550, frequency: 50, uptime: 72, connectionCount: 12 } },
		{ key: '2', name: 'Occupancy Sensor A1', model: 'T-OXM-001', serialNumber: '200310000093', type: 'Humidity', priAddr: '2', location: 'Reception Area', status: 'online', lastReport: '1 min ago', parameters: { humidity: 65, temperature: 23.5 } },
		{ key: '3', name: 'Dimmer Control 1', model: 'T-DIM-001', serialNumber: '200310000094', type: 'Actuator', priAddr: '3', location: 'Storage Area', status: 'online', lastReport: '2 min ago', parameters: { brightness: 75, power: 120, voltage: 220 } },
		{ key: '4', name: 'Occupancy Sensor B2', model: 'T-OCC-001', serialNumber: '200310000095', type: 'Temp', priAddr: '4', location: 'Office Area SW Corner', status: 'offline', lastReport: '10 min ago', parameters: { temperature: 22.1, humidity: 58 } },
		{ key: '5', name: 'Air Conditioning Panel', model: 'T-PM-001', serialNumber: '200310000096', type: 'Actuator', priAddr: '5', location: 'Meeting Room A', status: 'online', lastReport: '3 min ago', parameters: { setTemp: 24, currentTemp: 23.8, fanSpeed: 3, mode: 'cool', power: 1200 } },
		{ key: '6', name: 'Tank Level Sensor', model: 'T-IR-001', serialNumber: '200310000097', type: 'Pressure', priAddr: '6', location: 'Basement Water Tank', status: 'online', lastReport: '5 min ago', parameters: { level: 85, pressure: 2.3, temperature: 18.5 } },
		{ key: '7', name: 'Electric Meter Main', model: 'T-SP-001', serialNumber: '200310000098', type: 'Gateway', priAddr: '7', location: 'Electrical Room', status: 'online', lastReport: 'Just now', parameters: { voltage: 220, current: 15.2, power: 3344, energy: 1250.5, powerFactor: 0.98 } },
		{ key: '8', name: 'Energy Meter 3-Phase', model: 'T-EMS-002', serialNumber: '200310000099', type: 'Pressure', priAddr: '8', location: 'Substation A', status: 'offline', lastReport: '25 min ago', parameters: { voltageL1: 220, voltageL2: 221, voltageL3: 219, currentL1: 8.5, currentL2: 8.7, currentL3: 8.3, power: 5650, energy: 3200.8, frequency: 50, powerFactor: 0.95 } },
		{ key: '9', name: 'Aircon Control Panel', model: 'T-ACP-001', serialNumber: '200310000100', type: 'Temp', priAddr: '9', location: 'Office Area Central', status: 'online', lastReport: '2 min ago', parameters: { temperature: 23.2, setpoint: 24, fanSpeed: 2, mode: 'auto' } },
		{ key: '10', name: 'Digital I/O Module', model: 'T-DITO-01', serialNumber: '200310000101', type: 'Actuator', priAddr: '10', location: 'Control Cabinet 1', status: 'online', lastReport: '4 min ago', parameters: { input1: 1, input2: 0, input3: 1, input4: 0, output1: 1, output2: 1, output3: 0, output4: 1 } },
		{ key: '11', name: 'Temperature Sensor 1', model: 'T-TEM-001', serialNumber: '200310000102', type: 'Temp', priAddr: '11', location: 'Server Room', status: 'online', lastReport: '1 min ago', parameters: { temperature: 21.5 } },
		{ key: '12', name: 'Multi Interface Unit', model: 'T-MIU-001', serialNumber: '200310000103', type: 'Gateway', priAddr: '12', location: 'Workshop East Zone', status: 'online', lastReport: '3 min ago', parameters: { voltage: 220, current: 5.2, temperature: 45.3, humidity: 52, signalStrength: -65 } },
		{ key: '13', name: 'Temperature Sensor 4', model: 'T-TEM-001', serialNumber: '200310000104', type: 'Temp', priAddr: '13', location: 'Conference Room B', status: 'online', lastReport: '2 min ago', parameters: { temperature: 22.8 } },
		{ key: '14', name: 'Humidity Sensor C1', model: 'T-OXM-001', serialNumber: '200310000105', type: 'Humidity', priAddr: '14', location: 'Storage Area South', status: 'online', lastReport: '4 min ago', parameters: { humidity: 58, temperature: 21.5 } },
		{ key: '15', name: 'Pressure Sensor A5', model: 'T-IR-001', serialNumber: '200310000106', type: 'Pressure', priAddr: '15', location: 'Pump Room', status: 'offline', lastReport: '15 min ago', parameters: { level: 72, pressure: 1.8, temperature: 19.2 } },
		{ key: '16', name: 'Gateway G2', model: 'T8000', serialNumber: '200310000107', type: 'Gateway', priAddr: '16', location: 'Building 2 Entrance', status: 'online', lastReport: 'Just now', parameters: { voltage: 220, current: 2.8, power: 616, frequency: 50, uptime: 120, connectionCount: 8 } },
		{ key: '17', name: 'Dimmer Control 2', model: 'T-DIM-001', serialNumber: '200310000108', type: 'Actuator', priAddr: '17', location: 'Hallway Main', status: 'online', lastReport: '1 min ago', parameters: { brightness: 60, power: 95, voltage: 220 } },
		{ key: '18', name: 'AC Panel Meeting Room B', model: 'T-PM-001', serialNumber: '200310000109', type: 'Actuator', priAddr: '18', location: 'Meeting Room B', status: 'online', lastReport: '5 min ago', parameters: { setTemp: 23, currentTemp: 22.9, fanSpeed: 2, mode: 'cool', power: 1100 } },
		{ key: '19', name: 'Flow Meter Main', model: 'T-FM-001', serialNumber: '200310000110', type: 'Pressure', priAddr: '19', location: 'Water Supply Room', status: 'online', lastReport: '3 min ago', parameters: { level: 90, pressure: 2.5, temperature: 17.8 } },
		{ key: '20', name: 'Temperature Sensor 5', model: 'T-TEM-001', serialNumber: '200310000111', type: 'Temp', priAddr: '20', location: 'Data Center', status: 'online', lastReport: '1 min ago', parameters: { temperature: 19.5 } },
		{ key: '21', name: 'Energy Meter Building 2', model: 'T-EMS-002', serialNumber: '200310000112', type: 'Pressure', priAddr: '21', location: 'Building 2 Main Panel', status: 'online', lastReport: '2 min ago', parameters: { voltageL1: 221, voltageL2: 220, voltageL3: 222, currentL1: 9.2, currentL2: 9.5, currentL3: 9.1, power: 6100, energy: 4500.2, frequency: 50, powerFactor: 0.96 } },
		{ key: '22', name: 'Occupancy Sensor C3', model: 'T-OCC-001', serialNumber: '200310000113', type: 'Temp', priAddr: '22', location: 'Cafeteria', status: 'online', lastReport: '6 min ago', parameters: { temperature: 24.5, humidity: 62 } },
		{ key: '23', name: 'Digital I/O Module 2', model: 'T-DITO-01', serialNumber: '200310000114', type: 'Actuator', priAddr: '23', location: 'Control Cabinet 2', status: 'offline', lastReport: '20 min ago', parameters: { input1: 0, input2: 1, input3: 0, input4: 1, output1: 0, output2: 1, output3: 1, output4: 0 } },
		{ key: '24', name: 'Humidity Sensor D4', model: 'T-OXM-001', serialNumber: '200310000115', type: 'Humidity', priAddr: '24', location: 'Archive Room', status: 'online', lastReport: '7 min ago', parameters: { humidity: 45, temperature: 20.2 } },
		{ key: '25', name: 'Gateway G3', model: 'T8000', serialNumber: '200310000116', type: 'Gateway', priAddr: '25', location: 'Building 3 Lobby', status: 'online', lastReport: 'Just now', parameters: { voltage: 220, current: 3.1, power: 682, frequency: 50, uptime: 96, connectionCount: 15 } },
	];

	const handleRefresh = () => {
		setRefreshing(true);
		message.success('Data refreshed successfully');
		setTimeout(() => setRefreshing(false), 1000);
	};

	const handleExportChart1 = () => {
		if (!selectedDevice || !selectedParam1) {
			message.warning('Please select a parameter first');
			return;
		}
		
		const exportData = {
			deviceName: selectedDevice.name,
			parameter: selectedParam1,
			value: selectedDevice.parameters?.[selectedParam1],
			unit: parameterUnits[selectedParam1] || '',
			dateRange: dateRange1 ? {
				start: dateRange1[0].format('YYYY-MM-DD HH:mm'),
				end: dateRange1[1].format('YYYY-MM-DD HH:mm'),
			} : null,
			exportTime: new Date().toLocaleString(),
		};
		
		const jsonString = JSON.stringify(exportData, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${selectedDevice.name}_${selectedParam1}_${new Date().getTime()}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		
		message.success('Chart 1 data exported successfully');
	};

	const handleExportChart2 = () => {
		if (!selectedDevice || !selectedParam2) {
			message.warning('Please select a parameter first');
			return;
		}
		
		const exportData = {
			deviceName: selectedDevice.name,
			parameter: selectedParam2,
			value: selectedDevice.parameters?.[selectedParam2],
			unit: parameterUnits[selectedParam2] || '',
			dateRange: dateRange2 ? {
				start: dateRange2[0].format('YYYY-MM-DD HH:mm'),
				end: dateRange2[1].format('YYYY-MM-DD HH:mm'),
			} : null,
			exportTime: new Date().toLocaleString(),
		};
		
		const jsonString = JSON.stringify(exportData, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${selectedDevice.name}_${selectedParam2}_${new Date().getTime()}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		
		message.success('Chart 2 data exported successfully');
	};

	const handleViewDevice = (device: DeviceData) => {
		setSelectedDevice(device);
		setIsModalVisible(true);
		// Set default parameters for charts
		const params = Object.keys(device.parameters || {});
		if (params.length > 0) {
			setSelectedParam1(params[0]);
			if (params.length > 1) {
				setSelectedParam2(params[1]);
			}
		}
		// Set default date range (last 24 hours with time)
		setDateRange1([dayjs().subtract(24, 'hour'), dayjs()]);
		setDateRange2([dayjs().subtract(24, 'hour'), dayjs()]);
	};

	const handleEditDevice = (device: DeviceData) => {
		setEditingDevice(device);
		setIsEditModalVisible(true);
		// Initialize form with device data (using NULL as placeholder for empty fields)
		setEditForm({
			node_id: device.serialNumber || 'NULL',
			pri_addr: device.priAddr || 'NULL',
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
			device.model.toLowerCase().includes(searchText.toLowerCase()) ||
			device.priAddr.includes(searchText);
		
		const matchType = filterType === 'all' || device.type === filterType;
		const matchStatus = filterStatus === 'all' || device.status === filterStatus;
		const matchModel = filterModel === 'all' || device.model === filterModel;
		const matchLocation = filterLocation === 'all' || device.location === filterLocation;

		return matchSearch && matchType && matchStatus && matchModel && matchLocation;
	}).sort((a, b) => {
		// Sort offline devices to the top
		if (a.status === 'offline' && b.status === 'online') return -1;
		if (a.status === 'online' && b.status === 'offline') return 1;
		return 0;
	});

	// Reset to page 1 when filters change
	React.useEffect(() => {
		// Filters changed, no pagination needed
	}, [searchText, filterType, filterStatus, filterModel, filterLocation]);

	// Get unique values for filter options
	const uniqueTypes = Array.from(new Set(allDevices.map(d => d.type))).sort();
	const uniqueModels = Array.from(new Set(allDevices.map(d => d.model))).sort();
	const uniqueLocations = Array.from(new Set(allDevices.map(d => d.location))).sort();

	// Statistics based on filtered data
	const totalDevices = filteredDevices.length;
	const onlineDevices = filteredDevices.filter(d => d.status === 'online').length;
	const offlineDevices = filteredDevices.filter(d => d.status === 'offline').length;
	const connectionRate = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;

	const columns: ColumnType<DeviceData>[] = [
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
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			width: 150,
			render: (type: string) => <Tag>{type}</Tag>,
		},
		{
			title: 'Pri_addr',
			dataIndex: 'priAddr',
			key: 'priAddr',
			width: 100,
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
							<Typography.Title level={2} style={{ margin: 0, color: connectionRate > 80 ? '#52c41a' : '#faad14' }}>{connectionRate}%</Typography.Title>
							<Progress percent={connectionRate} showInfo={false} strokeColor={connectionRate > 80 ? '#52c41a' : '#faad14'} />
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Search and Filter Bar - All on Same Row */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Search
							placeholder="Search by name, S/N, model or Pri_addr..."
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
							setFilterType('all');
							setFilterStatus('all');
							setFilterModel('all');
							setFilterLocation('all');
						}}>Reset All Filters</Button>
						<Button type="primary" icon={<ReloadOutlined />} loading={refreshing} onClick={handleRefresh} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
							Refresh Data
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
				width="90%"
				style={{ top: 20 }}
				bodyStyle={{ padding: 0, backgroundColor: '#E8EDF2' }}
				zIndex={1050}
			>
				{selectedDevice && (
					<div style={{ padding: '24px' }}>
						{/* Device Basic Info Header */}
						<Card 
							bordered={false} 
							style={{ marginBottom: 24, backgroundColor: '#fafafa' }}
							bodyStyle={{ padding: '16px 24px' }}
						>
							<Row gutter={32}>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Device Model</Typography.Text>
										<Typography.Title level={4} style={{ margin: 0 }}>{selectedDevice.model}</Typography.Title>
									</Space>
								</Col>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Single-phase Energy Meter</Typography.Text>
										<Typography.Text strong style={{ fontSize: 16 }}>{selectedDevice.name}</Typography.Text>
									</Space>
								</Col>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Load Status</Typography.Text>
										<Space>
											<Badge status={selectedDevice.status === 'online' ? 'success' : 'error'} />
											<Typography.Text strong>{selectedDevice.status === 'online' ? 'ON - Active' : 'OFF - Inactive'}</Typography.Text>
										</Space>
									</Space>
								</Col>
								<Col span={6}>
									<Space direction="vertical" size={4}>
										<Typography.Text type="secondary" style={{ fontSize: 12 }}>Location</Typography.Text>
										<Typography.Text strong>{selectedDevice.location}</Typography.Text>
									</Space>
								</Col>
							</Row>
						</Card>

						{/* Main Content - Parameters and Charts */}
						<Row gutter={16}>
							{/* Left: Parameters Panel */}
							<Col span={8}>
								<Card 
									title="Device Parameters" 
									bordered
									style={{ height: '600px', backgroundColor: '#FFFFFF', color: '#000' }}
									headStyle={{ backgroundColor: '#fafafa', color: '#000', borderBottom: '1px solid #333' }}
									bodyStyle={{ 
										padding: '16px',
										height: 'calc(100% - 57px)',
										overflow: 'auto',
										backgroundColor: '#ffffffff'
									}}
								>
									<Row gutter={[16, 16]}>
										{selectedDevice.parameters && Object.entries(selectedDevice.parameters).map(([key, value]) => (
											<Col span={12} key={key}>
												<Card
													size="small"
													style={{ 
														backgroundColor: '#fafafa',
														border: '1px solid #d9d9d9',
														cursor: 'pointer',
														transition: 'all 0.3s'
													}}
													bodyStyle={{ padding: '12px' }}
													hoverable
													onClick={() => {
														if (!selectedParam1) {
															setSelectedParam1(key);
														} else if (!selectedParam2) {
															setSelectedParam2(key);
														}
													}}
												>
													<Space direction="vertical" size={4} style={{ width: '100%' }}>
														<Typography.Text style={{ color: '#888', fontSize: 11, textTransform: 'uppercase' }}>
															{key.replace(/([A-Z])/g, ' $1').trim()}
															{parameterUnits[key] ? ` (${parameterUnits[key]})` : ''}
														</Typography.Text>
														<Typography.Text strong style={{ color: '#000', fontSize: 18 }}>
															{typeof value === 'number' ? value.toFixed(2) : value}
														</Typography.Text>
													</Space>
												</Card>
											</Col>
										))}
									</Row>
								</Card>
							</Col>

							{/* Right: Two Chart Panels */}
							<Col span={16}>
								<Space direction="vertical" size={16} style={{ width: '100%' }}>
									{/* Chart 1 */}
									<Card 
										title={
											<Space>
												<LineChartOutlined />
												<span>Historical Data Chart 1</span>
												<Button 
													type="primary" 
													size="small"
													icon={<DownloadOutlined />}
													onClick={handleExportChart1}
													style={{ marginLeft: 8, backgroundColor: '#003A70', borderColor: '#003A70' }}
												>
													Export Data
												</Button>
											</Space>
										}
										bordered
										style={{ height: '292px' }}
										bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)' }}
										extra={
											<Space>
												<Select
													style={{ width: 180 }}
													placeholder="Select Parameter"
													value={selectedParam1}
													onChange={setSelectedParam1}
												>
													{selectedDevice.parameters && Object.keys(selectedDevice.parameters).map(param => (
														<Select.Option key={param} value={param}>
															{param.replace(/([A-Z])/g, ' $1').trim()}
														</Select.Option>
													))}
											</Select>
											<RangePicker
												size="small"
												showTime={{ format: 'HH:mm' }}
												format="YYYY-MM-DD HH:mm"
												value={dateRange1}
												onChange={(dates) => setDateRange1(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
												style={{ width: 320 }}
											/>
											</Space>
										}
									>
										<div style={{ 
											height: '100%', 
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'center',
											border: '2px solid #f0f0f0',
											borderRadius: '4px',
											backgroundColor: '#fafafa'
										}}>
											<Typography.Text type="secondary">
												{selectedParam1 ? `Chart for ${selectedParam1} will be displayed here` : 'Select a parameter to display chart'}
											</Typography.Text>
										</div>
									</Card>

									{/* Chart 2 */}
									<Card 
										title={
											<Space>
												<LineChartOutlined />
												<span>Historical Data Chart 2</span>
												<Button 
													type="primary" 
													size="small"
													icon={<DownloadOutlined />}
													onClick={handleExportChart2}
													style={{ marginLeft: 8, backgroundColor: '#003A70', borderColor: '#003A70' }}
												>
													Export Data
												</Button>
											</Space>
										}
										bordered
										style={{ height: '292px' }}
										bodyStyle={{ padding: '16px', height: 'calc(100% - 57px)' }}
										extra={
											<Space>
												<Select
													style={{ width: 180 }}
													placeholder="Select Parameter"
													value={selectedParam2}
													onChange={setSelectedParam2}
												>
													{selectedDevice.parameters && Object.keys(selectedDevice.parameters).map(param => (
														<Select.Option key={param} value={param}>
															{param.replace(/([A-Z])/g, ' $1').trim()}
														</Select.Option>
													))}
											</Select>
											<RangePicker
												size="small"
												showTime={{ format: 'HH:mm' }}
												format="YYYY-MM-DD HH:mm"
												value={dateRange2}
												onChange={(dates) => setDateRange2(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
												style={{ width: 320 }}
											/>
											</Space>
										}
									>
										<div style={{ 
											height: '100%', 
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'center',
											border: '2px solid #f0f0f0',
											borderRadius: '4px',
											backgroundColor: '#fafafa'
										}}>
											<Typography.Text type="secondary">
												{selectedParam2 ? `Chart for ${selectedParam2} will be displayed here` : 'Select a parameter to display chart'}
											</Typography.Text>
										</div>
									</Card>
								</Space>
							</Col>
						</Row>
					</div>
				)}
			</Modal>

			{/* Device Edit Modal */}
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
										Primary Address
									</Typography.Text>
									<Input
										value={editForm.pri_addr}
										onChange={(e) => setEditForm({ ...editForm, pri_addr: e.target.value })}
										placeholder="15"
									/>
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















