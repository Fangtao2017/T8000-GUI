import React, { useState } from 'react';
import { Form, Typography, Steps, Button } from 'antd';
import { InfoCircleOutlined, ControlOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddRuleCondition from './AddRuleCondition';
import AddRuleControl from './AddRuleControl';
import AddRuleSummary from './AddRuleSummary';

const { Title, Paragraph } = Typography;

type ConditionType = 'device' | 'timer';

const AddRule: React.FC = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [controlType, setControlType] = useState<ConditionType>('device');

	const handleNext = async () => {
		try {
			if (currentStep === 0) {
				// Validate condition fields
				await form.validateFields(['name', 'severity', 'conditions']);
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
		setControlType('device');
	};

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
						<Button 
							type="link" 
							icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} 
							onClick={() => navigate('/rules')} 
							style={{ color: '#000', marginRight: 8, padding: 0 }} 
						/>
						<Title level={3} style={{ margin: 0 }}>
							<ControlOutlined /> Add Rule
						</Title>
					</div>
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
							controlType: 'device',
							report: 1,
							log: 1,
							conditions: [{ type: 'device', operator: '>=', logic: 'AND', mode: 1 }],
							controls: [{ mode: 1 }],
						}}
					>
						{currentStep === 0 && (
							<AddRuleCondition
								form={form}
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
