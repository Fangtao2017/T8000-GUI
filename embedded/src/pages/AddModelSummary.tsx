import React from 'react';
import { Descriptions, Table, Typography, Button, Space, Divider, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd/es/form';

const { Title, Text } = Typography;

interface AddModelSummaryProps {
	form: FormInstance;
	onPrevious: () => void;
	onSubmit: () => void;
}

interface ParameterConfig {
	name: string;
	attributeName: string;
	unit?: string;
	bit?: number | string;
	dataType?: string;
	rw?: string;
	sourceType: string;
	config: {
		address?: number;
		readFC?: number;
		writeFC?: number;
		len?: number;
		modbusDataType?: number;
		scaler?: number;
		offset?: number;
		dp?: number;
		timeout?: number;
		pollSpeed?: number;
		topic?: string;
		jsonPath?: string;
		pin?: string;
		invert?: number;
		en?: number;
		default_val?: number;
		sensitivity?: number;
		[key: string]: unknown;
	};
}

const AddModelSummary: React.FC<AddModelSummaryProps> = ({ form, onPrevious, onSubmit }) => {
	const values = form.getFieldsValue(true);
	const parameters: ParameterConfig[] = values.parameters || [];

	const columns = [
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Attribute', dataIndex: 'attributeName', key: 'attributeName' },
		{ title: 'Unit', dataIndex: 'unit', key: 'unit' },
		{ title: 'Bit', dataIndex: 'bit', key: 'bit' },
		{ title: 'Data Type', dataIndex: 'dataType', key: 'dataType' },
		{ title: 'RW', dataIndex: 'rw', key: 'rw', render: (t: string) => t === 'r' ? 'Read Only' : 'Read & Write' },
		{ 
			title: 'Source', 
			dataIndex: 'sourceType', 
			key: 'sourceType', 
			render: (t: string) => <Tag color="blue">{t?.toUpperCase()}</Tag> 
		},
		{ 
			title: 'Config Summary', 
			key: 'config',
			render: (_: unknown, record: ParameterConfig) => {
				const { config } = record;
				if (!config) return '-';

				if (record.sourceType === 'modbus') {
					return `Addr: ${config.address}, Len: ${config.len}, ReadFC: ${config.readFC}`;
				} else if (record.sourceType === 'DI') {
					return `Pin: ${config.pin}, Invert: ${config.invert}, En: ${config.en}`;
				} else if (record.sourceType === 'DO') {
					return `Pin: ${config.pin}, Def: ${config.default_val}, En: ${config.en}`;
				} else if (record.sourceType === 'AI') {
					return `Pin: ${config.pin}, Scaler: ${config.scaler}, En: ${config.en}`;
				}
				return '-';
			}
		}
	];

	return (
		<div style={{ maxWidth: 1000, margin: '0 auto' }}>
			<div style={{ textAlign: 'center', marginBottom: 32 }}>
				<CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
				<Title level={3}>Review Model Details</Title>
				<Text type="secondary">Please review the configuration before creating the model.</Text>
			</div>

			<Descriptions title="Basic Information" bordered column={2}>
				<Descriptions.Item label="Brand">{values.brand}</Descriptions.Item>
				<Descriptions.Item label="Model Name">{values.model}</Descriptions.Item>
				<Descriptions.Item label="Device Type">{values.dev_type}</Descriptions.Item>
			</Descriptions>

			<Divider />

			<Title level={5}>Parameters ({parameters.length})</Title>
			<Table 
				dataSource={parameters} 
				columns={columns} 
				rowKey="attributeName" 
				pagination={false} 
				size="small"
			/>

			<div style={{ marginTop: 32, textAlign: 'right' }}>
				<Space>
					<Button size="large" onClick={onPrevious}>
						Previous
					</Button>
					<Button
						type="primary"
						size="large"
						onClick={onSubmit}
						style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
					>
						Create Model
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default AddModelSummary;
