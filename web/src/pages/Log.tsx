import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, DatePicker, Tag, Badge, Segmented } from 'antd';
import { ExportOutlined, SearchOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// --- Interfaces ---
interface BaseLog {
	key: string;
	time: string;
}

interface LogScheduled extends BaseLog {
	deviceName: string;
	parameterName: string;
	value: string | number;
}

interface LogChange extends BaseLog {
	deviceName: string;
	parameterName: string;
	value: string | number;
}

interface LogAlarm extends BaseLog {
	deviceName: string;
	parameterName: string;
	value: string | number;
	alarmName: string;
	alarmStatus: 'normalized' | 'triggered';
}

interface LogError extends BaseLog {
	deviceName: string;
	parameterName: string;
	errorCode: string; // "Error Code 1-99"
}

interface LogHealth extends BaseLog {
	deviceName: string;
	networkStatus: 'online' | 'offline';
	lastReport: string;
	runtime: string;
	alarmState: string;
	errState: string;
}

interface LogRule extends BaseLog {
	ruleName: string;
	ruleStatus: 'normalized' | 'triggered';
}

type LogItem = LogScheduled | LogChange | LogAlarm | LogError | LogHealth | LogRule;

// --- Mock Data ---
const mockScheduled: LogScheduled[] = [
	{ key: 'sch-1', time: '2025-11-24 14:30:00', deviceName: 'T-TEM-01', parameterName: 'temperature', value: '24.5' },
	{ key: 'sch-2', time: '2025-11-24 14:30:00', deviceName: 'T-EMS-01', parameterName: 'energy_kwh', value: '1250.4' },
	{ key: 'sch-3', time: '2025-11-24 14:30:00', deviceName: 'T-FM-01', parameterName: 'flow_rate', value: '45.2' },
	{ key: 'sch-4', time: '2025-11-24 14:15:00', deviceName: 'T-TEM-02', parameterName: 'temperature', value: '22.1' },
	{ key: 'sch-5', time: '2025-11-24 14:15:00', deviceName: 'T-EMS-03', parameterName: 'active_power', value: '3500' },
	{ key: 'sch-6', time: '2025-11-24 14:15:00', deviceName: 'T-TK-01', parameterName: 'level', value: '78' },
	{ key: 'sch-7', time: '2025-11-24 14:00:00', deviceName: 'T-TEM-01', parameterName: 'temperature', value: '24.8' },
	{ key: 'sch-8', time: '2025-11-24 14:00:00', deviceName: 'T-EMS-01', parameterName: 'energy_kwh', value: '1249.8' },
	{ key: 'sch-9', time: '2025-11-24 14:00:00', deviceName: 'T-FM-01', parameterName: 'flow_rate', value: '44.8' },
	{ key: 'sch-10', time: '2025-11-24 13:45:00', deviceName: 'T-TEM-02', parameterName: 'temperature', value: '22.3' },
];

const mockChange: LogChange[] = [
	{ key: 'chg-1', time: '2025-11-24 13:22:15', deviceName: 'T-DIM-01', parameterName: 'brightness', value: '80%' },
	{ key: 'chg-2', time: '2025-11-24 12:45:30', deviceName: 'T-OCC-01', parameterName: 'occupancy', value: 'Occupied' },
	{ key: 'chg-3', time: '2025-11-24 11:10:05', deviceName: 'T-DIM-01', parameterName: 'brightness', value: '40%' },
	{ key: 'chg-4', time: '2025-11-24 10:05:00', deviceName: 'T-OCC-01', parameterName: 'occupancy', value: 'Vacant' },
	{ key: 'chg-5', time: '2025-11-24 09:30:22', deviceName: 'T-ACP-01', parameterName: 'setpoint', value: '23°C' },
	{ key: 'chg-6', time: '2025-11-24 08:15:10', deviceName: 'T-DIDO-01', parameterName: 'relay_1', value: 'ON' },
	{ key: 'chg-7', time: '2025-11-24 07:00:00', deviceName: 'T-ACP-01', parameterName: 'mode', value: 'Cool' },
	{ key: 'chg-8', time: '2025-11-23 22:30:45', deviceName: 'T-DIDO-01', parameterName: 'relay_1', value: 'OFF' },
];

const mockAlarm: LogAlarm[] = [
	{ key: 'alm-1', time: '2025-11-24 14:05:10', deviceName: 'T-FP-001', parameterName: 'smoke_level', value: 'High', alarmName: 'Fire Detected', alarmStatus: 'triggered' },
	{ key: 'alm-2', time: '2025-11-24 13:50:00', deviceName: 'T-PP-01', parameterName: 'motor_temp', value: '85°C', alarmName: 'Pump Overheat', alarmStatus: 'triggered' },
	{ key: 'alm-3', time: '2025-11-24 12:30:00', deviceName: 'T-TK-01', parameterName: 'level', value: '10%', alarmName: 'Low Tank Level', alarmStatus: 'normalized' },
	{ key: 'alm-4', time: '2025-11-24 10:15:00', deviceName: 'T-EMS-03', parameterName: 'voltage_phase_a', value: '250V', alarmName: 'Over Voltage', alarmStatus: 'normalized' },
	{ key: 'alm-5', time: '2025-11-23 23:45:00', deviceName: 'T-FP-001', parameterName: 'battery', value: '15%', alarmName: 'Low Battery', alarmStatus: 'triggered' },
	{ key: 'alm-6', time: '2025-11-23 18:20:00', deviceName: 'T-PP-01', parameterName: 'flow_status', value: 'No Flow', alarmName: 'Dry Run Protection', alarmStatus: 'normalized' },
];

const errorCodeMap: Record<string, string> = {
	'0': 'No error',
	'1': 'Modbus port not open error',
	'2': 'Modbus timeout',
	'3': 'Invalid modbus function code',
	'4': 'Invalid modbus write value',
	'5': 'Modbus data processing error',
	'6': 'Modbus table setting error',
	'7': 'Received data mismatch',
	'8': 'Received length error',
	'9': 'Checksum error',
	'10': 'Invalid header',
	'11': 'Write operation failed',
	'41': 'Invalid write value (value is null/out of range)',
	'42': 'Write request denied, parameter is read-only',
	'43': 'Device not found',
	'44': 'Parameter not found',
	'45': 'Database read/write error',
	'46': 'Incomplete information provided',
	'47': 'Invalid format',
	'60': 'System busy (firmware/cert update in progress)',
	'61': 'FW update error',
	'62': 'Insufficient disk space',
	'63': 'Invalid method',
	'64': 'Invalid firmware version',
	'70': 'MQTT setting error',
	'99': 'Other error',
};

const mockError: LogError[] = [
	{ key: 'err-1', time: '2025-11-24 10:15:22', deviceName: 'T-EMS-02', parameterName: 'modbus_read', errorCode: '2' },
	{ key: 'err-2', time: '2025-11-24 09:30:05', deviceName: 'T8000', parameterName: 'modbus_poll', errorCode: '5' },
	{ key: 'err-3', time: '2025-11-23 18:45:11', deviceName: 'T-AOM-01', parameterName: 'analog_write', errorCode: '42' },
	{ key: 'err-4', time: '2025-11-23 14:20:33', deviceName: 'T-AIS-001', parameterName: 'firmware_update', errorCode: '61' },
	{ key: 'err-5', time: '2025-11-22 11:10:00', deviceName: 'T8000', parameterName: 'mqtt_connect', errorCode: '70' },
	{ key: 'err-6', time: '2025-11-22 08:05:44', deviceName: 'T-ACP-01', parameterName: 'status_check', errorCode: '43' },
	{ key: 'err-7', time: '2025-11-21 16:55:12', deviceName: 'T-MIU-001', parameterName: 'ir_transmit', errorCode: '62' },
	{ key: 'err-8', time: '2025-11-21 09:12:30', deviceName: 'T-TEM-01', parameterName: 'system_init', errorCode: '1' },
];

const mockHealth: LogHealth[] = [
	{ key: 'hlt-1', time: '2025-11-24 14:30:00', deviceName: 'T8000', networkStatus: 'online', lastReport: '14:30:00', runtime: '120h', alarmState: 'Normal', errState: 'Normal' },
	{ key: 'hlt-2', time: '2025-11-24 14:25:00', deviceName: 'T-EMS-01', networkStatus: 'online', lastReport: '14:25:00', runtime: '450h', alarmState: 'Normal', errState: 'Normal' },
	{ key: 'hlt-3', time: '2025-11-24 14:20:00', deviceName: 'T-ACP-01', networkStatus: 'offline', lastReport: '10:00:00', runtime: '12h', alarmState: 'Normal', errState: 'Error' },
	{ key: 'hlt-4', time: '2025-11-24 14:15:00', deviceName: 'T-FP-001', networkStatus: 'online', lastReport: '14:15:00', runtime: '2400h', alarmState: 'Alarm', errState: 'Normal' },
	{ key: 'hlt-5', time: '2025-11-24 14:10:00', deviceName: 'T-AIR-001', networkStatus: 'online', lastReport: '14:10:00', runtime: '300h', alarmState: 'Normal', errState: 'Normal' },
];

const mockRule: LogRule[] = [
	{ key: 'rule-1', time: '2025-11-24 14:00:00', ruleName: 'High Temp -> AC On', ruleStatus: 'triggered' },
	{ key: 'rule-2', time: '2025-11-24 13:30:00', ruleName: 'Occupancy -> Lights On', ruleStatus: 'triggered' },
	{ key: 'rule-3', time: '2025-11-24 12:00:00', ruleName: 'Low Tank -> Pump On', ruleStatus: 'triggered' },
	{ key: 'rule-4', time: '2025-11-24 11:45:00', ruleName: 'Tank Full -> Pump Off', ruleStatus: 'normalized' },
	{ key: 'rule-5', time: '2025-11-24 09:00:00', ruleName: 'Office Hours -> AC Schedule', ruleStatus: 'triggered' },
];

type LogType = 'log_scheduled' | 'log_change' | 'log_alarm' | 'log_error' | 'log_health' | 'log_rule';

const Log: React.FC = () => {
	const [activeTab, setActiveTab] = useState<LogType>('log_scheduled');
	const [filterDeviceName, setFilterDeviceName] = useState('');
	const [filterParameterName, setFilterParameterName] = useState(''); // Also used for Rule Name
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

	// --- Columns Definition ---
	const getColumns = (type: LogType): ColumnsType<LogItem> => {
		const commonTimeCol = { title: 'Time', dataIndex: 'time', key: 'time', width: 180 };
		const commonDeviceCol = { title: 'Device Name', dataIndex: 'deviceName', key: 'deviceName', width: 180 };
		const commonParamCol = { title: 'Parameter Name', dataIndex: 'parameterName', key: 'parameterName', width: 180 };
		const commonValueCol = { title: 'Value', dataIndex: 'value', key: 'value', width: 120 };

		switch (type) {
			case 'log_scheduled':
				return [commonTimeCol, commonDeviceCol, commonParamCol, commonValueCol];
			
			case 'log_change':
				return [commonTimeCol, commonDeviceCol, commonParamCol, commonValueCol];
			
			case 'log_alarm':
				return [
					commonTimeCol, 
					commonDeviceCol, 
					commonParamCol, 
					commonValueCol,
					{ title: 'Alarm Name', dataIndex: 'alarmName', key: 'alarmName', width: 180 },
					{ 
						title: 'Status', 
						dataIndex: 'alarmStatus', 
						key: 'alarmStatus', 
						width: 120,
						render: (status: string) => (
							<Tag color={status === 'triggered' ? 'red' : 'green'}>
								{status.toUpperCase()}
							</Tag>
						)
					}
				];

			case 'log_error':
				return [
					commonTimeCol, 
					commonDeviceCol, 
					commonParamCol, 
					{ 
						title: 'Error Code', 
						dataIndex: 'errorCode', 
						key: 'errorCode',
						render: (code: string) => <Tag color="default">{code}</Tag>
					},
					{
						title: 'Description',
						key: 'description',
						render: (_, record) => {
							if ('errorCode' in record) {
								return errorCodeMap[record.errorCode] || 'Unknown Error';
							}
							return '-';
						}
					}
				];

			case 'log_health':
				return [
					commonTimeCol,
					commonDeviceCol,
					{ 
						title: 'Network', 
						dataIndex: 'networkStatus', 
						key: 'networkStatus',
						render: (status: string) => <Badge status={status === 'online' ? 'success' : 'error'} text={status} />
					},
					{ title: 'Last Report', dataIndex: 'lastReport', key: 'lastReport' },
					{ title: 'Runtime', dataIndex: 'runtime', key: 'runtime' },
					{ title: 'Alarm State', dataIndex: 'alarmState', key: 'alarmState' },
					{ title: 'Error State', dataIndex: 'errState', key: 'errState' },
				];

			case 'log_rule':
				return [
					commonTimeCol,
					{ title: 'Rule Name', dataIndex: 'ruleName', key: 'ruleName' },
					{ 
						title: 'Status', 
						dataIndex: 'ruleStatus', 
						key: 'ruleStatus',
						render: (status: string) => (
							<Tag color={status === 'triggered' ? 'red' : 'green'}>
								{status.toUpperCase()}
							</Tag>
						)
					}
				];
			default:
				return [];
		}
	};

	// --- Data Filtering ---
	const getData = () => {
		let data: LogItem[] = [];
		switch (activeTab) {
			case 'log_scheduled': data = mockScheduled; break;
			case 'log_change': data = mockChange; break;
			case 'log_alarm': data = mockAlarm; break;
			case 'log_error': data = mockError; break;
			case 'log_health': data = mockHealth; break;
			case 'log_rule': data = mockRule; break;
		}

		return data.filter(item => {
			// Date Range Filter (Mock implementation)
			// if (dateRange[0] && dateRange[1]) { ... }

			// Device Name Filter
			if (filterDeviceName && 'deviceName' in item) {
				if (!item.deviceName.toLowerCase().includes(filterDeviceName.toLowerCase())) return false;
			}

			// Parameter Name Filter (or Rule Name for log_rule)
			if (filterParameterName) {
				if (activeTab === 'log_rule' && 'ruleName' in item) {
					if (!item.ruleName.toLowerCase().includes(filterParameterName.toLowerCase())) return false;
				} else if ('parameterName' in item) {
					if (!item.parameterName.toLowerCase().includes(filterParameterName.toLowerCase())) return false;
				}
			}

			return true;
		});
	};

	const handleReset = () => {
		setFilterDeviceName('');
		setFilterParameterName('');
		setDateRange([null, null]);
	};

	const segmentedOptions = [
		{ label: 'Interval Data', value: 'log_scheduled' },
		{ label: 'Significant Changes', value: 'log_change' },
		{ label: 'Alarms', value: 'log_alarm' },
		{ label: 'System Errors', value: 'log_error' },
		{ label: 'Device Health', value: 'log_health' },
		{ label: 'Automation Rules', value: 'log_rule' },
	];

	const logDescriptions: Record<LogType, { message: string, description: string }> = {
		'log_scheduled': {
			message: 'Interval Data (Scheduled Report)',
			description: 'These logs contain device parameter values that are automatically reported at fixed time intervals (e.g., every 15 minutes). This is useful for tracking regular trends over time.'
		},
		'log_change': {
			message: 'Significant Changes (Change Report)',
			description: 'These logs are generated only when a parameter value changes by an amount greater than the configured sensitivity threshold. This helps capture sudden spikes or drops without filling the log with minor fluctuations.'
		},
		'log_alarm': {
			message: 'Alarm Events',
			description: 'Critical alerts triggered when a monitored parameter exceeds its high or low safety limits. These events usually require immediate attention.'
		},
		'log_error': {
			message: 'System Errors',
			description: 'Records of device malfunctions, sensor faults, or communication failures. Check these logs to diagnose hardware or network issues.'
		},
		'log_health': {
			message: 'Device Health Status',
			description: 'Periodic "heartbeat" messages sent by the device to indicate it is online and functioning correctly. Includes network status and runtime information.'
		},
		'log_rule': {
			message: 'Automation Rule Logs',
			description: 'History of local logic rules that have been triggered. Shows when automatic actions (like turning on a fan) were executed based on device conditions.'
		}
	};

	const filteredData = getData();

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
			{/* Combined Control Card */}
			<Card bordered bodyStyle={{ padding: '16px' }}>
				<div style={{ marginBottom: 16 }}>
					<Segmented 
						options={segmentedOptions}
						value={activeTab}
						onChange={(val) => {
							setActiveTab(val as LogType);
							handleReset();
						}}
						block
						size="large"
					/>
					<div style={{ marginTop: 12, color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
						<InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
						<span>
							<span style={{ fontWeight: 600, color: '#000' }}>{logDescriptions[activeTab].message}: </span>
							{logDescriptions[activeTab].description}
						</span>
					</div>
				</div>

				<Space size={16} wrap>
					{activeTab !== 'log_rule' && (
						<Input
							placeholder="Device Name"
							allowClear
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							style={{ width: 200 }}
							value={filterDeviceName}
							onChange={(e) => setFilterDeviceName(e.target.value)}
						/>
					)}
					
					{activeTab !== 'log_health' && (
						<Input
							placeholder={activeTab === 'log_rule' ? "Rule Name" : "Parameter Name"}
							allowClear
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							style={{ width: 200 }}
							value={filterParameterName}
							onChange={(e) => setFilterParameterName(e.target.value)}
						/>
					)}

					<RangePicker
						style={{ width: 260 }}
						value={dateRange}
						onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
					/>

					<Button icon={<ReloadOutlined />} onClick={handleReset}>Reset</Button>
					<Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#003A70' }}>Query</Button>
					<Button icon={<ExportOutlined />}>Export</Button>
				</Space>
			</Card>

			{/* Log Table */}
			<Card 
				bordered
				style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
				bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<div style={{ flex: 1, overflow: 'auto' }}>
					<Table
						columns={getColumns(activeTab)}
						dataSource={filteredData}
						pagination={false}
						size="middle"
						rowKey="key"
					/>
				</div>
			</Card>
		</div>
	);
};

export default Log;
