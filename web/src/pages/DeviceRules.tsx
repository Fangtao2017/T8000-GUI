import React, { useState } from 'react';
import { Card, Table, Button, Space, Badge, Row, Col, Typography, Progress, Input, Select, Switch } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';

interface RuleData {
	key: string;
	ruleName: string;
	deviceType: string;
	targetDevice: string;
	triggerSetting: string;
	createTime: string;
	status: 'enabled' | 'disabled';
	enabled: boolean;
}

const DeviceRules: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string>('all');

	// Mock data based on the screenshot
	const allRules: RuleData[] = [
		{ key: '1', ruleName: 'Occupancy Absence Detection and Auto Light Control', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:13', status: 'enabled', enabled: true },
		{ key: '2', ruleName: 'Brightness Level 1', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:12', status: 'enabled', enabled: true },
		{ key: '3', ruleName: 'Brightness Level 9 With Extended Configuration Parameters', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:12', status: 'enabled', enabled: true },
		{ key: '4', ruleName: 'Brightness Level 8', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:11', status: 'enabled', enabled: true },
		{ key: '5', ruleName: 'Brightness Level 7 Advanced Settings for Multiple Zones', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:11', status: 'enabled', enabled: true },
		{ key: '6', ruleName: 'Brightness 6', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:10', status: 'enabled', enabled: true },
		{ key: '7', ruleName: 'Brightness Level 5 Configuration', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:09', status: 'enabled', enabled: true },
		{ key: '8', ruleName: 'Level 4', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0005', triggerSetting: 'Inactive', createTime: 'Nov 05 2024 18:08', status: 'enabled', enabled: true },
		{ key: '9', ruleName: 'Temperature Alert High Threshold Warning System for Critical Areas', deviceType: 'Temperature Sensor', targetDevice: 'AR-TM-0012', triggerSetting: 'Active', createTime: 'Nov 04 2024 10:30', status: 'disabled', enabled: false },
		{ key: '10', ruleName: 'Energy Limit', deviceType: '3P Energy Meter', targetDevice: 'AR-EM-0020', triggerSetting: 'Active', createTime: 'Nov 03 2024 14:22', status: 'enabled', enabled: true },
		{ key: '11', ruleName: 'Tank Level Low Warning with Automatic Notification and Escalation', deviceType: 'Tank Sensor', targetDevice: 'AR-TK-0008', triggerSetting: 'Active', createTime: 'Nov 02 2024 09:15', status: 'enabled', enabled: true },
		{ key: '12', ruleName: 'Dimmer Auto Adjustment Based on Time of Day and Ambient Light Conditions', deviceType: 'Dimmer Control', targetDevice: 'AR-DM-0003', triggerSetting: 'Inactive', createTime: 'Nov 01 2024 16:45', status: 'enabled', enabled: true },
		{ key: '13', ruleName: 'Motion Detection for Security Zone A', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0008', triggerSetting: 'Active', createTime: 'Oct 31 2024 14:20', status: 'enabled', enabled: true },
		{ key: '14', ruleName: 'HVAC Temperature Control', deviceType: 'Temperature Sensor', targetDevice: 'AR-TM-0015', triggerSetting: 'Inactive', createTime: 'Oct 30 2024 11:30', status: 'enabled', enabled: true },
		{ key: '15', ruleName: 'Power Consumption Alert for Main Building', deviceType: '3P Energy Meter', targetDevice: 'AR-EM-0022', triggerSetting: 'Active', createTime: 'Oct 29 2024 09:45', status: 'enabled', enabled: true },
		{ key: '16', ruleName: 'Water Level Monitoring System with Multi-Level Alerts', deviceType: 'Tank Sensor', targetDevice: 'AR-TK-0010', triggerSetting: 'Active', createTime: 'Oct 28 2024 16:00', status: 'enabled', enabled: true },
		{ key: '17', ruleName: 'Smart Lighting Schedule for Office Hours', deviceType: 'Dimmer Control', targetDevice: 'AR-DM-0005', triggerSetting: 'Inactive', createTime: 'Oct 27 2024 10:15', status: 'disabled', enabled: false },
		{ key: '18', ruleName: 'Emergency Exit Light Control', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0012', triggerSetting: 'Active', createTime: 'Oct 26 2024 13:40', status: 'enabled', enabled: true },
		{ key: '19', ruleName: 'Conference Room Temperature Optimization', deviceType: 'Temperature Sensor', targetDevice: 'AR-TM-0018', triggerSetting: 'Inactive', createTime: 'Oct 25 2024 15:20', status: 'enabled', enabled: true },
		{ key: '20', ruleName: 'Backup Generator Power Monitor', deviceType: '3P Energy Meter', targetDevice: 'AR-EM-0025', triggerSetting: 'Active', createTime: 'Oct 24 2024 08:30', status: 'enabled', enabled: true },
		{ key: '21', ruleName: 'Cooling Tower Water Level Critical Alert System', deviceType: 'Tank Sensor', targetDevice: 'AR-TK-0015', triggerSetting: 'Active', createTime: 'Oct 23 2024 12:00', status: 'enabled', enabled: true },
		{ key: '22', ruleName: 'Parking Lot Lighting Automation', deviceType: 'Dimmer Control', targetDevice: 'AR-DM-0008', triggerSetting: 'Inactive', createTime: 'Oct 22 2024 17:30', status: 'enabled', enabled: true },
		{ key: '23', ruleName: 'After Hours Security Monitoring', deviceType: 'Occupancy + Lux Sensor', targetDevice: 'AR-OL-0015', triggerSetting: 'Active', createTime: 'Oct 21 2024 19:00', status: 'enabled', enabled: true },
		{ key: '24', ruleName: 'Server Room Temperature Critical Warning', deviceType: 'Temperature Sensor', targetDevice: 'AR-TM-0020', triggerSetting: 'Active', createTime: 'Oct 20 2024 10:45', status: 'enabled', enabled: true },
		{ key: '25', ruleName: 'Main Electrical Panel Load Balancing and Monitoring System', deviceType: '3P Energy Meter', targetDevice: 'AR-EM-0030', triggerSetting: 'Active', createTime: 'Oct 19 2024 14:15', status: 'enabled', enabled: true },
	];

	// Filter logic
	const filteredRules = allRules.filter(rule => {
		const matchSearch = searchText === '' || 
			rule.ruleName.toLowerCase().includes(searchText.toLowerCase()) ||
			rule.targetDevice.toLowerCase().includes(searchText.toLowerCase()) ||
			rule.deviceType.toLowerCase().includes(searchText.toLowerCase()) ||
			rule.triggerSetting.toLowerCase().includes(searchText.toLowerCase()) ||
			rule.createTime.toLowerCase().includes(searchText.toLowerCase()) ||
			rule.status.toLowerCase().includes(searchText.toLowerCase());
		
		const matchStatus = filterStatus === 'all' || rule.status === filterStatus;

		return matchSearch && matchStatus;
	});

	// Statistics based on filtered data
	const totalRules = filteredRules.length;
	const enabledRules = filteredRules.filter(r => r.status === 'enabled').length;
	const disabledRules = filteredRules.filter(r => r.status === 'disabled').length;
	const activeTriggers = filteredRules.filter(r => r.triggerSetting === 'Active').length;

	const handleToggleStatus = (key: string) => {
		console.log('Toggle status for rule:', key);
		// Implement toggle logic here
	};

	const columns: ColumnType<RuleData>[] = [
		{
			title: 'Rule Name',
			dataIndex: 'ruleName',
			key: 'ruleName',
			width: 400,
			ellipsis: true,
			render: (text: string) => <strong style={{ color: '#1890ff' }}>{text}</strong>,
		},
		{
			title: 'Trigger Setting',
			dataIndex: 'triggerSetting',
			key: 'triggerSetting',
			width: 120,
			render: (setting: string) => (
				<Badge 
					status={setting === 'Active' ? 'error' : 'default'}
					text={setting}
				/>
			),
		},
		{
			title: 'Create Time',
			dataIndex: 'createTime',
			key: 'createTime',
			width: 160,
			sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
		},
		{
			title: 'Status',
			dataIndex: 'enabled',
			key: 'enabled',
			width: 120,
			render: (enabled: boolean, record) => (
				<Space>
					<Switch 
						checked={enabled} 
						size="small"
						onChange={() => handleToggleStatus(record.key)}
					/>
					<span style={{ color: enabled ? '#52c41a' : '#999' }}>
						{enabled ? 'Enabled' : 'Disabled'}
					</span>
				</Space>
			),
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 180,
			render: () => (
				<Space size="small">
					<Button type="link" size="small" icon={<EyeOutlined />}>View</Button>
					<Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
					<Button type="link" size="small" danger icon={<DeleteOutlined />}>Delete</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflow: 'hidden' }}>
			{/* Statistics Cards */}
			<Row gutter={16}>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Total Rules</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0 }}>{totalRules}</Typography.Title>
							<Progress percent={100} showInfo={false} strokeColor="#1890ff" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Enabled Rules</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#52c41a' }}>{enabledRules}</Typography.Title>
							<Progress percent={(enabledRules / totalRules) * 100} showInfo={false} strokeColor="#52c41a" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Disabled Rules</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>{disabledRules}</Typography.Title>
							<Progress percent={(disabledRules / totalRules) * 100} showInfo={false} strokeColor="#ff4d4f" />
						</Space>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered bodyStyle={{ padding: '16px' }}>
						<Space direction="vertical" size={4} style={{ width: '100%' }}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Active Triggers</Typography.Text>
							<Typography.Title level={2} style={{ margin: 0, color: '#faad14' }}>{activeTriggers}</Typography.Title>
							<Progress percent={(activeTriggers / totalRules) * 100} showInfo={false} strokeColor="#faad14" />
						</Space>
					</Card>
				</Col>
			</Row>

			{/* Search and Filter Bar */}
			<Card bordered bodyStyle={{ padding: '12px 16px' }}>
				<Space size={12} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
					<Space size={12}>
						<Input
							placeholder="Search rules..."
							allowClear
							style={{ width: 300 }}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						<Select
							placeholder="Please Select"
							style={{ width: 150 }}
							value={filterStatus}
							onChange={setFilterStatus}
						>
							<Select.Option value="all">All Status</Select.Option>
							<Select.Option value="enabled">Enabled</Select.Option>
							<Select.Option value="disabled">Disabled</Select.Option>
						</Select>
						<Button type="default" onClick={() => {
							setSearchText('');
							setFilterStatus('all');
						}}>Reset</Button>
						<Button type="primary">Query</Button>
					</Space>
				</Space>
			</Card>

			{/* Rules Table */}
			<Card 
				title={`Rule List (${totalRules})`} 
				bordered
				style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
				bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
			>
				<Table
					columns={columns}
					dataSource={filteredRules}
					pagination={false}
					scroll={{ y: 'calc(100vh - 400px)', x: 'max-content' }}
					size="small"
				/>
			</Card>
		</div>
	);
};

export default DeviceRules;
