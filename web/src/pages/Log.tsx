import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, DatePicker, Tabs, Tag, Badge, Pagination } from 'antd';
import { ExportOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
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
const mockScheduled: LogScheduled[] = Array.from({ length: 20 }).map((_, i) => ({
	key: `sch-${i}`,
	time: dayjs().subtract(i * 10, 'minute').format('YYYY-MM-DD HH:mm:ss'),
	deviceName: i % 2 === 0 ? 'AR-EM-0005' : 'T-OXM-001',
	parameterName: i % 3 === 0 ? 'voltage' : 'temperature',
	value: (Math.random() * 100).toFixed(2),
}));

const mockChange: LogChange[] = Array.from({ length: 10 }).map((_, i) => ({
	key: `chg-${i}`,
	time: dayjs().subtract(i * 2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
	deviceName: 'Gateway Main',
	parameterName: 'config_interval',
	value: i % 2 === 0 ? '300s' : '600s',
}));

const mockAlarm: LogAlarm[] = Array.from({ length: 15 }).map((_, i) => ({
	key: `alm-${i}`,
	time: dayjs().subtract(i * 5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
	deviceName: 'T-SP-001',
	parameterName: 'current',
	value: (10 + Math.random() * 5).toFixed(2),
	alarmName: 'Over Current',
	alarmStatus: i % 2 === 0 ? 'triggered' : 'normalized',
}));

const mockError: LogError[] = Array.from({ length: 8 }).map((_, i) => ({
	key: `err-${i}`,
	time: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss'),
	deviceName: 'T-EMS-002',
	parameterName: 'sensor_read',
	errorCode: `E-${Math.floor(Math.random() * 99) + 1}`,
}));

const mockHealth: LogHealth[] = Array.from({ length: 12 }).map((_, i) => ({
	key: `hlt-${i}`,
	time: dayjs().subtract(i * 30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
	deviceName: i % 3 === 0 ? 'Gateway Main' : 'AR-EM-0005',
	networkStatus: Math.random() > 0.1 ? 'online' : 'offline',
	lastReport: dayjs().subtract(Math.random() * 10, 'minute').format('HH:mm:ss'),
	runtime: `${Math.floor(Math.random() * 1000)}h`,
	alarmState: Math.random() > 0.8 ? 'Alarm' : 'Normal',
	errState: Math.random() > 0.9 ? 'Error' : 'Normal',
}));

const mockRule: LogRule[] = Array.from({ length: 10 }).map((_, i) => ({
	key: `rule-${i}`,
	time: dayjs().subtract(i * 4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
	ruleName: i % 2 === 0 ? 'High Temp Warning' : 'Low Battery Alert',
	ruleStatus: i % 2 === 0 ? 'triggered' : 'normalized',
}));

type LogType = 'log_scheduled' | 'log_change' | 'log_alarm' | 'log_error' | 'log_health' | 'log_rule';

const Log: React.FC = () => {
	const [activeTab, setActiveTab] = useState<LogType>('log_scheduled');
	const [filterDeviceName, setFilterDeviceName] = useState('');
	const [filterParameterName, setFilterParameterName] = useState(''); // Also used for Rule Name
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(15);

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
						render: (code: string) => <Tag color="volcano">{code}</Tag>
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
		setCurrentPage(1);
	};

	const items = [
		{ key: 'log_scheduled', label: 'Scheduled' },
		{ key: 'log_change', label: 'Change' },
		{ key: 'log_alarm', label: 'Alarm' },
		{ key: 'log_error', label: 'Error' },
		{ key: 'log_health', label: 'Health' },
		{ key: 'log_rule', label: 'Rule' },
	];

	const filteredData = getData();
	const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
			<Card bordered={false} bodyStyle={{ padding: '0 16px' }}>
				<Tabs 
					activeKey={activeTab} 
					onChange={(key) => {
						setActiveTab(key as LogType);
						handleReset(); // Optional: reset filters when switching tabs
					}}
					items={items}
					size="large"
					tabBarStyle={{ marginBottom: 0 }}
				/>
			</Card>

			{/* Filter Bar */}
			<Card bordered bodyStyle={{ padding: '16px' }}>
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
				<div style={{ flex: 1, overflow: 'hidden', padding: '0 16px' }}>
					<Table
						columns={getColumns(activeTab)}
						dataSource={paginatedData}
						pagination={false}
						scroll={{ y: 'calc(100vh - 420px)' }}
						size="middle"
						rowKey="key"
					/>
				</div>
				<div style={{ padding: '12px 16px', borderTop: '1px solid #f0f0f0', textAlign: 'right', backgroundColor: '#fff' }}>
					<Pagination
						current={currentPage}
						pageSize={pageSize}
						total={filteredData.length}
						onChange={(page, size) => {
							setCurrentPage(page);
							setPageSize(size);
						}}
						showSizeChanger
						showTotal={(total) => `Total ${total} items`}
					/>
				</div>
			</Card>
		</div>
	);
};

export default Log;
