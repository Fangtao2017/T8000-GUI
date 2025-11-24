import React, { useState } from 'react';
import { Card, Form, Button, Space, Divider, Typography, Row, Col, message, InputNumber, Progress, Upload, Alert } from 'antd';
import { SaveOutlined, ReloadOutlined, CloudUploadOutlined, RocketOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;

interface SystemGeneralConfig {
  nwk_timeout: number;
  ack_timeout: number;
  report_offset: number;
  log_per_reporting: number;
  max_pkt_size: number;
}

const SettingsSystem: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock current firmware and system configuration
  const currentFirmware = 'v1.32.3.2';
  const currentConfig: SystemGeneralConfig = {
    nwk_timeout: 3600,
    ack_timeout: 60,
    report_offset: 5,
    log_per_reporting: 18,
    max_pkt_size: 1024
  };

  const handleSave = async (values: SystemGeneralConfig) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('System settings saved:', values);
      message.success('System settings saved successfully!');
    } catch {
      message.error('Failed to save system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue({
      nwk_timeout: 3600,
      ack_timeout: 60,
      report_offset: 5,
      log_per_reporting: 18,
      max_pkt_size: 1024
    });
    message.info('Settings reset to current values');
  };

  const uploadProps: UploadProps = {
    name: 'firmware',
    accept: '.bin,.hex',
    maxCount: 1,
    beforeUpload: (file) => {
      const isValidType = file.name.endsWith('.bin') || file.name.endsWith('.hex');
      if (!isValidType) {
        message.error('Only .bin or .hex firmware files are allowed!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Firmware file must be smaller than 10MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      if (info.file.status === 'uploading') {
        setUploading(true);
        setUploadProgress(50);
      }
      if (info.file.status === 'done') {
        setUploading(false);
        setUploadProgress(100);
        message.success(`${info.file.name} uploaded successfully`);
      } else if (info.file.status === 'error') {
        setUploading(false);
        setUploadProgress(0);
        message.error(`${info.file.name} upload failed`);
      }
    },
    customRequest: async ({ file, onSuccess, onError, onProgress }) => {
      setUploading(true);
      try {
        // Simulate firmware upload
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadProgress(i);
          if (onProgress) {
            onProgress({ percent: i });
          }
        }
        message.success(`Firmware ${(file as File).name} uploaded and installed successfully!`);
        if (onSuccess) {
          onSuccess('ok');
        }
      } catch (error) {
        message.error('Firmware update failed');
        if (onError) {
          onError(error as Error);
        }
      } finally {
        setUploading(false);
        setTimeout(() => setUploadProgress(0), 2000);
      }
    },
  };

  React.useEffect(() => {
    form.setFieldsValue({
      nwk_timeout: 3600,
      ack_timeout: 60,
      report_offset: 5,
      log_per_reporting: 18,
      max_pkt_size: 1024
    });
  }, [form]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Alert
        message="Under Development"
        description="This page is currently under development. Features may be incomplete or subject to change."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />
      {/* Firmware Information */}
      <Card 
        bordered 
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <Row gutter={24} align="middle">
          <Col span={12}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>Current Firmware Version</Text>
              <Space align="center">
                <RocketOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Text strong style={{ fontSize: 20 }}>{currentFirmware}</Text>
              </Space>
            </Space>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Upload {...uploadProps} showUploadList={false}>
              <Button 
                type="primary" 
                icon={<CloudUploadOutlined />} 
                size="large"
                loading={uploading}
              >
                Update Firmware
              </Button>
            </Upload>
            {uploadProgress > 0 && (
              <div style={{ marginTop: 12 }}>
                <Progress 
                  percent={uploadProgress} 
                  status={uploadProgress === 100 ? 'success' : 'active'}
                  size="small"
                />
              </div>
            )}
          </Col>
        </Row>
      </Card>

      {/* System General Configuration */}
      <Card 
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>System General Settings</Title>
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
          <Divider orientation="left">Timeout Configuration</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Network Timeout (nwk_timeout)"
                name="nwk_timeout"
                tooltip="Duration from last heard to determine if the nwk_status is down"
                rules={[{ required: true, message: 'Please input network timeout' }]}
              >
                <InputNumber 
                  addonAfter="seconds"
                  placeholder="3600" 
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  max={86400}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="ACK Timeout (ack_timeout)"
                name="ack_timeout"
                tooltip="Timeout of waiting for ack after sending message (Range: 0-255s)"
                rules={[{ required: true, message: 'Please input ACK timeout' }]}
              >
                <InputNumber 
                  addonAfter="seconds"
                  placeholder="60" 
                  size="large"
                  style={{ width: '100%' }}
                  min={0}
                  max={255}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Reporting Configuration</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Report Offset (report_offset)"
                name="report_offset"
                tooltip="Offset time for reporting (reporting time = report_intvl + reporting_offset)"
                rules={[{ required: true, message: 'Please input report offset' }]}
              >
                <InputNumber 
                  addonAfter="minutes"
                  placeholder="5" 
                  size="large"
                  style={{ width: '100%' }}
                  min={0}
                  max={60}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Logs Per Reporting (log_per_reporting)"
                name="log_per_reporting"
                tooltip="Number of logs (scheduled/health) to send per reporting"
                rules={[{ required: true, message: 'Please input logs per reporting' }]}
              >
                <InputNumber 
                  addonAfter="logs"
                  placeholder="18" 
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Packet Configuration</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Max Packet Size (max_pkt_size)"
                name="max_pkt_size"
                tooltip="Max data size per packet during reporting (max is 4096 bytes)"
                rules={[{ required: true, message: 'Please input max packet size' }]}
              >
                <InputNumber 
                  addonAfter="bytes"
                  placeholder="1024" 
                  size="large"
                  style={{ width: '100%' }}
                  min={256}
                  max={4096}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 Changes will take effect after saving. Some settings may require device restart.
            </Text>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsSystem;
