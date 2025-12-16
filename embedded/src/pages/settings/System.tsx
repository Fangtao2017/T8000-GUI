import React, { useState } from 'react';
import { Card, Form, Button, Space, Typography, Row, Col, message, InputNumber, Progress, Upload, Tag } from 'antd';
import { SaveOutlined, ReloadOutlined, CloudUploadOutlined, RocketOutlined, PoweroffOutlined, RedoOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Text } = Typography;

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
  const currentFirmware: string = 'v1.32.3.2';
  const latestFirmware: string = 'v1.32.3.5'; // Mock latest version
  const isLatest = currentFirmware === latestFirmware;

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

  const handleRestartT8000 = () => {
    message.warning('Restart T8000 - This feature will be implemented');
  };

  const handleShutdown = () => {
    message.warning('Shutdown - This feature will be implemented');
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
      {/* Firmware Information */}
      <Card 
        bordered 
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Row gutter={24} align="middle">
          <Col span={12}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: 12 }}>Current Firmware Version</Text>
              <Space align="center">
                <RocketOutlined style={{ fontSize: 20, color: '#003A70' }} />
                <Text strong style={{ fontSize: 16 }}>{currentFirmware}</Text>
                {!isLatest && (
                  <Tag color="warning" style={{ marginLeft: 8 }}>
                    Update Available: {latestFirmware}
                  </Tag>
                )}
              </Space>
            </Space>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button 
                type="primary"
                icon={<PoweroffOutlined />}
                onClick={handleShutdown}
                style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
              >
                Shutdown
              </Button>
              <Button 
                type="primary"
                icon={<RedoOutlined />}
                onClick={handleRestartT8000}
                style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
              >
                Restart T8000
              </Button>
              <Upload {...uploadProps} showUploadList={false}>
                <Button 
                  type="primary" 
                  icon={<CloudUploadOutlined />} 
                  size="middle"
                  loading={uploading}
                  style={{ backgroundColor: '#003A70', borderColor: '#003A70' }}
                >
                  Update Firmware
                </Button>
              </Upload>
            </Space>
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
                label="Network Timeout (nwk_timeout)"
                name="nwk_timeout"
                tooltip="Duration from last heard to determine if the nwk_status is down"
                rules={[{ required: true, message: 'Please input network timeout' }]}
              >
                <InputNumber 
                  addonAfter="seconds"
                  placeholder="3600" 
                  style={{ width: '100%' }}
                  min={1}
                  max={86400}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="ACK Timeout (ack_timeout)"
                name="ack_timeout"
                tooltip="Timeout of waiting for ack after sending message (Range: 0-255s)"
                rules={[{ required: true, message: 'Please input ACK timeout' }]}
              >
                <InputNumber 
                  addonAfter="seconds"
                  placeholder="60" 
                  style={{ width: '100%' }}
                  min={0}
                  max={255}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Max Packet Size (max_pkt_size)"
                name="max_pkt_size"
                tooltip="Max data size per packet during reporting (max is 4096 bytes)"
                rules={[{ required: true, message: 'Please input max packet size' }]}
              >
                <InputNumber 
                  addonAfter="bytes"
                  placeholder="1024" 
                  style={{ width: '100%' }}
                  min={256}
                  max={4096}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Report Offset (report_offset)"
                name="report_offset"
                tooltip="Offset time for reporting (reporting time = report_intvl + reporting_offset)"
                rules={[{ required: true, message: 'Please input report offset' }]}
              >
                <InputNumber 
                  addonAfter="minutes"
                  placeholder="5" 
                  style={{ width: '100%' }}
                  min={0}
                  max={60}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Logs Per Reporting (log_per_reporting)"
                name="log_per_reporting"
                tooltip="Number of logs (scheduled/health) to send per reporting"
                rules={[{ required: true, message: 'Please input logs per reporting' }]}
              >
                <InputNumber 
                  addonAfter="logs"
                  placeholder="18" 
                  style={{ width: '100%' }}
                  min={1}
                  max={100}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsSystem;
