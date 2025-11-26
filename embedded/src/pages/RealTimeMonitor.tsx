import React, { useState } from 'react';
import { 
  Tabs, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Statistic, 
  Tag, 
  Badge, 
  Space, 
  Empty,
  Button,
  Input,
  Breadcrumb,
  Drawer,
  Descriptions,
  Switch,
  Slider,
  message,
  Select
} from 'antd';
import { 
  EnvironmentOutlined, 
  AppstoreOutlined, 
  ReloadOutlined,
  ArrowLeftOutlined,
  BulbOutlined,
  MoreOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { allDevices, parameterUnits } from '../data/devicesData';
import type { DeviceData } from '../data/devicesData';

const { Title, Text } = Typography;
const { Option } = Select;

// --- Types ---
interface LocationFilters {
  types: string[];
  status: 'all' | 'online' | 'offline';
  alarm: 'all' | 'alarm' | 'normal';
}

interface TypeFilters {
  types: string[];
  locations: string[];
  status: 'all' | 'online' | 'offline';
  alarm: 'all' | 'alarm' | 'normal';
  sortBy: 'default' | 'valueAsc' | 'valueDesc' | 'updated' | 'name';
}

// --- Styles ---
const cardStyle = {
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  border: 'none',
  transition: 'all 0.3s ease',
  height: '100%',
  overflow: 'hidden',
  background: '#FFFFFF'
};

const cardHoverStyle = {
  transform: 'scale(1.01)',
  boxShadow: '0 6px 18px rgba(0,0,0,0.10)',
  cursor: 'pointer'
};

// --- Helper Functions ---

// Extract unique locations from devices
const getUniqueLocations = (devices: DeviceData[]) => {
  const locations = new Set(devices.map(d => d.location));
  return Array.from(locations).sort();
};

// Infer sensor type based on parameters or model
const getDeviceType = (device: DeviceData): string => {
  if (device.parameters?.temperature !== undefined) return 'Temperature';
  if (device.parameters?.humidity !== undefined) return 'Humidity';
  if (device.parameters?.power !== undefined || device.parameters?.voltage !== undefined) return 'Power';
  if (device.parameters?.level !== undefined || device.parameters?.pressure !== undefined) return 'Water/Pressure';
  if (device.parameters?.input1 !== undefined) return 'I/O Module';
  if (device.model.includes('OCC')) return 'Occupancy';
  return 'Other';
};

// Filter devices based on criteria
const filterDevices = (
  devices: DeviceData[], 
  filters: LocationFilters | TypeFilters, 
  searchText: string,
  mode: 'location' | 'type'
) => {
  return devices.filter(d => {
    // 1. Search Text
    const safeSearch = (searchText || '').toLowerCase();
    const matchesSearch = 
      (d.name?.toLowerCase() || '').includes(safeSearch) || 
      (d.model?.toLowerCase() || '').includes(safeSearch);
    if (!matchesSearch) return false;

    // 2. Status
    if (filters.status !== 'all') {
      if (filters.status === 'online' && d.status !== 'online') return false;
      if (filters.status === 'offline' && d.status !== 'offline') return false;
    }

    // 3. Alarm
    if (filters.alarm !== 'all') {
      const isAlarm = d.alarm_state === 'Active Alarm';
      if (filters.alarm === 'alarm' && !isAlarm) return false;
      if (filters.alarm === 'normal' && isAlarm) return false;
    }

    // 4. Mode Specific
    if (mode === 'location') {
      const locFilters = filters as LocationFilters;
      if (locFilters.types.length > 0) {
        const type = getDeviceType(d);
        if (!locFilters.types.includes(type)) return false;
      }
    } else {
      const typeFilters = filters as TypeFilters;
      if (typeFilters.locations.length > 0) {
        if (!typeFilters.locations.includes(d.location)) return false;
      }
      if (typeFilters.types && typeFilters.types.length > 0) {
        const type = getDeviceType(d);
        if (!typeFilters.types.includes(type)) return false;
      }
    }

    return true;
  });
};

// Get primary value for display
const getPrimaryValue = (device: DeviceData) => {
  if (!device.parameters) return { label: 'Status', value: device.status };
  
  if (device.parameters.temperature !== undefined) return { label: 'Temp', value: `${device.parameters.temperature}°C` };
  if (device.parameters.power !== undefined) return { label: 'Power', value: `${device.parameters.power}W` };
  if (device.parameters.level !== undefined) return { label: 'Level', value: `${device.parameters.level}%` };
  if (device.parameters.input1 !== undefined) return { label: 'Input 1', value: device.parameters.input1 };
  
  const firstKey = Object.keys(device.parameters)[0];
  return { label: firstKey, value: device.parameters[firstKey] };
};

// --- Components ---

// Device Card Component (Reusable)
const DeviceCard: React.FC<{ device: DeviceData; onClick: () => void }> = ({ device, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const primary = getPrimaryValue(device);
  const isAlarm = device.alarm_state === 'Active Alarm';
  const isOffline = device.status === 'offline';

  // Quick Actions Logic (Mock)
  const renderQuickActions = () => {
    if (device.model === 'T-DIM-01') {
      const brightness = Number(device.parameters?.brightness) || 50;
      return (
        <div style={{ marginTop: 16 }} onClick={e => e.stopPropagation()}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <BulbOutlined style={{ color: isOffline ? '#ccc' : '#faad14' }} />
            <Slider 
              style={{ flex: 1, margin: '0 12px' }} 
              defaultValue={brightness} 
              disabled={isOffline} 
              trackStyle={{ backgroundColor: '#faad14' }}
              handleStyle={{ borderColor: '#faad14' }}
            />
            <Switch size="small" defaultChecked disabled={isOffline} style={{ backgroundColor: isOffline ? undefined : '#52c41a' }} />
          </Space>
        </div>
      );
    }
    if (device.model === 'T-ACP-01') {
      return (
        <div style={{ marginTop: 16 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', padding: '4px 12px', borderRadius: '20px' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>Set Temp</Text>
            <Space>
              <Button size="small" type="text" shape="circle" icon="-" disabled={isOffline} style={{ fontWeight: 'bold' }} />
              <Text strong>{device.parameters?.setTemp}°C</Text>
              <Button size="small" type="text" shape="circle" icon="+" disabled={isOffline} style={{ fontWeight: 'bold' }} />
            </Space>
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusColor = () => {
    if (isOffline) return '#d9d9d9';
    if (isAlarm) return '#ff4d4f';
    return '#52c41a';
  };

  const getStatusText = () => {
    if (isOffline) return 'OFFLINE';
    if (isAlarm) return 'ALARM';
    return 'NORMAL';
  };

  return (
    <Card
      style={{ 
        ...cardStyle,
        ...(isHovered ? cardHoverStyle : {}),
        border: isAlarm ? '1px solid #ffccc7' : 'none',
        opacity: isOffline ? 0.8 : 1,
      }}
      bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* A) Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge color={getStatusColor()} />
            <Text strong style={{ fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {device.name}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 16, display: 'block' }}>
            {device.model}
          </Text>
        </div>
        <Button type="text" icon={<MoreOutlined />} size="small" style={{ color: '#999' }} />
      </div>

      {/* B) Card Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            color: isAlarm ? '#ff4d4f' : isOffline ? '#999' : '#1f1f1f',
            lineHeight: 1
          }}>
            {String(primary.value).replace(/[^\d.-]/g, '')}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase' }}>
            {String(primary.value).replace(/[\d.-]/g, '')}
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
          {primary.label}
        </Text>
      </div>

      {/* C) Card Footer */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag 
            color={isAlarm ? 'error' : isOffline ? 'default' : 'success'} 
            style={{ borderRadius: '12px', padding: '0 10px', border: 'none', fontWeight: 600 }}
          >
            {getStatusText()}
          </Tag>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {device.lastReport}
          </Text>
        </div>
        {renderQuickActions()}
      </div>
    </Card>
  );
};

// Step 1: Location Grid View
const LocationGridView: React.FC<{ 
  searchText: string;
  filters: LocationFilters;
  onSelectLocation: (loc: string) => void; 
}> = ({ searchText, filters, onSelectLocation }) => {
  const locations = getUniqueLocations(allDevices);
  
  // We don't filter locations themselves, but we check if they have matching devices
  // However, if a location has 0 matching devices, should we show it?
  // Requirement: "Do NOT hide whole location cards. Instead, show each location card with: total sensors, filtered sensors count"
  
  // But we should probably respect the search text if it matches the location name directly?
  // Or does search text only apply to devices? 
  // Let's assume search text applies to location name OR device name.
  
  const visibleLocations = locations.filter(loc => {
    if (!searchText) return true;
    // Match location name
    if (loc.toLowerCase().includes(searchText.toLowerCase())) return true;
    // Or match any device in that location
    const locDevices = allDevices.filter(d => d.location === loc);
    return locDevices.some(d => d.name.toLowerCase().includes(searchText.toLowerCase()) || d.model.toLowerCase().includes(searchText.toLowerCase()));
  });

  if (visibleLocations.length === 0) {
    return <Empty description="No locations found" style={{ padding: 48 }} />;
  }

  return (
    <Row gutter={[16, 16]}>
      {visibleLocations.map(location => {
        const locDevices = allDevices.filter(d => d.location === location);
        const filteredLocDevices = filterDevices(locDevices, filters, searchText, 'location');
        
        const total = locDevices.length;
        const matching = filteredLocDevices.length;
        
        // Stats based on FILTERED devices or ALL devices?
        // Usually stats on the card reflect the current view.
        const online = filteredLocDevices.filter(d => d.status === 'online').length;
        const alarms = filteredLocDevices.filter(d => d.alarm_state === 'Active Alarm').length;
        
        // Visual indicator for issues (alarms or offline) in the FILTERED set
        const hasIssue = alarms > 0 || online < matching;
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [hovered, setHovered] = useState(false);

        return (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={location}>
            <Card
              style={{ 
                ...cardStyle,
                ...(hovered ? cardHoverStyle : {}),
                borderTop: hasIssue ? `4px solid ${alarms > 0 ? '#ff4d4f' : '#faad14'}` : '4px solid #52c41a',
                opacity: matching === 0 ? 0.6 : 1
              }}
              bodyStyle={{ padding: '16px' }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => onSelectLocation(location)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text strong style={{ fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{location}</Text>
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', 
                  background: '#f0f5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <EnvironmentOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                </div>
              </div>

              <Row gutter={8} style={{ textAlign: 'center' }}>
                <Col span={8}>
                  <Statistic 
                    title={<Text type="secondary" style={{ fontSize: 11 }}>Total</Text>}
                    value={total} 
                    valueStyle={{ fontSize: 18, fontWeight: 600 }}
                  />
                </Col>
                <Col span={16}>
                   <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                      <Text type="secondary" style={{ fontSize: 11 }}>Matching Filters</Text>
                      <div style={{ fontSize: 18, fontWeight: 600 }}>
                        {matching} <span style={{ fontSize: 12, color: '#999', fontWeight: 400 }}>/ {total}</span>
                      </div>
                   </div>
                </Col>
              </Row>
              
              {matching > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-around' }}>
                   <Text type="secondary" style={{ fontSize: 11 }}>
                     <span style={{ color: '#52c41a', fontWeight: 600 }}>{online}</span> Online
                   </Text>
                   <Text type="secondary" style={{ fontSize: 11 }}>
                     <span style={{ color: alarms > 0 ? '#ff4d4f' : '#999', fontWeight: 600 }}>{alarms}</span> Alarms
                   </Text>
                </div>
              )}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

// Step 2: Location Detail View
const LocationDetailView: React.FC<{ 
  location: string; 
  searchText: string;
  filters: LocationFilters;
  onBack: () => void; 
  onSelectDevice: (d: DeviceData) => void 
}> = ({ location, searchText, filters, onBack, onSelectDevice }) => {
  const devices = allDevices.filter(d => d.location === location);
  const filteredDevices = filterDevices(devices, filters, searchText, 'location');
  
  // Simple stats for this location (based on filtered)
  const online = filteredDevices.filter(d => d.status === 'online').length;
  const alarms = filteredDevices.filter(d => d.alarm_state === 'Active Alarm').length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb items={[
          { title: <a onClick={onBack}>Locations</a> },
          { title: location }
        ]} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
          <Space align="center">
            <Button icon={<ArrowLeftOutlined />} onClick={onBack} shape="circle" />
            <Title level={3} style={{ margin: 0 }}>{location}</Title>
            <Tag color={alarms > 0 ? 'orange' : 'green'}>
              {alarms > 0 ? `${alarms} Active Alarms` : 'System Normal'}
            </Tag>
          </Space>
          <Space size="large">
            <Statistic title="Matching" value={filteredDevices.length} suffix={`/ ${devices.length}`} valueStyle={{ fontSize: 16 }} />
            <Statistic title="Online" value={online} valueStyle={{ fontSize: 16, color: '#52c41a' }} />
            <Statistic title="Alarms" value={alarms} valueStyle={{ fontSize: 16, color: alarms > 0 ? '#faad14' : undefined }} />
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {filteredDevices.map(device => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={device.key}>
            <DeviceCard device={device} onClick={() => onSelectDevice(device)} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Step 3: Sensor Type View
const SensorTypeView: React.FC<{ 
  searchText: string;
  filters: TypeFilters;
  onSelectDevice: (d: DeviceData) => void 
}> = ({ searchText, filters, onSelectDevice }) => {
  // Filter all devices based on the type filters
  let filteredDevices = filterDevices(allDevices, filters, searchText, 'type');
  
  // Apply Sorting
  if (filters.sortBy !== 'default') {
    filteredDevices = [...filteredDevices].sort((a, b) => {
      const valA = getPrimaryValue(a).value;
      const valB = getPrimaryValue(b).value;
      // Simple numeric extraction for sorting
      const numA = parseFloat(String(valA).replace(/[^\d.-]/g, '')) || 0;
      const numB = parseFloat(String(valB).replace(/[^\d.-]/g, '')) || 0;
      
      if (filters.sortBy === 'valueAsc') return numA - numB;
      if (filters.sortBy === 'valueDesc') return numB - numA;
      if (filters.sortBy === 'updated') return a.lastReport.localeCompare(b.lastReport);
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }

  if (filteredDevices.length === 0) {
    return <Empty description="No devices found" image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 48 }} />;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        {filteredDevices.map(device => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={device.key}>
            <DeviceCard device={device} onClick={() => onSelectDevice(device)} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Main Component
const RealTimeMonitor: React.FC = () => {
  const [viewMode, setViewMode] = useState<'location' | 'type'>('location');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Filter States
  const [locationFilters, setLocationFilters] = useState<LocationFilters>({
    types: [],
    status: 'all',
    alarm: 'all'
  });

  const [typeFilters, setTypeFilters] = useState<TypeFilters>({
    types: [],
    locations: [],
    status: 'all',
    alarm: 'all',
    sortBy: 'default'
  });

  const handleDeviceClick = (device: DeviceData) => {
    setSelectedDevice(device);
    setDrawerVisible(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    message.success('Data refreshed successfully');
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate global stats
  const totalDevices = allDevices.length;
  const onlineDevices = allDevices.filter(d => d.status === 'online').length;
  const offlineDevices = totalDevices - onlineDevices;
  const activeAlarms = allDevices.filter(d => d.alarm_state === 'Active Alarm').length;

  // Calculate display count
  let displayCount = 0;
  if (viewMode === 'location') {
    if (selectedLocation) {
       const devices = allDevices.filter(d => d.location === selectedLocation);
       displayCount = filterDevices(devices, locationFilters, searchText, 'location').length;
    } else {
       // Count locations that are visible
       const locations = getUniqueLocations(allDevices);
       displayCount = locations.filter(loc => {
          if (!searchText) return true;
          if (loc.toLowerCase().includes(searchText.toLowerCase())) return true;
          const locDevices = allDevices.filter(d => d.location === loc);
          return locDevices.some(d => d.name.toLowerCase().includes(searchText.toLowerCase()) || d.model.toLowerCase().includes(searchText.toLowerCase()));
       }).length;
    }
  } else {
     // For type view, we count total matching devices across all types? 
     // Or just show total devices matching filters?
     displayCount = filterDevices(allDevices, typeFilters, searchText, 'type').length;
  }

  const uniqueTypes = ['Temperature', 'Humidity', 'Power', 'Water/Pressure', 'Occupancy', 'I/O Module', 'Other'];
  const uniqueLocations = getUniqueLocations(allDevices);

  return (
    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 1600, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* LAYER 1: INFO BAR */}
      <div style={{ 
        backgroundColor: '#fff', 
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        flexShrink: 0
      }}>
        <Space size={24} style={{ flexWrap: 'wrap' }}>
          <Typography.Text strong style={{ fontSize: 16 }}>System Status</Typography.Text>
          
          <Space split={<Typography.Text type="secondary">|</Typography.Text>} size={16}>
            <Typography.Text>Total Sensors: <strong>{totalDevices}</strong></Typography.Text>
            <Typography.Text>Online: <strong>{onlineDevices}</strong></Typography.Text>
            <Typography.Text>Offline: <strong>{offlineDevices}</strong></Typography.Text>
            <Typography.Text>Active Alarms: <strong>{activeAlarms}</strong></Typography.Text>
          </Space>
        </Space>

        <Typography.Text type="secondary">Last Update: Just now</Typography.Text>
      </div>

      {/* LAYER 2: TOOLBAR */}
      <Card bordered bodyStyle={{ padding: '16px' }} style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            {/* View Switcher */}
            <Tabs 
              activeKey={viewMode} 
              onChange={(key) => {
                setViewMode(key as 'location' | 'type');
                setSelectedLocation(null);
                setSearchText('');
              }}
              items={[
                { key: 'location', label: <span><EnvironmentOutlined /> By Location</span> },
                { key: 'type', label: <span><AppstoreOutlined /> By Sensor Type</span> }
              ]}
              style={{ marginBottom: -16, marginTop: -10 }} 
              tabBarStyle={{ margin: 0, borderBottom: 'none' }}
            />
            
            <div style={{ width: 1, height: 24, background: '#f0f0f0' }} />

            {/* Common Search */}
            <Input 
               placeholder="Search..." 
               prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
               value={searchText}
               onChange={e => setSearchText(e.target.value)}
               style={{ width: 200 }}
               allowClear
            />

            {/* Mode Specific Filters */}
            {viewMode === 'location' ? (
              <>
                <Select
                  mode="multiple"
                  placeholder="Sensor Type"
                  style={{ minWidth: 140, maxWidth: 240 }}
                  value={locationFilters.types}
                  onChange={vals => setLocationFilters(prev => ({ ...prev, types: vals }))}
                  maxTagCount="responsive"
                  allowClear
                >
                  {uniqueTypes.map(t => <Option key={t} value={t}>{t}</Option>)}
                </Select>
                <Select
                  placeholder="Status"
                  style={{ width: 130 }}
                  value={locationFilters.status}
                  onChange={val => setLocationFilters(prev => ({ ...prev, status: val }))}
                  optionLabelProp="label"
                >
                  <Option value="all" label="Status: All">All</Option>
                  <Option value="online" label="Status: Online">Online</Option>
                  <Option value="offline" label="Status: Offline">Offline</Option>
                </Select>
                <Select
                  placeholder="Alarm"
                  style={{ width: 130 }}
                  value={locationFilters.alarm}
                  onChange={val => setLocationFilters(prev => ({ ...prev, alarm: val }))}
                  optionLabelProp="label"
                >
                  <Option value="all" label="Alarm: All">All</Option>
                  <Option value="alarm" label="Alarm: Yes">Has Alarm</Option>
                  <Option value="normal" label="Alarm: No">Normal</Option>
                </Select>
              </>
            ) : (
              <>
                <Select
                  mode="multiple"
                  placeholder="Location"
                  style={{ minWidth: 140, maxWidth: 240 }}
                  value={typeFilters.locations}
                  onChange={vals => setTypeFilters(prev => ({ ...prev, locations: vals }))}
                  maxTagCount="responsive"
                  allowClear
                >
                  {uniqueLocations.map(l => <Option key={l} value={l}>{l}</Option>)}
                </Select>
                <Select
                  mode="multiple"
                  placeholder="Sensor Type"
                  style={{ minWidth: 140, maxWidth: 240 }}
                  value={typeFilters.types}
                  onChange={vals => setTypeFilters(prev => ({ ...prev, types: vals }))}
                  maxTagCount="responsive"
                  allowClear
                >
                  {uniqueTypes.map(t => <Option key={t} value={t}>{t}</Option>)}
                </Select>
                <Select
                  placeholder="Status"
                  style={{ width: 130 }}
                  value={typeFilters.status}
                  onChange={val => setTypeFilters(prev => ({ ...prev, status: val }))}
                  optionLabelProp="label"
                >
                  <Option value="all" label="Status: All">All</Option>
                  <Option value="online" label="Status: Online">Online</Option>
                  <Option value="offline" label="Status: Offline">Offline</Option>
                </Select>
                <Select
                  placeholder="Alarm"
                  style={{ width: 130 }}
                  value={typeFilters.alarm}
                  onChange={val => setTypeFilters(prev => ({ ...prev, alarm: val }))}
                  optionLabelProp="label"
                >
                  <Option value="all" label="Alarm: All">All</Option>
                  <Option value="alarm" label="Alarm: Yes">Has Alarm</Option>
                  <Option value="normal" label="Alarm: No">Normal</Option>
                </Select>
                <Select
                  placeholder="Sort By"
                  style={{ width: 160 }}
                  value={typeFilters.sortBy}
                  onChange={val => setTypeFilters(prev => ({ ...prev, sortBy: val }))}
                  optionLabelProp="label"
                >
                  <Option value="default" label="Sort: Default">Default</Option>
                  <Option value="valueAsc" label="Sort: Value (Low)">Value (Low-High)</Option>
                  <Option value="valueDesc" label="Sort: Value (High)">Value (High-Low)</Option>
                  <Option value="updated" label="Sort: Updated">Last Updated</Option>
                  <Option value="name" label="Sort: Name">Name (A-Z)</Option>
                </Select>
              </>
            )}
            
            <Typography.Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
               {viewMode === 'location' && !selectedLocation ? 'Locations: ' : 'Devices: '} 
               {displayCount}
            </Typography.Text>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing}>
               Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* LAYER 3: MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 24 }}>
        {viewMode === 'location' && (
          selectedLocation ? (
            <LocationDetailView 
              location={selectedLocation} 
              searchText={searchText}
              filters={locationFilters}
              onBack={() => setSelectedLocation(null)}
              onSelectDevice={handleDeviceClick}
            />
          ) : (
            <LocationGridView 
               searchText={searchText}
               filters={locationFilters}
               onSelectLocation={setSelectedLocation} 
            />
          )
        )}

        {viewMode === 'type' && (
          <SensorTypeView 
             searchText={searchText}
             filters={typeFilters}
             onSelectDevice={handleDeviceClick} 
          />
        )}
      </div>

      {/* Device Detail Drawer */}
      <Drawer
        title={selectedDevice?.name}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        {selectedDevice && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', padding: '20px 0', background: '#f5f5f5', borderRadius: 8 }}>
              <Text type="secondary">Current Reading</Text>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: '#1890ff' }}>
                {getPrimaryValue(selectedDevice).value}
              </div>
              <Tag color={selectedDevice.status === 'online' ? 'green' : 'red'}>
                {selectedDevice.status.toUpperCase()}
              </Tag>
            </div>

            <Descriptions title="Device Info" column={1} bordered size="small">
              <Descriptions.Item label="Model">{selectedDevice.model}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedDevice.location}</Descriptions.Item>
              <Descriptions.Item label="Serial No">{selectedDevice.serialNumber}</Descriptions.Item>
              <Descriptions.Item label="Last Report">{selectedDevice.lastReport}</Descriptions.Item>
            </Descriptions>

            {selectedDevice.parameters && (
              <Descriptions title="All Parameters" column={1} bordered size="small">
                {Object.entries(selectedDevice.parameters).map(([key, val]) => (
                  <Descriptions.Item label={key} key={key}>
                    {val} {parameterUnits[key] || ''}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            )}

            <div style={{ marginTop: 20 }}>
              <Button type="primary" block onClick={() => setDrawerVisible(false)}>
                Close
              </Button>
            </div>
          </Space>
        )}
      </Drawer>
      </div>
    </div>
  );
};

export default RealTimeMonitor;
