import React, { useState } from 'react';
import { Steps, Form, message, Typography, Button } from 'antd';
import { PlusOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AddModelBasic from './AddModelBasic';
import AddModelParameters from './AddModelParameters';
import AddModelSummary from './AddModelSummary';

const { Title, Paragraph } = Typography;

const AddModel: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();

	const next = async () => {
		try {
			// Validate fields for the current step before moving forward
			if (currentStep === 0) {
				await form.validateFields(['brand', 'model', 'dev_type', 'interface', 'icon']);
			}
			// Step 1 (Parameters) validation is handled within the component or loosely here
			// We might want to ensure at least one parameter is added?
			// For now, let's allow moving forward.
			
			setCurrentStep(currentStep + 1);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const prev = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleSubmit = async () => {
		try {
			const values = form.getFieldsValue(true);
			console.log('Creating model with values:', values);

			// TODO: Actual API call to create model
			// POST /api/models
			
			await new Promise(resolve => setTimeout(resolve, 1000));

			message.success('Model created successfully!');
			
			// Reset and go back to start
			form.resetFields();
			setCurrentStep(0);
		} catch (error) {
			console.error('Submission failed:', error);
			message.error('Failed to create model');
		}
	};

	const steps = [
		{
			title: 'Basic Info',
			content: (
				<div>
					<AddModelBasic form={form} />
					<div style={{ marginTop: 24, textAlign: 'right' }}>
						<Button 
							type="primary" 
							size="large"
							style={{ backgroundColor: '#003A70' }}
							onClick={next}
						>
							Next
						</Button>
					</div>
				</div>
			),
		},
		{
			title: 'Parameters',
			content: (
				<div>
					<AddModelParameters form={form} />
					<div style={{ marginTop: 24, textAlign: 'right' }}>
						<Button 
							size="large"
							style={{ marginRight: 8 }} 
							onClick={prev}
						>
							Previous
						</Button>
						<Button 
							type="primary" 
							size="large"
							style={{ backgroundColor: '#003A70' }}
							onClick={next}
						>
							Next
						</Button>
					</div>
				</div>
			),
		},
		{
			title: 'Summary',
			content: <AddModelSummary form={form} onPrevious={prev} onSubmit={handleSubmit} />,
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
				<div style={{ maxWidth: 1200, margin: '0 auto' }}>
					<Title level={3}>
						<PlusOutlined /> Add Model
					</Title>
					<Paragraph type="secondary">
						Create a new device model template with parameters configuration.
					</Paragraph>

					<Steps current={currentStep} style={{ marginBottom: 32 }}>
						<Steps.Step title="Basic Info" description="Define model identity" icon={<InfoCircleOutlined />} />
						<Steps.Step title="Parameters" description="Configure data points" icon={<InfoCircleOutlined />} />
						<Steps.Step title="Summary" description="Review and create" icon={<CheckCircleOutlined />} />
					</Steps>
						
					<Form form={form} layout="vertical" initialValues={{ icon: '💡', parameters: [] }}>
						<div className="steps-content">
							{steps[currentStep].content}
						</div>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default AddModel;
