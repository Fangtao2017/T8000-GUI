import React, { useState } from 'react';
import { Card, Form, Input, Button, Space, Divider, Typography, Row, Col, Switch, message, Tag } from 'antd';
import { SaveOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface NetworkConfig {
  ipAddress: string;
  subnetMask: string;
  gateway: string;
  primaryDNS: string;
  secondaryDNS: string;
  macAddress: string;
  dhcp: boolean;
  connectionStatus: string;
}

const SettingsNetwork: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dhcpEnabled, setDhcpEnabled] = useState(false);

  // Mock current network configuration
  const currentConfig: NetworkConfig = {
    ipAddress: '192.168.1.100',
    subnetMask: '255.255.255.0',
    gateway: '192.168.1.1',
    primaryDNS: '8.8.8.8',
    secondaryDNS: '8.8.4.4',
    macAddress: 'A4:CF:12:B8:76:3D',
    dhcp: false,
    connectionStatus: 'Connected'
  };

  const handleSave = async (values: NetworkConfig) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Network settings saved:', values);
      message.success('Network settings saved successfully!');
    } catch {
      message.error('Failed to save network settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(currentConfig);
    setDhcpEnabled(currentConfig.dhcp);
    message.info('Settings reset to current values');
  };

  React.useEffect(() => {
    form.setFieldsValue({
      ipAddress: '192.168.1.100',
      subnetMask: '255.255.255.0',
      gateway: '192.168.1.1',
      primaryDNS: '8.8.8.8',
      secondaryDNS: '8.8.4.4',
      macAddress: 'A4:CF:12:B8:76:3D',
      dhcp: false,
      connectionStatus: 'Connected'
    });
  }, [form]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Device Connection Status */}
      <Card 
        bordered 
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Row gutter={24} align="middle">
          <Col span={12}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>Device Connection Status</Text>
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                <Text strong style={{ fontSize: 16 }}>{currentConfig.connectionStatus}</Text>
                <Tag color="success">Online</Tag>
              </Space>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>Current IP Address</Text>
              <Text strong style={{ fontSize: 16, color: '#003A70' }}>{currentConfig.ipAddress}</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Network Configuration */}
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
          {/* DHCP Toggle */}
          <Form.Item 
            label="DHCP (Automatic IP Configuration)" 
            name="dhcp"
            valuePropName="checked"
          >
            <Switch 
              checked={dhcpEnabled}
              onChange={setDhcpEnabled}
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Form.Item>

          <Divider orientation="left">IP Configuration</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="IP Address"
                name="ipAddress"
                rules={[
                  { required: !dhcpEnabled, message: 'Please input IP address' },
                  { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Invalid IP address format' }
                ]}
              >
                <Input 
                  placeholder="192.168.1.100" 
                  disabled={dhcpEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Subnet Mask"
                name="subnetMask"
                rules={[
                  { required: !dhcpEnabled, message: 'Please input subnet mask' },
                  { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Invalid subnet mask format' }
                ]}
              >
                <Input 
                  placeholder="255.255.255.0" 
                  disabled={dhcpEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Default Gateway"
                name="gateway"
                rules={[
                  { required: !dhcpEnabled, message: 'Please input gateway' },
                  { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Invalid gateway format' }
                ]}
              >
                <Input 
                  placeholder="192.168.1.1" 
                  disabled={dhcpEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="MAC Address"
                name="macAddress"
              >
                <Input 
                  disabled 
                  size="large"
                  style={{ color: '#000' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">DNS Configuration</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Primary DNS Server"
                name="primaryDNS"
                rules={[
                  { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Invalid DNS format' }
                ]}
              >
                <Input 
                  placeholder="8.8.8.8" 
                  disabled={dhcpEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Secondary DNS Server"
                name="secondaryDNS"
                rules={[
                  { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Invalid DNS format' }
                ]}
              >
                <Input 
                  placeholder="8.8.4.4" 
                  disabled={dhcpEnabled}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Changes will take effect after saving and may require device restart
            </Text>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsNetwork;
