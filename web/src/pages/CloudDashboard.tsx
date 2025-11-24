import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Button, Space, Badge, Flex, Switch } from 'antd';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  EnvironmentOutlined, 
  CloudServerOutlined, 
  AlertOutlined, 
  ThunderboltOutlined,
  RightOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { sites, getGlobalStats, cloudGateways, getSiteStats } from '../data/cloudData';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const { Title, Text } = Typography;

const CloudDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  
  // Safety check
  if (!sites || !getGlobalStats) {
    return <div>Loading configuration...</div>;
  }

  const globalStats = getGlobalStats();

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  const filteredGateways = selectedSiteId 
    ? cloudGateways.filter(g => g.loc_id === selectedSiteId)
    : cloudGateways;

  const selectedSite = selectedSiteId ? sites.find(s => s.id === selectedSiteId) : null;

  return (
    <div style={{ padding: '16px 24px', maxWidth: 1600, margin: '0 auto' }}>
      {/* 1. Global Stats Header - Compact */}
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} size="small" style={{ background: '#1890ff' }} bodyStyle={{ padding: '12px 24px' }}>
              <Statistic 
                title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Total Sites</span>}
                value={globalStats.totalSites} 
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#fff', fontSize: 20 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} size="small" style={{ background: '#52c41a' }} bodyStyle={{ padding: '12px 24px' }}>
              <Statistic 
                title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Online Gateways</span>}
                value={globalStats.onlineDevices} 
                suffix={`/ ${globalStats.totalDevices}`}
                prefix={<CloudServerOutlined />}
                valueStyle={{ color: '#fff', fontSize: 20 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} size="small" style={{ background: '#ff4d4f' }} bodyStyle={{ padding: '12px 24px' }}>
              <Statistic 
                title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Active Alarms</span>}
                value={globalStats.activeAlarms} 
                prefix={<AlertOutlined />}
                valueStyle={{ color: '#fff', fontSize: 20 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} size="small" style={{ background: '#faad14' }} bodyStyle={{ padding: '12px 24px' }}>
              <Statistic 
                title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Total Energy (Today)</span>}
                value={12450} 
                suffix="kWh"
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: '#fff', fontSize: 20 }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Row gutter={24}>
        {/* Left Column: Map */}
        <Col xs={24} xl={14}>
          <Card 
            size="small" 
            title={<Space><GlobalOutlined /> Live Map View (Singapore)</Space>}
            extra={<Switch checkedChildren="Map On" unCheckedChildren="Map Off" checked={showMap} onChange={setShowMap} />}
            style={{ height: 'calc(100vh - 240px)', minHeight: 300, display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ padding: 0, display: showMap ? 'block' : 'none', flex: 1 }}
          >
             <MapContainer center={[1.3521, 103.8198]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {sites.map(site => {
                  const stats = getSiteStats(site.id);
                  
                  // Determine status color
                  const hasAlarm = stats.alarms > 0;
                  const isAllOffline = stats.online === 0;
                  const color = hasAlarm ? '#ff4d4f' : (isAllOffline ? '#bfbfbf' : '#1890ff');

                  // Create modern dot icon
                  const customIcon = L.divIcon({
                    className: 'custom-site-marker',
                    html: `<div style="
                      background-color: ${color};
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      border: 3px solid white;
                      box-shadow: 0 0 0 4px ${color}40, 0 2px 6px rgba(0,0,0,0.3);
                    "></div>`,
                    iconSize: [18, 18],
                    iconAnchor: [9, 9],
                    popupAnchor: [0, -9]
                  });

                  return (
                    <Marker 
                      key={site.id} 
                      position={[site.coordinates[0], site.coordinates[1]]}
                      icon={customIcon}
                    >
                      <Popup>
                        <div style={{ minWidth: 180 }}>
                          <Text strong style={{ fontSize: 16 }}>{site.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>{site.location}</Text>
                          <div style={{ marginTop: 8, marginBottom: 8, padding: '8px', background: '#f5f5f5', borderRadius: 4 }}>
                            <Space direction="vertical" size={0} style={{ width: '100%' }}>
                              <Flex justify="space-between">
                                <Text>Total Gateways:</Text>
                                <Text strong>{stats.total}</Text>
                              </Flex>
                              <Flex justify="space-between">
                                <Text type="success">Online:</Text>
                                <Text type="success" strong>{stats.online}</Text>
                              </Flex>
                              {stats.alarms > 0 && (
                                <Flex justify="space-between">
                                  <Text type="danger">Alarms:</Text>
                                  <Text type="danger" strong>{stats.alarms}</Text>
                                </Flex>
                              )}
                            </Space>
                          </div>
                          <Button 
                            type="primary" 
                            size="small" 
                            block
                            onClick={() => setSelectedSiteId(site.id)}
                          >
                            View Site Details
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
             </MapContainer>
          </Card>
        </Col>

        {/* Right Column: Gateways List */}
        <Col xs={24} xl={10}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              {selectedSite ? `Gateways at ${selectedSite.name}` : 'All Gateways'}
            </Title>
            {selectedSiteId && (
              <Button type="link" onClick={() => setSelectedSiteId(null)}>
                Show All
              </Button>
            )}
          </div>
          
          <Card size="small" bodyStyle={{ padding: 0, flex: 1, overflow: 'hidden' }} style={{ height: 'calc(100vh - 290px)', minHeight: 300, display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '100%', overflowY: 'auto' }}>
              <List
                size="small"
                itemLayout="horizontal"
                dataSource={filteredGateways}
                renderItem={device => (
                  <List.Item 
                    actions={[
                      <Button type="link" size="small" onClick={() => handleDeviceClick(device.key)}>
                        Manage <RightOutlined />
                      </Button>
                    ]}
                    style={{ padding: '12px 24px' }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge status={device.status === 'online' ? 'success' : 'default'} dot offset={[2, 2]}>
                          <CloudServerOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                        </Badge>
                      }
                      title={
                        <Space>
                          <a onClick={() => handleDeviceClick(device.key)} style={{ fontSize: 15, fontWeight: 500 }}>{device.name}</a>
                          {device.alarm_state === 'Active Alarm' && <Tag color="error">Alarm</Tag>}
                        </Space>
                      }
                      description={
                        <Space size="large" style={{ fontSize: 12 }}>
                          <Text type="secondary">SN: {device.serialNumber}</Text>
                          <Text type="secondary"><EnvironmentOutlined /> {device.location}</Text>
                        </Space>
                      }
                    />
                    <div style={{ textAlign: 'right', minWidth: 80 }}>
                       <Statistic 
                          value={device.parameters?.power || 0} 
                          suffix="W" 
                          valueStyle={{ fontSize: 16 }} 
                        />
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CloudDashboard;
