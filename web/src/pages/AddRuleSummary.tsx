import React from 'react';
import { Card, Button, Space, Typography, Descriptions } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';
import { timerStateOptions } from '../data/mockData';

const { Title, Paragraph } = Typography;

type ConditionType = 'device' | 'timer';

interface Condition {
	itemMode?: 'new' | 'existing';
	existingId?: string;
	device?: string;
	parameter?: string;
	timerState?: number;
	operator: string;
	value?: number;
	logic?: 'NONE' | 'AND' | 'OR' | 'NOT';
	mode?: number;
	refDevice?: string;
	refParameter?: string;
}

interface Control {
	itemMode?: 'new' | 'existing';
	existingId?: string;
	device?: string;
	parameter?: string;
	timer?: string;
	timerAction?: string;
	mode: number;
	value?: number;
	refDevice?: string;
	refParameter?: string;
}

interface AddRuleSummaryProps {
	form: FormInstance;
	currentStep: number;
	conditionType: ConditionType;
	controlType: ConditionType;
	onPrevious: () => void;
	onSubmit: () => void;
	onReset: () => void;
}

const AddRuleSummary: React.FC<AddRuleSummaryProps> = ({
	form,
	currentStep,
	conditionType,
	controlType,
	onPrevious,
	onSubmit,
	onReset
}) => {
	return (
		<>
			{/* Step 2: Review */}
			{currentStep === 2 && (
				<>
					<Title level={4}>Step 3: Review Configuration</Title>

					<Card style={{ marginBottom: 24 }}>
						<Descriptions title="Rule Summary" bordered column={2}>
							<Descriptions.Item label="Rule Name">{form.getFieldValue('name')}</Descriptions.Item>
							<Descriptions.Item label="Severity">{form.getFieldValue('severity')}</Descriptions.Item>
							<Descriptions.Item label="Condition Type">{conditionType === 'device' ? 'Device' : 'Timer'}</Descriptions.Item>
							<Descriptions.Item label="Condition Logic">{form.getFieldValue('conditionLogic')}</Descriptions.Item>

							<Descriptions.Item label="Conditions" span={2}>
								{(form.getFieldValue('conditions') || []).map((cond: Condition, idx: number) => (
									<div key={idx}>
										{idx + 1}. {conditionType === 'device' 
											? `${cond.device || 'N/A'} - ${cond.parameter} ${cond.operator} ${cond.mode === 1 ? cond.value : cond.mode === 2 ? 'Ref Param' : 'Previous'}`
											: `Timer State ${cond.operator} ${timerStateOptions.find(t => t.value === cond.timerState)?.label}`
										}
									</div>
								))}
							</Descriptions.Item>

							<Descriptions.Item label="Action Name">{form.getFieldValue('actionName')}</Descriptions.Item>
							<Descriptions.Item label="Control Type">{controlType === 'device' ? 'Device' : 'Timer'}</Descriptions.Item>
							<Descriptions.Item label="Report">{form.getFieldValue('report') === 1 ? 'Enabled' : 'Disabled'}</Descriptions.Item>
							<Descriptions.Item label="Log">{form.getFieldValue('log') === 1 ? 'Enabled' : 'Disabled'}</Descriptions.Item>

							<Descriptions.Item label="Controls" span={2}>
								{(form.getFieldValue('controls') || []).map((ctrl: Control, idx: number) => (
									<div key={idx}>
										{idx + 1}. {controlType === 'device'
											? `${ctrl.device || 'N/A'} - ${ctrl.parameter} = ${ctrl.mode === 1 ? ctrl.value : 'Ref Param'}`
											: `${ctrl.timer || 'N/A'} - ${ctrl.timerAction}`
										}
									</div>
								))}
							</Descriptions.Item>
						</Descriptions>
					</Card>

					<div style={{ textAlign: 'right' }}>
						<Space>
							<Button size="large" onClick={onPrevious}>
								Previous
							</Button>
							<Button
								type="primary"
								size="large"
								onClick={onSubmit}
					style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
					Create Rule
							</Button>
						</Space>
					</div>
				</>
			)}

			{/* Step 3: Complete */}
			{currentStep === 3 && (
				<div style={{ textAlign: 'center', padding: '60px 0' }}>
					<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a', marginBottom: 24 }} />
					<Title level={3}>Rule Created Successfully!</Title>
					<Paragraph type="secondary" style={{ fontSize: 16 }}>
						Your automation rule has been configured and is now active.
					</Paragraph>
					<Space size="large" style={{ marginTop: 32 }}>
						<Button size="large" onClick={onReset}>
							Create Another Rule
						</Button>
						<Button type="primary" size="large">
							View All Rules
						</Button>
					</Space>
				</div>
			)}
		</>
	);
};

export default AddRuleSummary;
