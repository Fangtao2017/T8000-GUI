import React from 'react';
import { Modal, Card, Row, Col, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface RuleViewDataProps {
	visible: boolean;
	ruleData: {
		key: string;
		ruleName: string;
		deviceType: string;
		targetDevice: string;
		triggerSetting: string;
		createTime: string;
		status: 'enabled' | 'disabled';
		enabled: boolean;
		// Additional fields for view data
		conditions?: Array<{
			name: string;
			type: string;
			device: string;
			parameter: string;
			operator: string;
			value: number;
		}>;
		controls?: Array<{
			name: string;
			type: string;
			device: string;
			parameter: string;
			value: number | string;
		}>;
	} | null;
	onClose: () => void;
}

const RuleViewData: React.FC<RuleViewDataProps> = ({ visible, ruleData, onClose }) => {
	if (!ruleData) return null;

	return (
		<Modal
			title={
				<Typography.Title level={4} style={{ margin: 0 }}>
					Rule Data View: {ruleData.ruleName}
				</Typography.Title>
			}
			open={visible}
			onCancel={onClose}
			width="95%"
			style={{ top: 20 }}
			zIndex={1050}
			bodyStyle={{ padding: '24px' }}
			footer={null}
			closeIcon={<CloseOutlined />}
		>
			{/* Basic Information Card */}
			<Card
				title="Basic Information"
				bordered
				style={{ marginBottom: 16 }}
				bodyStyle={{ padding: '16px' }}
			>
				<Row gutter={[24, 16]}>
					{/* First Row - 5 fields */}
					<Col span={5}>
						<Space direction="vertical" size={4}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Rule Name</Typography.Text>
							<Typography.Text strong>{ruleData.ruleName}</Typography.Text>
						</Space>
					</Col>
					<Col span={5}>
						<Space direction="vertical" size={4}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Target Device</Typography.Text>
							<Typography.Text strong>{ruleData.targetDevice}</Typography.Text>
						</Space>
					</Col>
					<Col span={5}>
						<Space direction="vertical" size={4}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Create Time</Typography.Text>
							<Typography.Text strong>{ruleData.createTime}</Typography.Text>
						</Space>
					</Col>
					<Col span={5}>
						<Space direction="vertical" size={4}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Current Status</Typography.Text>
							<Typography.Text strong style={{ color: ruleData.enabled ? '#52c41a' : '#999' }}>
								{ruleData.enabled ? 'Enabled' : 'Disabled'}
							</Typography.Text>
						</Space>
					</Col>
					<Col span={4}>
						<Space direction="vertical" size={4}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Trigger Setting</Typography.Text>
							<Typography.Text strong style={{ color: ruleData.triggerSetting === 'Active' ? '#ff4d4f' : '#999' }}>
								{ruleData.triggerSetting}
							</Typography.Text>
						</Space>
					</Col>

					{/* Second Row - Device Type only */}
					<Col span={24}>
						<Space direction="vertical" size={4}>
							<Typography.Text type="secondary" style={{ fontSize: 12 }}>Device Type</Typography.Text>
							<Typography.Text strong>{ruleData.deviceType}</Typography.Text>
						</Space>
					</Col>
				</Row>
			</Card>

			{/* Main Content - Conditions and Controls Side by Side */}
			<Row gutter={16}>
				{/* Left: Trigger Conditions */}
				<Col span={12}>
					<Card 
						title="Trigger Conditions" 
						bordered
						style={{ height: '500px' }}
						bodyStyle={{ 
							padding: '16px',
							height: 'calc(100% - 57px)',
							overflow: 'auto'
						}}
					>
						{ruleData.conditions && ruleData.conditions.length > 0 ? (
							<Space direction="vertical" size={12} style={{ width: '100%' }}>
								{ruleData.conditions.map((condition, index) => (
									<Card
										key={index}
										size="small"
										style={{ 
											backgroundColor: '#FFFFFF',
											border: '1px solid #d9d9d9'
										}}
										bodyStyle={{ padding: '12px' }}
									>
										<Space direction="vertical" size={4} style={{ width: '100%' }}>
										<Typography.Text style={{ color: '#003A70', fontSize: 11, textTransform: 'uppercase', fontWeight: 'bold' }}>
											Condition {index + 1}: {condition.name}
										</Typography.Text>
											<Typography.Text style={{ color: '#000', fontSize: 13 }}>
												<strong>Type:</strong> {condition.type}
											</Typography.Text>
											<Typography.Text style={{ color: '#000', fontSize: 13 }}>
												<strong>Device:</strong> {condition.device}
											</Typography.Text>
											<Typography.Text style={{ color: '#000', fontSize: 13 }}>
												<strong>Parameter:</strong> {condition.parameter}
											</Typography.Text>
											<Typography.Text style={{ color: '#003A70', fontSize: 14 }}>
												<strong>{condition.operator} {condition.value}</strong>
											</Typography.Text>
										</Space>
									</Card>
								))}
							</Space>
						) : (
							<Typography.Text type="secondary">No conditions defined</Typography.Text>
						)}
					</Card>
				</Col>

				{/* Right: Control Parameters */}
				<Col span={12}>
					<Card 
						title="Control Parameters" 
						bordered
						style={{ height: '500px' }}
						bodyStyle={{ 
							padding: '16px',
							height: 'calc(100% - 57px)',
							overflow: 'auto'
						}}
					>
						{ruleData.controls && ruleData.controls.length > 0 ? (
							<Space direction="vertical" size={12} style={{ width: '100%' }}>
								{ruleData.controls.map((control, index) => (
									<Card
										key={index}
										size="small"
										style={{ 
											backgroundColor: '#FFFFFF',
											border: '1px solid #d9d9d9'
										}}
										bodyStyle={{ padding: '12px' }}
									>
										<Space direction="vertical" size={4} style={{ width: '100%' }}>
										<Typography.Text style={{ color: '#003A70', fontSize: 11, textTransform: 'uppercase', fontWeight: 'bold' }}>
											Control {index + 1}: {control.name}
										</Typography.Text>
											<Typography.Text style={{ color: '#000', fontSize: 13 }}>
												<strong>Type:</strong> {control.type}
											</Typography.Text>
											<Typography.Text style={{ color: '#000', fontSize: 13 }}>
												<strong>Device:</strong> {control.device}
											</Typography.Text>
											<Typography.Text style={{ color: '#000', fontSize: 13 }}>
												<strong>Parameter:</strong> {control.parameter}
											</Typography.Text>
											<Typography.Text style={{ color: '#003A70', fontSize: 14 }}>
												<strong>Value: {control.value}</strong>
											</Typography.Text>
										</Space>
									</Card>
								))}
							</Space>
						) : (
							<Typography.Text type="secondary">No control actions defined</Typography.Text>
						)}
					</Card>
				</Col>
			</Row>
		</Modal>
	);
};

export default RuleViewData;
