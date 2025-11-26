
export interface DeviceData {
	key: string;
	name: string;
	model: string;
	serialNumber: string;
	location: string;
	status: 'online' | 'offline';
	alarm_state: 'Not alarm' | 'Active Alarm';
	err_state: 'No error' | 'Error';
	lastReport: string;
	parameters?: Record<string, number | string>; // Dynamic parameters
	// Extra fields for View Data
	pri_addr?: string | number;
	sec_addr?: string;
	ter_addr?: string;
	log_intvl?: number;
	report_intvl?: number;
	health_intvl?: number;
	loc_id?: string;
	loc_name?: string;
	loc_subname?: string;
	loc_blk?: string;
	loc_unit?: string;
	postal_code?: string;
	loc_addr?: string;
	x?: number | string;
	y?: number | string;
	h?: number | string;
	fw_ver?: string;
	enabled?: boolean;
}

// Parameter unit mapping
export const parameterUnits: Record<string, string> = {
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

// Writable parameter configuration
export const writableConfigs: Record<string, { type: 'number' | 'select' | 'switch', options?: string[] }> = {
	setTemp: { type: 'number' },
	setpoint: { type: 'number' },
	brightness: { type: 'number' },
	fanSpeed: { type: 'number' },
	mode: { type: 'select', options: ['cool', 'heat', 'auto', 'fan', 'dry'] },
	output1: { type: 'switch' },
	output2: { type: 'switch' },
	output3: { type: 'switch' },
	output4: { type: 'switch' },
};

// Mock data with models from image
export const allDevices: DeviceData[] = [
	{ 
		key: '1', 
		name: 'Gateway Main', 
		model: 'T8000', 
		serialNumber: '200310000092', 
		location: 'Office Area NE Corner', 
		status: 'online', 
		alarm_state: 'Not alarm', 
		err_state: 'No error', 
		lastReport: 'Just now', 
		parameters: { voltage: 220, current: 2.5, power: 550, frequency: 50, uptime: 72, connectionCount: 12 },
		pri_addr: 15,
		sec_addr: 'NULL',
		ter_addr: 'NULL',
		log_intvl: 4,
		report_intvl: 5,
		health_intvl: 2,
		loc_id: 'PS0001',
		loc_name: 'TOWNSVILLE PRIMARY SCHOOL',
		loc_subname: 'Admin Room',
		loc_blk: '5A',
		loc_unit: '03-24',
		postal_code: '569730',
		loc_addr: '3, Ang Mo Kio Avenue 10',
		x: 1.348299,
		y: 103.936847,
		h: 1.5,
		fw_ver: '1.32.3.1',
		enabled: true
	},
	{ key: '2', name: 'Occupancy Sensor A1', model: 'T-OCC-01', serialNumber: '200310000093', location: 'Reception Area', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '1 min ago', parameters: { humidity: 65, temperature: 23.5 }, pri_addr: 1, sec_addr: 'NULL', ter_addr: 'NULL', enabled: true },
	{ key: '3', name: 'Dimmer Control 1', model: 'T-DIM-01', serialNumber: '200310000094', location: 'Storage Area', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '2 min ago', parameters: { brightness: 75, power: 120, voltage: 220 } },
	{ key: '4', name: 'Occupancy Sensor B2', model: 'T-OCC-01', serialNumber: '200310000095', location: 'Office Area SW Corner', status: 'offline', alarm_state: 'Active Alarm', err_state: 'Error', lastReport: '10 min ago', parameters: { temperature: 22.1, humidity: 58 } },
	{ key: '5', name: 'Air Conditioning Panel', model: 'T-ACP-01', serialNumber: '200310000096', location: 'Meeting Room A', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '3 min ago', parameters: { setTemp: 24, currentTemp: 23.8, fanSpeed: 3, mode: 'cool', power: 1200 } },
	{ key: '6', name: 'Tank Level Sensor', model: 'T-TK-01', serialNumber: '200310000097', location: 'Basement Water Tank', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '5 min ago', parameters: { level: 85, pressure: 2.3, temperature: 18.5 } },
	{ key: '7', name: 'Electric Meter Main', model: 'T-EMS-01', serialNumber: '200310000098', location: 'Electrical Room', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: 'Just now', parameters: { voltage: 220, current: 15.2, power: 3344, energy: 1250.5, powerFactor: 0.98 } },
	{ key: '8', name: 'Energy Meter 3-Phase', model: 'T-EMS-02', serialNumber: '200310000099', location: 'Substation A', status: 'offline', alarm_state: 'Active Alarm', err_state: 'Error', lastReport: '25 min ago', parameters: { voltageL1: 220, voltageL2: 221, voltageL3: 219, currentL1: 8.5, currentL2: 8.7, currentL3: 8.3, power: 5650, energy: 3200.8, frequency: 50, powerFactor: 0.95 } },
	{ key: '9', name: 'Aircon Control Panel', model: 'T-ACP-01', serialNumber: '200310000100', location: 'Office Area Central', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '2 min ago', parameters: { temperature: 23.2, setpoint: 24, fanSpeed: 2, mode: 'auto' } },
	{ key: '10', name: 'Digital I/O Module', model: 'T-DIDO-01', serialNumber: '200310000101', location: 'Control Cabinet 1', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '4 min ago', parameters: { input1: 1, input2: 0, input3: 1, input4: 0, output1: 1, output2: 1, output3: 0, output4: 1 } },
	{ key: '11', name: 'Temperature Sensor 1', model: 'T-TEM-01', serialNumber: '200310000102', location: 'Server Room', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '1 min ago', parameters: { temperature: 21.5 } },
	{ key: '12', name: 'Multi Interface Unit', model: 'T-MIU-001', serialNumber: '200310000103', location: 'Workshop East Zone', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '3 min ago', parameters: { voltage: 220, current: 5.2, temperature: 45.3, humidity: 52, signalStrength: -65 } },
	{ key: '13', name: 'Temperature Sensor 4', model: 'T-TEM-01', serialNumber: '200310000104', location: 'Conference Room B', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '2 min ago', parameters: { temperature: 22.8 } },
	{ key: '14', name: 'Humidity Sensor C1', model: 'T-OCC-01', serialNumber: '200310000105', location: 'Storage Area South', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '4 min ago', parameters: { humidity: 58, temperature: 21.5 } },
	{ key: '15', name: 'Pressure Sensor A5', model: 'T-TK-01', serialNumber: '200310000106', location: 'Pump Room', status: 'offline', alarm_state: 'Active Alarm', err_state: 'Error', lastReport: '15 min ago', parameters: { level: 72, pressure: 1.8, temperature: 19.2 } },
	{ key: '16', name: 'Gateway G2', model: 'T8000', serialNumber: '200310000107', location: 'Building 2 Entrance', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: 'Just now', parameters: { voltage: 220, current: 2.8, power: 616, frequency: 50, uptime: 120, connectionCount: 8 } },
	{ key: '17', name: 'Dimmer Control 2', model: 'T-DIM-01', serialNumber: '200310000108', location: 'Hallway Main', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '1 min ago', parameters: { brightness: 60, power: 95, voltage: 220 } },
	{ key: '18', name: 'AC Panel Meeting Room B', model: 'T-ACP-01', serialNumber: '200310000109', location: 'Meeting Room B', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '5 min ago', parameters: { setTemp: 23, currentTemp: 22.9, fanSpeed: 2, mode: 'cool', power: 1100 } },
	{ key: '19', name: 'Flow Meter Main', model: 'T-FM-01', serialNumber: '200310000110', location: 'Water Supply Room', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '3 min ago', parameters: { level: 90, pressure: 2.5, temperature: 17.8 } },
	{ key: '20', name: 'Temperature Sensor 5', model: 'T-TEM-01', serialNumber: '200310000111', location: 'Data Center', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '1 min ago', parameters: { temperature: 19.5 } },
	{ key: '21', name: 'Energy Meter Building 2', model: 'T-EMS-02', serialNumber: '200310000112', location: 'Building 2 Main Panel', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '2 min ago', parameters: { voltageL1: 221, voltageL2: 220, voltageL3: 222, currentL1: 9.2, currentL2: 9.5, currentL3: 9.1, power: 6100, energy: 4500.2, frequency: 50, powerFactor: 0.96 } },
	{ key: '22', name: 'Occupancy Sensor C3', model: 'T-OCC-01', serialNumber: '200310000113', location: 'Cafeteria', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '6 min ago', parameters: { temperature: 24.5, humidity: 62 } },
	{ key: '23', name: 'Digital I/O Module 2', model: 'T-DIDO-01', serialNumber: '200310000114', location: 'Control Cabinet 2', status: 'offline', alarm_state: 'Active Alarm', err_state: 'Error', lastReport: '20 min ago', parameters: { input1: 0, input2: 1, input3: 0, input4: 1, output1: 0, output2: 1, output3: 1, output4: 0 } },
	{ key: '24', name: 'Humidity Sensor D4', model: 'T-OCC-01', serialNumber: '200310000115', location: 'Archive Room', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: '7 min ago', parameters: { humidity: 45, temperature: 20.2 } },
	{ key: '25', name: 'Gateway G3', model: 'T8000', serialNumber: '200310000116', location: 'Building 3 Lobby', status: 'online', alarm_state: 'Not alarm', err_state: 'No error', lastReport: 'Just now', parameters: { voltage: 220, current: 3.1, power: 682, frequency: 50, uptime: 96, connectionCount: 15 } },
];
