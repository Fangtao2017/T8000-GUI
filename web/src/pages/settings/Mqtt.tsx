import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Divider, Typography, Row, Col, Switch, message, Tag, InputNumber, Alert } from 'antd';
import { SaveOutlined, ReloadOutlined, CheckCircleOutlined, DisconnectOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

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
  const [mqttEnabled, setMqttEnabled] = useState(true);
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
    setMqttEnabled(currentConfig.enabled);
    message.info('Settings reset to current values');
  };

  const handleTestConnection = async () => {
    setConnectionStatus('connecting');
    message.loading({ content: 'Testing MQTT connection...', key: 'test' });
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setConnectionStatus('connected');
      message.success({ content: 'MQTT connection test successful!', key: 'test', duration: 2 });
    } catch {
      setConnectionStatus('disconnected');
      message.error({ content: 'MQTT connection test failed', key: 'test', duration: 2 });
    }
  };

  const handleDisconnect = async () => {
    setConnectionStatus('disconnected');
    message.info('MQTT disconnected');
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
      <Alert
        message="Under Development"
        description="This page is currently under development. Features may be incomplete or subject to change."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />
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
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{currentConfig.broker}:{currentConfig.port}</Text>
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
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>MQTT Configuration</Title>
          </Space>
        }
        bordered
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>Reset</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={() => form.submit()}>
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
          {/* MQTT Enable Toggle */}
          <Form.Item 
            label="Enable MQTT" 
            name="enabled"
            valuePropName="checked"
          >
            <Switch 
              checked={mqttEnabled}
              onChange={setMqttEnabled}
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Form.Item>

          <Divider orientation="left">Broker Configuration</Divider>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Broker Address"
                name="broker"
                rules={[
                  { required: mqttEnabled, message: 'Please input broker address' },
                ]}
              >
                <Input 
                  placeholder="mqtt.example.com or 192.168.1.100" 
                  disabled={!mqttEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Port"
                name="port"
                rules={[
                  { required: mqttEnabled, message: 'Please input port' },
                ]}
              >
                <InputNumber 
                  placeholder="1883" 
                  disabled={!mqttEnabled}
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  max={65535}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Authentication</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Client ID"
                name="clientId"
                rules={[
                  { required: mqttEnabled, message: 'Please input client ID' },
                ]}
              >
                <Input 
                  placeholder="Unique client identifier" 
                  disabled={!mqttEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Username"
                name="username"
              >
                <Input 
                  placeholder="MQTT username (optional)" 
                  disabled={!mqttEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Password"
                name="password"
              >
                <Input.Password 
                  placeholder="MQTT password (optional)" 
                  disabled={!mqttEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Connection Settings</Divider>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Keep Alive (seconds)"
                name="keepAlive"
                tooltip="Time interval to send ping to broker"
              >
                <InputNumber 
                  placeholder="60" 
                  disabled={!mqttEnabled}
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  max={3600}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="QoS Level"
                name="qos"
                tooltip="Quality of Service: 0=At most once, 1=At least once, 2=Exactly once"
              >
                <InputNumber 
                  placeholder="1" 
                  disabled={!mqttEnabled}
                  size="large"
                  style={{ width: '100%' }}
                  min={0}
                  max={2}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Reconnect Interval (s)"
                name="reconnectInterval"
                tooltip="Seconds to wait before reconnecting"
              >
                <InputNumber 
                  placeholder="5" 
                  disabled={!mqttEnabled}
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  max={300}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Connect Timeout (s)"
                name="connectTimeout"
                tooltip="Maximum time to wait for connection"
              >
                <InputNumber 
                  placeholder="30" 
                  disabled={!mqttEnabled}
                  size="large"
                  style={{ width: '100%' }}
                  min={5}
                  max={300}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                label="Clean Session" 
                name="cleanSession"
                valuePropName="checked"
                tooltip="Start a clean session without persistent data"
              >
                <Switch 
                  disabled={!mqttEnabled}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Retain Messages" 
                name="retain"
                valuePropName="checked"
                tooltip="Broker retains last message for topic"
              >
                <Switch 
                  disabled={!mqttEnabled}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Last Will and Testament (LWT)</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Will Topic"
                name="willTopic"
                tooltip="Topic for will message when device disconnects unexpectedly"
              >
                <Input 
                  placeholder="device/status" 
                  disabled={!mqttEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Will QoS"
                name="willQos"
              >
                <InputNumber 
                  placeholder="1" 
                  disabled={!mqttEnabled}
                  size="large"
                  style={{ width: '100%' }}
                  min={0}
                  max={2}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item 
                label="Will Retain" 
                name="willRetain"
                valuePropName="checked"
              >
                <Switch 
                  disabled={!mqttEnabled}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Will Message"
            name="willMessage"
            tooltip="Message sent when device disconnects unexpectedly"
          >
            <TextArea 
              placeholder="offline" 
              disabled={!mqttEnabled}
              rows={2}
            />
          </Form.Item>

          <Divider />

          <Space size={12}>
            <Button 
              type="default" 
              onClick={handleTestConnection}
              disabled={!mqttEnabled || connectionStatus === 'connecting'}
            >
              Test Connection
            </Button>
            {connectionStatus === 'connected' && (
              <Button 
                danger
                onClick={handleDisconnect}
                disabled={!mqttEnabled}
              >
                Disconnect
              </Button>
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              Changes will take effect after saving and reconnecting
            </Text>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsMqtt;
