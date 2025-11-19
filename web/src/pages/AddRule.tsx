import React, { useState } from 'react';
import { Form, Typography, Steps } from 'antd';
import { InfoCircleOutlined, ControlOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AddRuleCondition from './AddRuleCondition';
import AddRuleControl from './AddRuleControl';
import AddRuleSummary from './AddRuleSummary';

const { Title, Paragraph } = Typography;

type ConditionType = 'device' | 'timer';

const AddRule: React.FC = () => {
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [conditionType, setConditionType] = useState<ConditionType>('device');
	const [controlType, setControlType] = useState<ConditionType>('device');

	const handleNext = async () => {
		try {
			if (currentStep === 0) {
				// Validate condition fields
				if (conditionType === 'device') {
					await form.validateFields(['name', 'severity', 'conditions', 'conditionLogic']);
				} else {
					await form.validateFields(['name', 'severity', 'conditions', 'conditionLogic']);
				}
			} else if (currentStep === 1) {
				// Validate action fields
				await form.validateFields(['actionName', 'controls', 'controlType', 'report', 'log']);
			}
			setCurrentStep(currentStep + 1);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handlePrevious = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			console.log('Rule created:', values);
			setCurrentStep(3);
		} catch (error) {
			console.error('Submit failed:', error);
		}
	};

	const handleReset = () => {
		form.resetFields();
		setCurrentStep(0);
		setConditionType('device');
		setControlType('device');
	};

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<ControlOutlined /> Add Rule
					</Title>
					<Paragraph type="secondary">
						Create complex automation rules with conditions and actions
					</Paragraph>

					<Steps current={currentStep} style={{ marginBottom: 32 }}>
						<Steps.Step title="Condition" description="Set trigger conditions" icon={<InfoCircleOutlined />} />
						<Steps.Step title="Action" description="Define actions" icon={<InfoCircleOutlined />} />
						<Steps.Step title="Review" description="Confirm details" icon={<InfoCircleOutlined />} />
						<Steps.Step title="Complete" description="Finish" icon={<CheckCircleOutlined />} />
					</Steps>

					<Form
						form={form}
						layout="vertical"
						initialValues={{
							conditionLogic: 'AND',
							conditionType: 'device',
							controlType: 'device',
							report: 1,
							log: 1,
							conditions: [{ operator: '>=', logic: 'NONE', mode: 1 }],
							controls: [{ mode: 1 }],
						}}
					>
						{currentStep === 0 && (
							<AddRuleCondition
								form={form}
								conditionType={conditionType}
								setConditionType={setConditionType}
								onNext={handleNext}
								onReset={handleReset}
							/>
						)}

						{currentStep === 1 && (
							<AddRuleControl
								form={form}
								controlType={controlType}
								setControlType={setControlType}
								onNext={handleNext}
								onPrevious={handlePrevious}
							/>
						)}

						{(currentStep === 2 || currentStep === 3) && (
							<AddRuleSummary
								form={form}
								currentStep={currentStep}
								conditionType={conditionType}
								controlType={controlType}
								onPrevious={handlePrevious}
								onSubmit={handleSubmit}
								onReset={handleReset}
							/>
						)}
					</Form>
				</div>
			</div>
		</div>
	);
};

export default AddRule;
