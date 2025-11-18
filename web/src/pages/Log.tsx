import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, DatePicker, Select } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface LogData {
	key: string;
	time: string;
	deviceName: string;
	parameterName: string;
	value: string | number;
	logType: string;
}

const Log: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [filterDeviceName, setFilterDeviceName] = useState('');
	const [filterParameterName, setFilterParameterName] = useState('');
	const [filterLogType, setFilterLogType] = useState<string>('all');
	const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

	// Mock log data
	const allLogs: LogData[] = [
		{ key: '1', time: 'Nov 07, 2024 15:45', deviceName: 'AR-EM-0005', parameterName: 'load_switch', value: 1, logType: 'log_scheduled' },
		{ key: '2', time: 'Nov 07, 2024 15:45', deviceName: 'AR-EM-0005', parameterName: 'voltage', value: 240.7, logType: 'log_scheduled' },
		{ key: '3', time: 'Nov 07, 2024 15:45', deviceName: 'AR-EM-0005', parameterName: 'energy_total', value: 2.34, logType: 'log_scheduled' },
		{ key: '4', time: 'Nov 07, 2024 15:45', deviceName: 'AR-EM-0005', parameterName: 'pwr_factor', value: 0.157, logType: 'log_scheduled' },
		{ key: '5', time: 'Nov 07, 2024 15:45', deviceName: 'AR-EM-0005', parameterName: 'frequency', value: 49.95, logType: 'log_scheduled' },
		{ key: '6', time: 'Nov 07, 2024 15:45', deviceName: 'AR-EM-0005', parameterName: 'kW', value: 0, logType: 'log_scheduled' },
		{ key: '7', time: 'Nov 07, 2024 15:44', deviceName: 'Gateway Main', parameterName: 'status', value: 'online', logType: 'log_change' },
		{ key: '8', time: 'Nov 07, 2024 15:44', deviceName: 'T-OXM-001', parameterName: 'occupancy', value: 1, logType: 'log_scheduled' },
		{ key: '9', time: 'Nov 07, 2024 15:43', deviceName: 'T-DIM-001', parameterName: 'brightness', value: 75, logType: 'log_scheduled' },
		{ key: '10', time: 'Nov 07, 2024 15:43', deviceName: 'T-PM-001', parameterName: 'temperature', value: 23.5, logType: 'log_health' },
		{ key: '11', time: 'Nov 07, 2024 15:42', deviceName: 'AR-EM-0005', parameterName: 'current', value: 1.2, logType: 'log_scheduled' },
		{ key: '12', time: 'Nov 07, 2024 15:42', deviceName: 'T-IR-001', parameterName: 'level', value: 85, logType: 'log_scheduled' },
		{ key: '13', time: 'Nov 07, 2024 15:41', deviceName: 'T-SP-001', parameterName: 'power', value: 1250, logType: 'log_scheduled' },
		{ key: '14', time: 'Nov 07, 2024 15:41', deviceName: 'Gateway Main', parameterName: 'memory_usage', value: 45.2, logType: 'log_change' },
		{ key: '15', time: 'Nov 07, 2024 15:40', deviceName: 'T-TEM-001', parameterName: 'temperature', value: 22.8, logType: 'log_scheduled' },
		{ key: '16', time: 'Nov 07, 2024 15:40', deviceName: 'Gateway Main', parameterName: 'connection', value: 'established', logType: 'log_change' },
		{ key: '17', time: 'Nov 07, 2024 15:39', deviceName: 'T-OXM-001', parameterName: 'battery_level', value: 85, logType: 'log_health' },
		{ key: '18', time: 'Nov 07, 2024 15:38', deviceName: 'T-SP-001', parameterName: 'alarm_triggered', value: 1, logType: 'log_alarm' },
		{ key: '19', time: 'Nov 07, 2024 15:37', deviceName: 'T-EMS-002', parameterName: 'voltage_l1', value: 220.5, logType: 'log_scheduled' },
		{ key: '20', time: 'Nov 07, 2024 15:36', deviceName: 'Gateway Main', parameterName: 'config_update', value: 'success', logType: 'log_error' },
	];

	// Filter logic
	const filteredLogs = allLogs.filter(log => {
		const matchDevice = filterDeviceName === '' || log.deviceName.toLowerCase().includes(filterDeviceName.toLowerCase());
		const matchParameter = filterParameterName === '' || log.parameterName.toLowerCase().includes(filterParameterName.toLowerCase());
		const matchLogType = filterLogType === 'all' || log.logType === filterLogType;
		
		// Date range filter (simplified - in real app would parse dates properly)
		const matchDate = true;
		// Add date filtering logic here if needed
		
		return matchDevice && matchParameter && matchLogType && matchDate;
	});

	// Reset to page 1 when filters change
	React.useEffect(() => {
		setCurrentPage(1);
	}, [filterDeviceName, filterParameterName, filterLogType, dateRange]);

	const columns: ColumnType<LogData>[] = [
		{
			title: 'Time',
			dataIndex: 'time',
			key: 'time',
			width: 180,
		},
		{
			title: 'Device Name',
			dataIndex: 'deviceName',
			key: 'deviceName',
			width: 200,
		},
		{
			title: 'Log Type',
			dataIndex: 'logType',
			key: 'logType',
			width: 150,
		},
		{
			title: 'Parameter Name',
			dataIndex: 'parameterName',
			key: 'parameterName',
			width: 200,
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'value',
			width: 150,
		},
	];

	const handleReset = () => {
		setFilterDeviceName('');
		setFilterParameterName('');
		setFilterLogType('all');
		setDateRange([null, null]);
		setCurrentPage(1);
	};

	const handleExport = () => {
		// Export functionality - to be implemented
		console.log('Exporting logs...');
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
			{/* Filter Bar */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Input
							placeholder="Device Name"
							allowClear
							style={{ width: 200 }}
							value={filterDeviceName}
							onChange={(e) => setFilterDeviceName(e.target.value)}
						/>
						<Input
							placeholder="Parameter Name"
							allowClear
							style={{ width: 200 }}
							value={filterParameterName}
							onChange={(e) => setFilterParameterName(e.target.value)}
						/>
					<Select
						value={filterLogType}
						onChange={setFilterLogType}
						style={{ width: 200 }}
						options={[
							{ value: 'all', label: 'All Types' },
							{ value: 'log_scheduled', label: 'log_scheduled' },
							{ value: 'log_change', label: 'log_change' },
							{ value: 'log_alarm', label: 'log_alarm' },
							{ value: 'log_error', label: 'log_error' },
							{ value: 'log_health', label: 'log_health' },
							{ value: 'log_rule', label: 'log_rule' },
						]}
					/>
						<RangePicker
							style={{ width: 280 }}
							value={dateRange}
							onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
						/>
				</Space>
				<Space size={8}>
					<Button onClick={handleReset}>Reset</Button>
					<Button type="primary" onClick={() => {/* Query logic */}} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>Query</Button>
					<Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
				</Space>
				</Space>
			</Card>

			{/* Log Table */}
			<Card 
				bordered
				style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
				bodyStyle={{ padding: '0 0 16px 0', flex: 1, display: 'flex', flexDirection: 'column' }}
			>
				<Table
					columns={columns}
					dataSource={filteredLogs}
					pagination={{
						current: currentPage,
						pageSize: 15,
						total: filteredLogs.length,
						onChange: (page) => setCurrentPage(page),
						showSizeChanger: true,
						showQuickJumper: true,
						pageSizeOptions: ['10', '15', '20', '50'],
						showTotal: (total) => `Total ${total} items`,
						position: ['bottomCenter'],
						style: { marginBottom: 0 }
					}}
					size="small"
				/>
			</Card>
		</div>
	);
};

export default Log;
