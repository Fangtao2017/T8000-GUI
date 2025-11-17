import React from 'react';
import { Card, Row, Col, Space, Typography, Tag, Badge, Statistic, Divider } from 'antd';
import { ThunderboltOutlined, RiseOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Analysis: React.FC = () => {
	// Energy meter mock data - T-EMS-01
	const energyMeter = {
		voltage: 240.5,
		current: 10.025,
		activePower: 2.40,
		energyTotal: 5.17,
		powerFactor: 1.000,
		frequency: 50.30,
		loadSwitch: 1, // 1: ON, 0: OFF
		importEnergy: 350.25,
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<Typography.Title level={4} style={{ marginBottom: 0 }}>
				Energy Analysis
			</Typography.Title>

			{/* Energy Meter Header */}
			<Card bordered bodyStyle={{ padding: '16px 24px' }}>
				<Space size="large">
					<Space>
						<ThunderboltOutlined style={{ fontSize: 24, color: '#faad14' }} />
						<div>
							<Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Device Model</Text>
							<Text strong style={{ fontSize: 16 }}>T-EMS-01</Text>
						</div>
					</Space>
					<Divider type="vertical" style={{ height: 40 }} />
					<div>
						<Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Single-phase Energy Meter</Text>
						<Space>
							<Tag color="blue">Electric Meter</Tag>
							<Badge status="success" text="Online" />
						</Space>
					</div>
					<Divider type="vertical" style={{ height: 40 }} />
					<div>
						<Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Load Status</Text>
						<Badge 
							status={energyMeter.loadSwitch ? 'processing' : 'default'} 
							text={energyMeter.loadSwitch ? 'ON - Active' : 'OFF - Disconnected'}
						/>
					</div>
				</Space>
			</Card>

			{/* Real-time Readings */}
			<Row gutter={16}>
				<Col span={6}>
					<Card bordered>
						<Statistic 
							title="Voltage"
							value={energyMeter.voltage} 
							suffix="V" 
							valueStyle={{ color: '#52c41a' }}
						/>
						<Text type="secondary" style={{ fontSize: 12 }}>Normal range: 220-250V</Text>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered>
						<Statistic 
							title="Current"
							value={energyMeter.current} 
							suffix="A" 
							valueStyle={{ color: '#1890ff' }}
						/>
						<Text type="secondary" style={{ fontSize: 12 }}>Real-time current draw</Text>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered>
						<Statistic 
							title="Active Power"
							value={energyMeter.activePower} 
							suffix="kW" 
							valueStyle={{ color: '#faad14' }}
						/>
						<Text type="secondary" style={{ fontSize: 12 }}>Instantaneous power</Text>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered>
						<Statistic 
							title="Frequency"
							value={energyMeter.frequency} 
							suffix="Hz" 
							valueStyle={{ color: '#722ed1' }}
						/>
						<Text type="secondary" style={{ fontSize: 12 }}>Grid frequency</Text>
					</Card>
				</Col>
			</Row>

			{/* Energy Consumption & Metrics */}
			<Row gutter={16}>
				<Col span={12}>
					<Card 
						title="Energy Consumption" 
						bordered
						extra={<Tag color="green" icon={<RiseOutlined />}>+2.3% vs yesterday</Tag>}
					>
						<Row gutter={16}>
							<Col span={12}>
								<Space direction="vertical" size={8} style={{ width: '100%' }}>
									<Text type="secondary">Total Energy (energy_total)</Text>
									<Statistic 
										value={energyMeter.energyTotal} 
										suffix="kWh" 
										valueStyle={{ fontSize: 28 }}
									/>
									<Text type="secondary" style={{ fontSize: 12 }}>Since last reset</Text>
								</Space>
							</Col>
							<Col span={12}>
								<Space direction="vertical" size={8} style={{ width: '100%' }}>
									<Text type="secondary">Import Energy (import_energy)</Text>
									<Statistic 
										value={energyMeter.importEnergy} 
										suffix="kWh" 
										valueStyle={{ fontSize: 28 }}
									/>
									<Text type="secondary" style={{ fontSize: 12 }}>Total imported</Text>
								</Space>
							</Col>
						</Row>
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Power Quality" bordered>
						<Row gutter={16}>
							<Col span={12}>
								<Space direction="vertical" size={8} style={{ width: '100%' }}>
									<Text type="secondary">Power Factor (pwr_factor)</Text>
									<Space align="baseline">
										<Statistic 
											value={energyMeter.powerFactor} 
											precision={3}
											valueStyle={{ fontSize: 28 }}
										/>
										<Tag color={energyMeter.powerFactor > 0.9 ? 'green' : 'orange'}>
											{energyMeter.powerFactor > 0.9 ? 'Excellent' : 'Needs Improvement'}
										</Tag>
									</Space>
									<Text type="secondary" style={{ fontSize: 12 }}>
										{energyMeter.powerFactor > 0.95 ? 'Optimal efficiency' : 'Consider power factor correction'}
									</Text>
								</Space>
							</Col>
							<Col span={12}>
								<Space direction="vertical" size={8} style={{ width: '100%' }}>
									<Text type="secondary">Load Switch Status</Text>
									<div style={{ marginTop: 8 }}>
										<Badge 
											status={energyMeter.loadSwitch ? 'processing' : 'default'} 
											text={energyMeter.loadSwitch ? 'Connected' : 'Disconnected'}
											style={{ fontSize: 16 }}
										/>
									</div>
									<Text type="secondary" style={{ fontSize: 12, marginTop: 16, display: 'block' }}>
										{energyMeter.loadSwitch ? 'Providing power to load' : 'Power disconnected'}
									</Text>
								</Space>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>

			{/* 24-Hour Power Trend */}
			<Card title="24-Hour Power Consumption Trend" bordered>
				<div>
					<Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
						Active Power (kW) over the last 24 hours
					</Text>
					<svg width="100%" height="200" style={{ marginTop: 12 }}>
						{(() => {
							const hours = 24;
							const height = 200;
							const width = 100;
							const powerData = Array.from({ length: hours }, (_, i) => {
								// Simulate daily power pattern (higher during day, lower at night)
								const hour = i;
								const baseLoad = hour >= 6 && hour <= 22 ? 2.5 : 0.8;
								return baseLoad + Math.sin(i / 2) * 0.5 + Math.random() * 0.3;
							});
							
							const maxPower = Math.max(...powerData);
							const minPower = Math.min(...powerData);
							const range = maxPower - minPower;
							
							// Points for line chart
							const points = powerData
								.map((val, i) => 
									`${(i / (hours - 1)) * width},${height - ((val - minPower) / range) * (height - 40)}`
								)
								.join(' ');
							
							// Fill area under curve
							const fillPoints = `0,${height} ${points} ${width},${height}`;
							
							// Grid lines
							const gridLines = [0.25, 0.5, 0.75].map(ratio => {
								const y = height - ratio * (height - 40);
								return (
									<line 
										key={ratio}
										x1="0" 
										y1={y} 
										x2={width} 
										y2={y} 
										stroke="#f0f0f0" 
										strokeWidth="1"
										vectorEffect="non-scaling-stroke"
									/>
								);
							});
							
							return (
								<>
									{gridLines}
									<polygon 
										points={fillPoints} 
										fill="rgba(250, 173, 20, 0.1)" 
										stroke="none"
									/>
									<polyline 
										points={points} 
										fill="none" 
										stroke="#faad14" 
										strokeWidth="3" 
										vectorEffect="non-scaling-stroke" 
									/>
									{/* Data points */}
									{powerData.map((val, i) => {
										if (i % 3 === 0) { // Show every 3rd point
											const x = (i / (hours - 1)) * width;
											const y = height - ((val - minPower) / range) * (height - 40);
											return (
												<circle
													key={i}
													cx={x}
													cy={y}
													r="3"
													fill="#faad14"
													vectorEffect="non-scaling-stroke"
												/>
											);
										}
										return null;
									})}
								</>
							);
						})()}
					</svg>
					
					{/* Chart legend and stats */}
					<Row gutter={16} style={{ marginTop: 16 }}>
						<Col span={8}>
							<Text type="secondary">Peak Power: <Text strong>2.85 kW</Text></Text>
						</Col>
						<Col span={8} style={{ textAlign: 'center' }}>
							<Text type="secondary">Average: <Text strong>2.15 kW</Text></Text>
						</Col>
						<Col span={8} style={{ textAlign: 'right' }}>
							<Text type="secondary">Off-Peak: <Text strong>0.92 kW</Text></Text>
						</Col>
					</Row>
				</div>
			</Card>

			{/* Insights and Recommendations */}
			<Row gutter={16}>
				<Col span={12}>
					<Card title="Energy Insights" bordered>
						<Space direction="vertical" size={12} style={{ width: '100%' }}>
							<div>
								<Badge status="success" />
								<Text strong style={{ marginLeft: 8 }}>Power quality is excellent</Text>
								<Text type="secondary" style={{ display: 'block', marginLeft: 28, fontSize: 12 }}>
									Power factor of {energyMeter.powerFactor.toFixed(3)} indicates efficient energy usage
								</Text>
							</div>
							<div>
								<Badge status="processing" />
								<Text strong style={{ marginLeft: 8 }}>Peak demand at 2.85 kW</Text>
								<Text type="secondary" style={{ display: 'block', marginLeft: 28, fontSize: 12 }}>
									Occurred during daytime hours (6:00 - 22:00)
								</Text>
							</div>
							<div>
								<Badge status="warning" />
								<Text strong style={{ marginLeft: 8 }}>Energy consumption increased 2.3%</Text>
								<Text type="secondary" style={{ display: 'block', marginLeft: 28, fontSize: 12 }}>
									Compared to previous 24-hour period
								</Text>
							</div>
						</Space>
					</Card>
				</Col>
				<Col span={12}>
					<Card title="System Parameters" bordered>
						<Space direction="vertical" size={8} style={{ width: '100%' }}>
							<Row>
								<Col span={12}><Text type="secondary">Voltage (voltage)</Text></Col>
								<Col span={12}><Text strong>{energyMeter.voltage} V</Text></Col>
							</Row>
							<Divider style={{ margin: '8px 0' }} />
							<Row>
								<Col span={12}><Text type="secondary">Current (current)</Text></Col>
								<Col span={12}><Text strong>{energyMeter.current} A</Text></Col>
							</Row>
							<Divider style={{ margin: '8px 0' }} />
							<Row>
								<Col span={12}><Text type="secondary">Active Power (active_pwr)</Text></Col>
								<Col span={12}><Text strong>{energyMeter.activePower} kW</Text></Col>
							</Row>
							<Divider style={{ margin: '8px 0' }} />
							<Row>
								<Col span={12}><Text type="secondary">Frequency (frequency)</Text></Col>
								<Col span={12}><Text strong>{energyMeter.frequency} Hz</Text></Col>
							</Row>
							<Divider style={{ margin: '8px 0' }} />
							<Row>
								<Col span={12}><Text type="secondary">Power Factor (pwr_factor)</Text></Col>
								<Col span={12}><Text strong>{energyMeter.powerFactor.toFixed(3)}</Text></Col>
							</Row>
							<Divider style={{ margin: '8px 0' }} />
							<Row>
								<Col span={12}><Text type="secondary">Total Energy (energy_total)</Text></Col>
								<Col span={12}><Text strong>{energyMeter.energyTotal} kWh</Text></Col>
							</Row>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Analysis;
