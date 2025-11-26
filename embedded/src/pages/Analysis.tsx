import React, { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col, Space, Typography, Select, Empty, Statistic, theme, DatePicker, Alert } from 'antd';
import { Line } from '@ant-design/plots';
import { 
	DashboardOutlined, 
	LineChartOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { allDevices, parameterUnits } from '../data/devicesData';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Analysis: React.FC = () => {
	const { token } = theme.useToken();
	
	// State
	const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(allDevices[0]?.key);
	const [selectedParameter, setSelectedParameter] = useState<string | undefined>(
		allDevices[0]?.parameters ? Object.keys(allDevices[0].parameters)[0] : undefined
	);
	const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
		dayjs().subtract(24, 'hour'),
		dayjs()
	]);

	// Get selected device object
	const selectedDevice = useMemo(() => 
		allDevices.find(d => d.key === selectedDeviceId), 
	[selectedDeviceId]);

	// Update available parameters when device changes
	useEffect(() => {
		if (selectedDevice?.parameters) {
			const params = Object.keys(selectedDevice.parameters);
			if (params.length > 0 && (!selectedParameter || !params.includes(selectedParameter))) {
				setSelectedParameter(params[0]);
			}
		} else {
			setSelectedParameter(undefined);
		}
	}, [selectedDevice, selectedParameter]);

	// Generate mock chart data
	const chartData = useMemo(() => {
		if (!selectedDevice || !selectedParameter || !selectedDevice.parameters) return [];

		const currentValue = Number(selectedDevice.parameters[selectedParameter]) || 0;
		const data = [];
		const start = dateRange[0];
		const end = dateRange[1];
		const diffMinutes = end.diff(start, 'minute');
		
		// Determine interval based on range duration to keep point count reasonable
		let interval = 1; // minutes
		if (diffMinutes <= 60) interval = 1; // 1 hour -> 1 min interval (60 points)
		else if (diffMinutes <= 360) interval = 5; // 6 hours -> 5 min interval (72 points)
		else if (diffMinutes <= 1440) interval = 30; // 24 hours -> 30 min interval (48 points)
		else if (diffMinutes <= 10080) interval = 180; // 7 days -> 3 hours (56 points)
		else interval = Math.ceil(diffMinutes / 100); // > 7 days -> approx 100 points

		let currentTime = start;
		while (currentTime.isBefore(end) || currentTime.isSame(end)) {
			// Simulate data pattern
			const minutesFromStart = currentTime.diff(start, 'minute');
			
			// Generate some random variation around the current value
			const randomFactor = (Math.random() - 0.5) * (currentValue * 0.2); 
			// Add some trend
			const trend = Math.sin(minutesFromStart / (diffMinutes / 10 || 1)) * (currentValue * 0.1);
			
			let value = currentValue + randomFactor + trend;
			if (value < 0) value = 0; // Assume no negative values for most physical params

			data.push({
				time: currentTime.format(diffMinutes <= 1440 ? 'HH:mm' : 'MM-DD HH:mm'),
				value: Number(value.toFixed(2)),
				category: selectedParameter
			});

			currentTime = currentTime.add(interval, 'minute');
		}
		return data;
	}, [selectedDevice, selectedParameter, dateRange]);

	// Calculate statistics
	const stats = useMemo(() => {
		if (chartData.length === 0) return { min: 0, max: 0, avg: 0, current: 0 };
		const values = chartData.map(d => d.value);
		const sum = values.reduce((a, b) => a + b, 0);
		return {
			min: Math.min(...values),
			max: Math.max(...values),
			avg: sum / values.length,
			current: values[values.length - 1]
		};
	}, [chartData]);

	// Chart config
	const config = {
		data: chartData,
		xField: 'time',
		yField: 'value',
		seriesField: 'category',
		smooth: true,
		animation: {
			appear: {
				animation: 'path-in',
				duration: 1000,
			},
		},
		color: '#8CC63F',
		point: {
			size: 2,
			shape: 'circle',
		},
		yAxis: {
			label: {
				formatter: (v: string) => `${v} ${selectedParameter ? (parameterUnits[selectedParameter] || '') : ''}`,
			},
		},
		tooltip: {
			formatter: (datum: { category: string; value: number }) => {
				return { name: datum.category, value: `${datum.value} ${selectedParameter ? (parameterUnits[selectedParameter] || '') : ''}` };
			},
		},
	};

	return (
		<div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
			<div style={{ width: '100%', maxWidth: 1600, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
			<Alert
				message="Under Development"
				description="This page is currently under development. Features may be incomplete or subject to change."
				type="warning"
				showIcon
				style={{ marginBottom: 16 }}
			/>
			{/* Header / Controls Area */}
			<Card bordered={false} bodyStyle={{ padding: '16px 24px' }}>
				<Row gutter={[24, 16]} align="middle">
					<Col xs={24} md={6}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Text type="secondary" style={{ fontSize: 12 }}>Select Device</Text>
							<Select
								showSearch
								style={{ width: '100%' }}
								placeholder="Select a device"
								optionFilterProp="children"
								value={selectedDeviceId}
								onChange={setSelectedDeviceId}
								filterOption={(input, option) =>
									(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
								}
								options={allDevices.map(d => ({ value: d.key, label: d.name }))}
							/>
						</Space>
					</Col>
					<Col xs={24} md={6}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Text type="secondary" style={{ fontSize: 12 }}>Select Parameter</Text>
							<Select
								style={{ width: '100%' }}
								placeholder="Select parameter"
								value={selectedParameter}
								onChange={setSelectedParameter}
								disabled={!selectedDevice}
							>
								{selectedDevice?.parameters && Object.keys(selectedDevice.parameters).map(key => (
									<Option key={key} value={key}>
										{key.replace(/([A-Z])/g, ' $1').trim()} {parameterUnits[key] ? `(${parameterUnits[key]})` : ''}
									</Option>
								))}
							</Select>
						</Space>
					</Col>
					<Col xs={24} md={8}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Text type="secondary" style={{ fontSize: 12 }}>Time Range</Text>
							<RangePicker 
								showTime 
								value={dateRange}
								onChange={(dates) => {
									if (dates && dates[0] && dates[1]) {
										setDateRange([dates[0], dates[1]]);
									}
								}}
								style={{ width: '100%' }}
							/>
						</Space>
					</Col>
				</Row>
			</Card>

			{/* Main Content */}
			{selectedDevice && selectedParameter ? (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
					{/* Statistics Cards */}
					<Row gutter={16}>
						<Col span={6}>
							<Card bordered={false} bodyStyle={{ padding: 16 }}>
								<Statistic
									title="Current Value"
									value={stats.current}
									precision={2}
									valueStyle={{ color: token.colorTextHeading }}
									prefix={<DashboardOutlined />}
									suffix={parameterUnits[selectedParameter] || ''}
								/>
							</Card>
						</Col>
						<Col span={6}>
							<Card bordered={false} bodyStyle={{ padding: 16 }}>
								<Statistic
									title="Average"
									value={stats.avg}
									precision={2}
									valueStyle={{ color: '#1890ff' }}
									prefix={<LineChartOutlined />}
									suffix={parameterUnits[selectedParameter] || ''}
								/>
							</Card>
						</Col>
						<Col span={6}>
							<Card bordered={false} bodyStyle={{ padding: 16 }}>
								<Statistic
									title="Maximum"
									value={stats.max}
									precision={2}
									valueStyle={{ color: '#cf1322' }}
									prefix={<ArrowUpOutlined />}
									suffix={parameterUnits[selectedParameter] || ''}
								/>
							</Card>
						</Col>
						<Col span={6}>
							<Card bordered={false} bodyStyle={{ padding: 16 }}>
								<Statistic
									title="Minimum"
									value={stats.min}
									precision={2}
									valueStyle={{ color: '#3f8600' }}
									prefix={<ArrowDownOutlined />}
									suffix={parameterUnits[selectedParameter] || ''}
								/>
							</Card>
						</Col>
					</Row>

					{/* Chart Card */}
					<Card 
						title={
							<Space>
								<LineChartOutlined />
								<span>{selectedParameter.replace(/([A-Z])/g, ' $1').trim()} Trend</span>
								<Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>
									({selectedDevice.name})
								</Text>
							</Space>
						}
						bordered={false}
						style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
						bodyStyle={{ flex: 1, minHeight: 300, padding: '24px' }}
					>
						<Line {...config} />
					</Card>
				</div>
			) : (
				<Card bordered={false} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Empty description="Please select a device and parameter to view analysis" />
				</Card>
			)}
			</div>
		</div>
	);
};

export default Analysis;
