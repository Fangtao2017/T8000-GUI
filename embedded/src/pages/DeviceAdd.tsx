import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Space, Steps, Row, Col, Tag, Typography, message, Table, Collapse, Select, Grid, Descriptions, InputNumber } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined, ArrowLeftOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { addDevice, linkDeviceParameter } from '../api/addDeviceApi';

const { Title, Text, Paragraph } = Typography;

interface ParameterInfo {
    id: number;
    name: string;
}

interface DeviceTemplate {
    id: number;
	model: string;
	type: string;
	brand: string;
	parameters: ParameterInfo[];
	description: string;
	icon: React.ReactNode;
}

const getIconForType = (type: string) => {
    const lowerType = (type || '').toLowerCase();
    if (lowerType.includes('gateway')) return <GlobalOutlined style={{ color: '#1890ff' }} />;
    if (lowerType.includes('dimmer')) return '💡';
    if (lowerType.includes('sensor')) return '🚶';
    if (lowerType.includes('meter')) return '⚡';
    if (lowerType.includes('tank')) return '🛢️';
    if (lowerType.includes('pump')) return '⛽';
    if (lowerType.includes('panel')) return '❄️';
    if (lowerType.includes('alarm')) return '🔥';
    if (lowerType.includes('module')) return '🎛️';
    return '🔌';
};

const DeviceAdd: React.FC = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
    const screens = Grid.useBreakpoint();
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedModel, setSelectedModel] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [paramSearch, setParamSearch] = useState('');
    const [paramFilter, setParamFilter] = useState<'all' | 'linked' | 'unlinked'>('all');
	const [loading, setLoading] = useState(false);
	const [unlinkedParameters, setUnlinkedParameters] = useState<string[]>([]);
    const [sensitivityMap, setSensitivityMap] = useState<Record<string, number>>({});
    const [templates, setTemplates] = useState<Record<string, DeviceTemplate>>({});

    const getColProps = () => {
        if (screens.xl) return { flex: '20%', style: { maxWidth: '20%' } };
        if (screens.lg) return { span: 6 }; // 4 per row
        if (screens.md) return { span: 8 }; // 3 per row
        if (screens.sm) return { span: 12 }; // 2 per row
        return { span: 24 }; // 1 per row
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modelsRes, paramsRes] = await Promise.all([
                    fetch('/api/models'),
                    fetch('/api/parameters')
                ]);
                
                const models = await modelsRes.json();
                const parameters = await paramsRes.json();

                const newTemplates: Record<string, DeviceTemplate> = {};

                models.forEach((m: any) => {
                    const modelParams = parameters
                        .filter((p: any) => p.device === m.model)
                        .map((p: any) => ({ id: p.key, name: p.name }));

                    newTemplates[m.model] = {
                        id: m.id,
                        model: m.model,
                        type: m.type || 'Unknown',
                        brand: m.brand || 'Unknown',
                        parameters: modelParams,
                        description: `${m.brand} ${m.type}`,
                        icon: getIconForType(m.type)
                    };
                });
                setTemplates(newTemplates);
            } catch (error) {
                console.error("Failed to fetch device templates:", error);
                message.error("Failed to load device templates");
            }
        };
        fetchData();
    }, []);

	// 获取选中模板的参数列表
	const selectedTemplate = selectedModel ? templates[selectedModel] : null;

	const handleModelChange = (model: string) => {
		setSelectedModel(model);
		setUnlinkedParameters([]); // Reset unlinked parameters when model changes
        
        // Initialize sensitivity map
        const template = templates[model];
        const newSensitivityMap: Record<string, number> = {};
        if (template) {
            template.parameters.forEach(p => {
                newSensitivityMap[p.name] = 1;
            });
        }
        setSensitivityMap(newSensitivityMap);

		form.setFieldsValue({
			type: template?.type,
			brand: template?.brand,
            en: 1,
		});
	};

	const handleSubmit = async () => {
		try {
			const values = form.getFieldsValue(true);
			setLoading(true);

            if (!selectedTemplate) {
                message.error('No model selected');
                return;
            }

            if (!selectedTemplate?.id) {
                message.error('Model ID is missing. Please refresh the page.');
                return;
            }

            // 1. Add Device
            const deviceResponse = await addDevice({
                device_id: values.name,
                model_id: selectedTemplate.id,
                node_id: selectedTemplate.model,
                pri_addr: values.priAddr ?? null,
                sec_addr: values.sec_addr ?? null,
                ter_addr: values.ter_addr ?? null,
                log_intvl: values.log_intvl ?? null,
                report_intvl: values.report_intvl ?? null,
                health_intvl: values.health_intvl ?? null,
                loc_id: values.loc_id ?? null,
                loc_name: values.loc_name ?? null,
                loc_subname: values.loc_subname ?? null,
                loc_blk: values.loc_blk ?? null,
                loc_unit: values.loc_unit ?? null,
                postal_code: values.postal_code ?? null,
                loc_addr: values.loc_addr ?? null,
                x: values.x ? Number(values.x) : undefined,
                y: values.y ? Number(values.y) : undefined,
                h: values.h ? Number(values.h) : undefined,
                fw_ver: values.fw_ver ?? null,
                en: values.en ?? 1
            });

            if (!deviceResponse.id) {
                console.error('Device response missing ID:', deviceResponse);
                throw new Error('Failed to get new device ID from server');
            }
            console.log('Device created with ID:', deviceResponse.id);

            // 2. Link Parameters
            const parametersToLink = selectedTemplate.parameters.filter(p => !unlinkedParameters.includes(p.name));
            console.log('Parameters to link:', parametersToLink);
            
            for (const param of parametersToLink) {
                const sensitivity = sensitivityMap[param.name] ?? 1;
                await linkDeviceParameter(deviceResponse.id, param.id, sensitivity);
            }

			message.success('Device added successfully! Parameters auto-linked.');
			setCurrentStep(3);
			form.resetFields();
			setSelectedModel('');
			
			// Removed auto-redirect to allow user to choose next action
		} catch (error: any) {
			console.error('Validation failed:', error);
            message.error(error.message || 'Failed to add device');
		} finally {
			setLoading(false);
		}
	};

	const toggleParameterLink = (parameterName: string) => {
		setUnlinkedParameters(prev => {
			if (prev.includes(parameterName)) {
				// Re-link the parameter
				return prev.filter(p => p !== parameterName);
			} else {
				// Unlink the parameter
				return [...prev, parameterName];
			}
		});
	};

	const parameterColumns = [
		{
			title: 'Param',
			dataIndex: 'name',
			key: 'name',
            ellipsis: true,
		},
        {
            title: 'Sensitivity',
            key: 'sensitivity',
            width: 100,
            render: (_: unknown, record: { name: string }) => (
                <InputNumber 
                    min={0} 
                    size="small"
                    style={{ width: '100%' }}
                    value={sensitivityMap[record.name] ?? 1}
                    onChange={(val) => {
                        setSensitivityMap(prev => ({
                            ...prev,
                            [record.name]: val ?? 1
                        }));
                    }}
                    disabled={unlinkedParameters.includes(record.name)}
                />
            )
        },
		{
			title: 'Status',
			key: 'status',
			width: 100,
			render: (_: unknown, record: { name: string }) => {
				const isUnlinked = unlinkedParameters.includes(record.name);
				return isUnlinked ? (
					<Tag color="red">Unlinked</Tag>
				) : (
					<Tag color="green">Linked</Tag>
				);
			},
		},
		{
			title: 'Action',
			key: 'action',
			width: 70,
			render: (_: unknown, record: { name: string }) => {
				const isUnlinked = unlinkedParameters.includes(record.name);
				return (
					<Button
						type="link"
						size="small"
						onClick={() => toggleParameterLink(record.name)}
						style={{ padding: 0, minWidth: 60, color: '#003A70' }}
					>
						{isUnlinked ? 'Link' : 'Unlink'}
					</Button>
				);
			},
		},
	];

	const steps = [
		{
			title: 'Select Model',
			description: 'Choose sensor',
			icon: <InfoCircleOutlined />,
		},
		{
			title: 'Sensor Info',
			description: 'Enter details',
			icon: <InfoCircleOutlined />,
		},
        {
            title: 'Preview',
            description: 'Confirm & Save',
            icon: <InfoCircleOutlined />,
        },
		{
			title: 'Complete',
			description: 'Finish',
			icon: <CheckCircleOutlined />,
		},
	];

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
			<div style={{ flex: 1, overflow: currentStep === 0 ? 'hidden' : 'auto', padding: '24px' }}>
				<div style={{ 
					maxWidth: 1200, 
					margin: '0 auto',
					height: currentStep === 0 ? '100%' : 'auto',
					display: currentStep === 0 ? 'flex' : 'block',
					flexDirection: 'column'
				}}>
					<div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
						<Button 
							type="link" 
							icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />} 
							onClick={() => navigate('/devices')} 
							style={{ color: '#000', marginRight: 8, padding: 0 }} 
						/>
						<Title level={3} style={{ margin: 0 }}>
							Add New Sensor
						</Title>
					</div>
					<Paragraph type="secondary">
						Simplified sensor onboarding - Select a model, fill basic info, and we'll auto-configure all parameters and mappings for you.
					</Paragraph>

					<Steps current={currentStep} items={steps} size="small" style={{ marginBottom: 16 }} />

				{currentStep === 0 && (
					<div style={{ display: 'flex', flexDirection: 'column', height: '50vh' }}>
                        <div style={{ marginBottom: 12 }}>
                            <Input.Search 
                                placeholder="Search Sensor models..." 
                                allowClear 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </div>
						<div style={{ 
							flex: 1,
							overflow: 'auto', 
							marginTop: 0,
							border: '1px solid #f0f0f0',
							borderRadius: '8px',
							padding: '16px',
							background: '#fafafa',
						}}>
							<Space direction="vertical" size={8} style={{ width: '100%' }}>
								{Object.entries(templates)
                                    .filter(([key, template]) => {
                                        if (key === 'T8000') return false;
                                        if (!searchQuery) return true;
                                        const query = searchQuery.toLowerCase();
                                        return (
                                            template.model.toLowerCase().includes(query) ||
                                            template.brand.toLowerCase().includes(query) ||
                                            template.type.toLowerCase().includes(query) ||
                                            template.description.toLowerCase().includes(query)
                                        );
                                    })
                                    .map(([key, template]) => (
								<Card
									key={key}
									hoverable
									style={{
										border: selectedModel === key ? '2px solid #003A70' : '1px solid #d9d9d9',
										cursor: 'pointer',
									padding: '8px 16px',
								}}
								bodyStyle={{ padding: 0 }}
									onClick={() => {
										setSelectedModel(key);
										handleModelChange(key);
									}}
								>
								<Space size={12} align="center" style={{ width: '100%' }}>
									<Text strong style={{ fontSize: 14, minWidth: 100 }}>
										{template.model}
									</Text>
									<Tag style={{ margin: 0, background: '#f0f0f0', border: '1px solid #d9d9d9', color: '#595959' }}>{template.type}</Tag>
									<Text type="secondary" style={{ fontSize: 13, flex: 1 }}>
										{template.description}
									</Text>
									<Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
										{template.parameters.length} parameters
									</Text>
								</Space>
								</Card>
							))}
							</Space>
						</div>

						<div style={{ flexShrink: 0, marginTop: 8, textAlign: 'right', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
							<Button
								type="primary"
								size="large"
								disabled={!selectedModel}
								onClick={() => setCurrentStep(1)}
								className="add-button-hover"
								style={selectedModel ? { backgroundColor: '#003A70', borderColor: '#003A70' } : {}}
							>
								Next: Configure Sensor
							</Button>
						</div>
					</div>
				)}

				{currentStep === 1 && (
					<div style={{ display: 'flex', flexDirection: 'column', height: '50vh' }}>
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 12 }}>
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={{
                                    model: selectedModel,
                                    type: selectedTemplate?.type,
                                    brand: selectedTemplate?.brand,
                                    en: 1,
                                    log_intvl: "0",
                                    report_intvl: "0",
                                    health_intvl: "0",
                                }}
                            >
                                <Card bordered={false} style={{ marginBottom: 0 }} bodyStyle={{ padding: '0' }}>
                                    <Row gutter={[16, 0]}>
                                        <Col {...getColProps()}>
                                            <Form.Item label="Sensor Name" name="name" rules={[{ required: true, message: 'Please enter sensor name' }]} style={{ marginBottom: 12 }}>
                                                <Input placeholder="e.g., Gateway Main" />
                                            </Form.Item>
                                        </Col>
                                        <Col {...getColProps()}>
                                            <Form.Item label="Model" name="model" style={{ marginBottom: 12 }}>
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col {...getColProps()}>
                                            <Form.Item label="Firmware Version" name="fw_ver" style={{ marginBottom: 12 }}>
                                                <Input placeholder="e.g., v1.0.0" />
                                            </Form.Item>
                                        </Col>

                                        <Col {...getColProps()}>
                                            <Form.Item 
                                                label="Modbus Address" 
                                                name="priAddr" 
                                                style={{ marginBottom: 12 }}
                                                rules={[{ pattern: /^-?\d+$/, message: 'Must be an integer' }]}
                                            >
                                                <Input placeholder="Primary Address" />
                                            </Form.Item>
                                        </Col>
                                        <Col {...getColProps()}>
                                            <Form.Item 
                                                label="Secondary Address" 
                                                name="sec_addr" 
                                                style={{ marginBottom: 12 }}
                                                rules={[{ pattern: /^-?\d+$/, message: 'Must be an integer' }]}
                                            >
                                                <Input placeholder="Secondary Address" />
                                            </Form.Item>
                                        </Col>
                                        <Col {...getColProps()}>
                                            <Form.Item 
                                                label="Tertiary Address" 
                                                name="ter_addr" 
                                                style={{ marginBottom: 12 }}
                                                rules={[{ pattern: /^-?\d+$/, message: 'Must be an integer' }]}
                                            >
                                                <Input placeholder="Tertiary Address" />
                                            </Form.Item>
                                        </Col>

                                        <Col {...getColProps()}>
                                            <Form.Item label="Logging Interval" name="log_intvl" style={{ marginBottom: 12 }}>
                                                <Select>
                                                    <Select.Option value="0">Disabled</Select.Option>
                                                    <Select.Option value="1">10min</Select.Option>
                                                    <Select.Option value="2">15min</Select.Option>
                                                    <Select.Option value="3">30min</Select.Option>
                                                    <Select.Option value="4">1hour</Select.Option>
                                                    <Select.Option value="5">6hour</Select.Option>
                                                    <Select.Option value="6">12hour</Select.Option>
                                                    <Select.Option value="7">daily</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col {...getColProps()}>
                                            <Form.Item label="Reporting Interval" name="report_intvl" style={{ marginBottom: 12 }}>
                                                <Select>
                                                    <Select.Option value="0">Disabled</Select.Option>
                                                    <Select.Option value="1">10min</Select.Option>
                                                    <Select.Option value="2">15min</Select.Option>
                                                    <Select.Option value="3">30min</Select.Option>
                                                    <Select.Option value="4">1hour</Select.Option>
                                                    <Select.Option value="5">6hour</Select.Option>
                                                    <Select.Option value="6">12hour</Select.Option>
                                                    <Select.Option value="7">daily</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col {...getColProps()}>
                                            <Form.Item label="Health Interval" name="health_intvl" style={{ marginBottom: 12 }}>
                                                <Select>
                                                    <Select.Option value="0">Disabled</Select.Option>
                                                    <Select.Option value="1">10min</Select.Option>
                                                    <Select.Option value="2">15min</Select.Option>
                                                    <Select.Option value="3">30min</Select.Option>
                                                    <Select.Option value="4">1hour</Select.Option>
                                                    <Select.Option value="5">6hour</Select.Option>
                                                    <Select.Option value="6">12hour</Select.Option>
                                                    <Select.Option value="7">daily</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col {...getColProps()}>
                                            <Form.Item label="Enabled" name="en" style={{ marginBottom: 12 }}>
                                                <Select>
                                                    <Select.Option value={1}>Enabled</Select.Option>
                                                    <Select.Option value={0}>Disabled</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>

                                <Collapse 
                                    ghost 
                                    items={[{
                                        key: '1',
                                        label: <Typography.Text strong style={{ fontSize: 16 }}>Location Information</Typography.Text>,
                                        children: (
                                            <Row gutter={[16, 0]}>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Location ID" name="loc_id" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Location Name" name="loc_name" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Location Subname" name="loc_subname" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Block Number/Name" name="loc_blk" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Floor/Unit" name="loc_unit" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Postal Code" name="postal_code" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Latitude (X)" name="x" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Longitude (Y)" name="y" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Height from Floor (H)" name="h" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                                <Col {...getColProps()}>
                                                    <Form.Item label="Location Address" name="loc_addr" style={{ marginBottom: 12 }}>
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )
                                    }]}
                                />
                            </Form>
                        </div>

						<div style={{ flexShrink: 0, marginTop: 8, textAlign: 'right', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
							<Space>
								<Button size="large" onClick={() => setCurrentStep(0)}>
									Back
								</Button>
								<Button
									type="primary"
									size="large"
									className="add-button-hover"
									onClick={async () => {
                                        try {
                                            await form.validateFields();
                                            setCurrentStep(2);
                                        } catch (error) {
                                            // Validation failed
                                        }
                                    }} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
									Next: Preview
								</Button>
							</Space>
						</div>
					</div>
				)}

                {currentStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '50vh' }}>
                        <div style={{ flex: 1, overflow: 'auto', paddingRight: 12 }}>
                            <Row gutter={24}>
                                <Col xs={24} lg={14}>
                                    <Card title="Sensor Summary" size="small" bordered={false} style={{ background: '#fafafa', height: '100%' }} bodyStyle={{ padding: '12px' }}>
                                        <Descriptions bordered size="small" column={1} labelStyle={{ width: '140px' }}>
                                            <Descriptions.Item label="Name">{form.getFieldValue('name')}</Descriptions.Item>
                                            <Descriptions.Item label="Model">{selectedModel}</Descriptions.Item>
                                            <Descriptions.Item label="Firmware Version">{form.getFieldValue('fw_ver') || 'N/A'}</Descriptions.Item>
                                            <Descriptions.Item label="Modbus Address">
                                                {(() => {
                                                    const pri = form.getFieldValue('priAddr');
                                                    const sec = form.getFieldValue('sec_addr');
                                                    const ter = form.getFieldValue('ter_addr');
                                                    if (!pri && !sec && !ter) return 'N/A';
                                                    return `Pri: ${pri || '-'}, Sec: ${sec || '-'}, Ter: ${ter || '-'}`;
                                                })()}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Intervals">
                                                {(() => {
                                                    const intervalMap: Record<string, string> = {
                                                        "0": "Disabled", "1": "10min", "2": "15min", "3": "30min",
                                                        "4": "1hour", "5": "6hour", "6": "12hour", "7": "daily"
                                                    };
                                                    const log = intervalMap[form.getFieldValue('log_intvl')] || form.getFieldValue('log_intvl');
                                                    const rpt = intervalMap[form.getFieldValue('report_intvl')] || form.getFieldValue('report_intvl');
                                                    const health = intervalMap[form.getFieldValue('health_intvl')] || form.getFieldValue('health_intvl');
                                                    return `Log: ${log}, Rpt: ${rpt}, Health: ${health}`;
                                                })()}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Location">
                                                {[
                                                    form.getFieldValue('loc_name'),
                                                    form.getFieldValue('loc_subname'),
                                                    form.getFieldValue('loc_blk'),
                                                    form.getFieldValue('loc_unit'),
                                                    form.getFieldValue('postal_code')
                                                ].filter(Boolean).join(', ') || 'N/A'}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                </Col>
                                <Col xs={24} lg={10}>
                                    <Card 
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>Auto-Link</span>
                                                <Space size={8}>
                                                    <Input 
                                                        placeholder="Search" 
                                                        size="small" 
                                                        style={{ width: 120, fontSize: 12 }} 
                                                        value={paramSearch}
                                                        onChange={e => setParamSearch(e.target.value)}
                                                    />
                                                    <Select 
                                                        size="small" 
                                                        defaultValue="all" 
                                                        style={{ width: 120, fontSize: 12 }}
                                                        value={paramFilter}
                                                        onChange={setParamFilter}
                                                        options={[
                                                            { label: 'All', value: 'all' },
                                                            { label: 'Linked', value: 'linked' },
                                                            { label: 'Unlinked', value: 'unlinked' },
                                                        ]}
                                                    />
                                                </Space>
                                            </div>
                                        }
                                        size="small" 
                                        style={{ background: '#f5f5f5', height: '100%' }} 
                                        bodyStyle={{ padding: '0' }}
                                    >
                                        <Table
                                            dataSource={selectedTemplate?.parameters
                                                .filter(param => {
                                                    const matchesSearch = param.name.toLowerCase().includes(paramSearch.toLowerCase());
                                                    const isUnlinked = unlinkedParameters.includes(param.name);
                                                    const matchesFilter = paramFilter === 'all' 
                                                        ? true 
                                                        : paramFilter === 'linked' 
                                                            ? !isUnlinked 
                                                            : isUnlinked;
                                                    return matchesSearch && matchesFilter;
                                                })
                                                .map((param, idx) => ({
                                                    key: idx,
                                                    name: param.name,
                                                }))}
                                            columns={parameterColumns}
                                            pagination={false}
                                            size="small"
                                            scroll={{ y: 220 }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ flexShrink: 0, marginTop: 8, textAlign: 'right', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
							<Space>
								<Button size="large" onClick={() => setCurrentStep(1)}>
									Back
								</Button>
								<Button
									type="primary"
									size="large"
									loading={loading}
									className="add-button-hover"
									onClick={handleSubmit} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
									Confirm & Create
								</Button>
							</Space>
						</div>
                    </div>
                )}

				{currentStep === 3 && (
					<div style={{ textAlign: 'center', padding: '60px 0' }}>
						<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a', marginBottom: 24 }} />
						<Title level={3}>Device Added Successfully!</Title>
						<Paragraph type="secondary" style={{ fontSize: 16 }}>
						Your device has been created with all parameters automatically configured and linked.
					</Paragraph>
					<Space size="large" style={{ marginTop: 32 }}>
						<Button size="large" onClick={() => setCurrentStep(0)}>
							Add Another Device
						</Button>
						<Button type="primary" size="large" className="add-button-hover" onClick={() => window.location.href = '/devices'} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
							View All Devices
						</Button>
					</Space>
				</div>
			)}
			</div>
		</div>
		</div>
	);
};export default DeviceAdd;





