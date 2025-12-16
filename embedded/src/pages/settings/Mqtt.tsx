import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Typography, Row, Col, Switch, message, Tag, InputNumber } from 'antd';
import { SaveOutlined, ReloadOutlined, CheckCircleOutlined, DisconnectOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface MqttConfig {
  enabled: boolean;
  broker: string;
  port: number;
  clientId: string;
  username: string;
  password: string;
  keepAlive: number;
  cleanSession: boolean;
  qos: number;
  retain: boolean;
  willTopic: string;
  willMessage: string;
  willQos: number;
  willRetain: boolean;
  reconnectInterval: number;
  connectTimeout: number;
}

const SettingsMqtt: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  // Mock current MQTT configuration
  const currentConfig: MqttConfig = {
    enabled: true,
    broker: 'mqtt.example.com',
    port: 1883,
    clientId: 'T8000_200310000092',
    username: 't8000_user',
    password: '********',
    keepAlive: 60,
    cleanSession: true,
    qos: 1,
    retain: false,
    willTopic: 'device/T8000/status',
    willMessage: 'offline',
    willQos: 1,
    willRetain: true,
    reconnectInterval: 5,
    connectTimeout: 30
  };

  const handleSave = async (values: MqttConfig) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('MQTT settings saved:', values);
      message.success('MQTT settings saved successfully!');
      
      // Simulate reconnection
      setConnectionStatus('connecting');
      setTimeout(() => {
        setConnectionStatus('connected');
        message.success('MQTT reconnected successfully!');
      }, 2000);
    } catch {
      message.error('Failed to save MQTT settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(currentConfig);
    message.info('Settings reset to current values');
  };

  React.useEffect(() => {
    form.setFieldsValue({
      enabled: true,
      broker: 'mqtt.example.com',
      port: 1883,
      clientId: 'T8000_200310000092',
      username: 't8000_user',
      password: '********',
      keepAlive: 60,
      cleanSession: true,
      qos: 1,
      retain: false,
      willTopic: 'device/T8000/status',
      willMessage: 'offline',
      willQos: 1,
      willRetain: true,
      reconnectInterval: 5,
      connectTimeout: 30
    });
  }, [form]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': return 'processing';
      case 'disconnected': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* MQTT Connection Status */}
      <Card 
        bordered 
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Row gutter={24} align="middle">
          <Col span={8}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>MQTT Connection Status</Text>
              <Space>
                {connectionStatus === 'connected' ? (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                ) : (
                  <DisconnectOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                )}
                <Text strong style={{ fontSize: 16 }}>{getStatusText()}</Text>
                <Tag color={getStatusColor()}>{getStatusText()}</Tag>
              </Space>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>Broker Address</Text>
              <Text strong style={{ fontSize: 16, color: '#003A70' }}>{currentConfig.broker}:{currentConfig.port}</Text>
            </Space>
          </Col>
          <Col span={8}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>Client ID</Text>
              <Text strong style={{ fontSize: 16 }}>{currentConfig.clientId}</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* MQTT Configuration */}
      <Card 
        bordered
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>Reset</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={() => form.submit()} style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}>
              Save Changes
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={currentConfig}
        >
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                label="Broker Address"
                name="broker"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="mqtt.example.com" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Port"
                name="port"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber placeholder="1883" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Client ID"
                name="clientId"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Client ID" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Username"
                name="username"
              >
                <Input placeholder="Username" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Password"
                name="password"
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item
                label="Keep Alive (s)"
                name="keepAlive"
              >
                <InputNumber placeholder="60" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="QoS"
                name="qos"
              >
                <InputNumber placeholder="1" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Reconnect (s)"
                name="reconnectInterval"
              >
                <InputNumber placeholder="5" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Timeout (s)"
                name="connectTimeout"
              >
                <InputNumber placeholder="30" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Will Topic"
                name="willTopic"
              >
                <Input placeholder="Topic" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Will Message"
                name="willMessage"
              >
                <Input placeholder="Message" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Will QoS"
                name="willQos"
              >
                <InputNumber placeholder="1" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item 
                label="Clean Session" 
                name="cleanSession" 
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Retain" 
                name="retain" 
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Will Retain" 
                name="willRetain" 
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsMqtt;
