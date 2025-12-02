import React, { useState, useMemo } from 'react';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Space, 
  Empty,
  Button,
  Input,
  Drawer,
  Descriptions,
  Switch,
  Slider,
  message,
  Checkbox,
  Radio,
  Collapse,
  Badge
} from 'antd';
import { 
  ReloadOutlined,
  BulbOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import { allDevices, parameterUnits } from '../data/devicesData';
import type { DeviceData } from '../data/devicesData';

const { Title, Text } = Typography;
const { Sider, Content } = Layout;
const { Panel } = Collapse;

// --- Types ---
interface FilterState {
  locations: string[];
  types: string[];
  status: 'all' | 'online' | 'offline';
  alarm: 'all' | 'alarm' | 'normal';
  search: string;
}

// --- Styles ---
const cardStyle = {
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
  height: '100%',
  overflow: 'hidden',
  background: '#FFFFFF'
};

const cardHoverStyle = {
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  borderColor: '#d9d9d9',
  cursor: 'pointer'
};

// --- Helper Functions ---

const getUniqueLocations = (devices: DeviceData[]) => {
  const locations = new Set(devices.map(d => d.location));
  return Array.from(locations).sort();
};

const getDeviceType = (device: DeviceData): string => {
  if (device.model.includes('OCC')) return 'Occupancy';
  if (device.model.includes('DIM')) return 'Lux'; // Assuming Dimmer relates to Lux/Light
  if (device.model.includes('EMS')) return 'Power Meter';
  if (device.model.includes('TK') || device.model.includes('FM')) return 'Water Meter';
  if (device.parameters?.temperature !== undefined && !device.parameters?.humidity) return 'Temperature';
  if (device.parameters?.humidity !== undefined) return 'Humidity';
  if (device.parameters?.power !== undefined || device.parameters?.voltage !== undefined) return 'Power';
  if (device.parameters?.level !== undefined || device.parameters?.pressure !== undefined) return 'Water/Pressure';
  if (device.parameters?.input1 !== undefined) return 'I/O Module';
  return 'Other';
};

const getPrimaryValue = (device: DeviceData) => {
  if (!device.parameters) return { label: 'Status', value: device.status };
  
  const type = getDeviceType(device);
  
  switch (type) {
    case 'Temperature':
      if (device.parameters.temperature !== undefined) return { label: 'Temp', value: `${device.parameters.temperature}°C` };
      break;
    case 'Humidity':
      if (device.parameters.humidity !== undefined) return { label: 'Humidity', value: `${device.parameters.humidity}%` };
      break;
    case 'Occupancy':
      // Mocking occupancy based on some logic or existing field if available, else default
      // The mock data doesn't have explicit 'occupancy' field, but let's assume it's derived or use a placeholder
      return { label: 'Occupancy', value: 'Occupied' }; 
    case 'Lux':
      if (device.parameters.brightness !== undefined) return { label: 'Lux', value: `${device.parameters.brightness} lx` }; // Mapping brightness to Lux for demo
      break;
    case 'Power Meter':
      if (device.parameters.power !== undefined) return { label: 'Power', value: `${device.parameters.power} W` };
      break;
    case 'Water Meter':
      if (device.parameters.level !== undefined) return { label: 'Level', value: `${device.parameters.level}%` };
      if (device.parameters.pressure !== undefined) return { label: 'Pressure', value: `${device.parameters.pressure} bar` };
      break;
  }

  // Fallbacks
  if (device.parameters.temperature !== undefined) return { label: 'Temp', value: `${device.parameters.temperature}°C` };
  if (device.parameters.power !== undefined) return { label: 'Power', value: `${device.parameters.power}W` };
  if (device.parameters.level !== undefined) return { label: 'Level', value: `${device.parameters.level}%` };
  if (device.parameters.input1 !== undefined) return { label: 'Input 1', value: device.parameters.input1 };
  
  const firstKey = Object.keys(device.parameters)[0];
  return { label: firstKey, value: device.parameters[firstKey] };
};

const getSecondaryValues = (device: DeviceData) => {
  if (!device.parameters) return [];
  const type = getDeviceType(device);
  const secondaries = [];

  // Common secondaries
  if (device.parameters.humidity !== undefined && type !== 'Humidity') {
    secondaries.push({ label: 'Humidity', value: `${device.parameters.humidity}%` });
  }
  if (device.parameters.temperature !== undefined && type !== 'Temperature') {
    secondaries.push({ label: 'Temp', value: `${device.parameters.temperature}°C` });
  }
  if (device.parameters.energy !== undefined) {
    secondaries.push({ label: 'Energy', value: `${device.parameters.energy} kWh` });
  }
  if (device.parameters.voltage !== undefined && type !== 'Power Meter') {
    secondaries.push({ label: 'Voltage', value: `${device.parameters.voltage} V` });
  }
  
  // Limit to 2
  return secondaries.slice(0, 2);
};

const getUniqueTypes = (devices: DeviceData[]) => {
  const types = new Set(devices.map(d => getDeviceType(d)));
  return Array.from(types).sort();
};

// --- Components ---

// Device Card Component
const DeviceCard: React.FC<{ device: DeviceData; onClick: () => void }> = ({ device, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const primary = getPrimaryValue(device);
  const secondaries = getSecondaryValues(device);
  const isAlarm = device.alarm_state === 'Active Alarm';
  const isOffline = device.status === 'offline';

  const renderQuickActions = () => {
    if (device.model === 'T-DIM-01') {
      const brightness = device.parameters?.brightness !== undefined ? Number(device.parameters.brightness) : 50;
      return (
        <div style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <BulbOutlined style={{ color: isOffline ? '#ccc' : '#faad14' }} />
            <Slider 
              style={{ flex: 1, margin: '0 12px' }} 
              defaultValue={brightness} 
              disabled={isOffline} 
              trackStyle={{ backgroundColor: '#faad14' }}
              handleStyle={{ borderColor: '#faad14' }}
            />
            <Switch size="small" defaultChecked disabled={isOffline} style={{ backgroundColor: isOffline ? undefined : '#52c41a' }} />
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

  return (
    <Card
      style={{ 
        ...cardStyle,
        ...(isHovered ? cardHoverStyle : {}),
        borderLeft: `4px solid ${getStatusColor()}`,
      }}
      bodyStyle={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Text strong style={{ fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
            {device.name}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {device.model} • {device.location}
          </Text>
        </div>
        {isAlarm && <Badge status="error" />}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 600, 
            color: isAlarm ? '#ff4d4f' : isOffline ? '#999' : '#1f1f1f',
          }}>
            {String(primary.value).replace(/[^\d.-]/g, '')}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 500, color: '#8c8c8c' }}>
            {String(primary.value).replace(/[\d.-]/g, '')}
          </Text>
        </div>
        <Text type="secondary" style={{ fontSize: 11 }}>
          {primary.label}
        </Text>
        
        {/* Secondary Values */}
        {secondaries.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
            {secondaries.map((sec, idx) => (
              <div key={idx}>
                <Text strong style={{ fontSize: 12, display: 'block' }}>{sec.value}</Text>
                <Text type="secondary" style={{ fontSize: 10 }}>{sec.label}</Text>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag 
            color={isAlarm ? 'error' : isOffline ? 'default' : 'success'} 
            style={{ margin: 0, fontSize: 10, lineHeight: '18px' }}
          >
            {isOffline ? 'OFFLINE' : isAlarm ? 'ALARM' : 'NORMAL'}
          </Tag>
          <Text type="secondary" style={{ fontSize: 10 }}>
            {device.lastReport}
          </Text>
        </div>
        {renderQuickActions()}
      </div>
    </Card>
  );
};

// Filter Panel Component
const FilterPanel: React.FC<{
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  locations: string[];
  types: string[];
  counts: { locations: Record<string, number>; types: Record<string, number> };
}> = ({ filters, onChange, locations, types, counts }) => {
  
  const handleLocationChange = (checkedValues: string[]) => {
    onChange({ ...filters, locations: checkedValues });
  };

  const handleTypeChange = (checkedValues: string[]) => {
    onChange({ ...filters, types: checkedValues });
  };

  return (
    <div style={{ paddingRight: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Filters</Title>
        {(filters.locations.length > 0 || filters.types.length > 0 || filters.status !== 'all' || filters.alarm !== 'all') && (
          <Button 
            type="link" 
            size="small" 
            onClick={() => onChange({ locations: [], types: [], status: 'all', alarm: 'all', search: filters.search })}
            style={{ padding: 0, color: '#003a8c' }}
          >
            Clear All
          </Button>
        )}
      </div>

      <Collapse defaultActiveKey={['status', 'alarm', 'location', 'type']} ghost expandIconPosition="end">
        <Panel header="Sensor Status" key="status">
          <Radio.Group 
            value={filters.status} 
            onChange={e => onChange({ ...filters, status: e.target.value })}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <Radio value="all">All Status</Radio>
            <Radio value="online"><Space><CheckCircleOutlined style={{ color: '#52c41a' }}/> Online</Space></Radio>
            <Radio value="offline"><Space><DisconnectOutlined style={{ color: '#d9d9d9' }}/> Offline</Space></Radio>
          </Radio.Group>
        </Panel>

        <Panel header="Alarm Status" key="alarm">
          <Radio.Group 
            value={filters.alarm} 
            onChange={e => onChange({ ...filters, alarm: e.target.value })}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <Radio value="all">All</Radio>
            <Radio value="alarm"><Space><ExclamationCircleOutlined style={{ color: '#ff4d4f' }}/> Active Alarm</Space></Radio>
            <Radio value="normal"><Space><CheckCircleOutlined style={{ color: '#52c41a' }}/> Normal</Space></Radio>
          </Radio.Group>
        </Panel>

        <Panel header="Location" key="location">
          <Checkbox.Group 
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            value={filters.locations}
            onChange={handleLocationChange}
          >
            {locations.map(loc => (
              <Checkbox key={loc} value={loc}>
                <span style={{ fontSize: 13 }}>{loc} <Text type="secondary" style={{ fontSize: 11 }}>({counts.locations[loc] || 0})</Text></span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Panel>

        <Panel header="Sensor Type" key="type">
          <Checkbox.Group 
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            value={filters.types}
            onChange={handleTypeChange}
          >
            {types.map(type => (
              <Checkbox key={type} value={type}>
                <span style={{ fontSize: 13 }}>{type} <Text type="secondary" style={{ fontSize: 11 }}>({counts.types[type] || 0})</Text></span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Panel>
      </Collapse>
    </div>
  );
};

// Main Component
const RealTimeMonitor: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    locations: [],
    types: [],
    status: 'all',
    alarm: 'all',
    search: ''
  });
  
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Derived Data
  const uniqueLocations = useMemo(() => getUniqueLocations(allDevices), []);
  const uniqueTypes = useMemo(() => getUniqueTypes(allDevices), []);

  // Calculate counts for facets
  const facetCounts = useMemo(() => {
    const locCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    
    allDevices.forEach(d => {
      locCounts[d.location] = (locCounts[d.location] || 0) + 1;
      const t = getDeviceType(d);
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    return { locations: locCounts, types: typeCounts };
  }, []);

  // Filter Logic
  const filteredDevices = useMemo(() => {
    return allDevices.filter(d => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match = d.name.toLowerCase().includes(q) || 
                      d.model.toLowerCase().includes(q) || 
                      d.location.toLowerCase().includes(q);
        if (!match) return false;
      }
      // Status
      if (filters.status === 'online' && d.status !== 'online') return false;
      if (filters.status === 'offline' && d.status !== 'offline') return false;
      // Alarm
      if (filters.alarm === 'alarm' && d.alarm_state !== 'Active Alarm') return false;
      if (filters.alarm === 'normal' && d.alarm_state === 'Active Alarm') return false;
      // Location
      if (filters.locations.length > 0 && !filters.locations.includes(d.location)) return false;
      // Type
      if (filters.types.length > 0 && !filters.types.includes(getDeviceType(d))) return false;

      return true;
    });
  }, [filters]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      message.success('Data refreshed');
    }, 800);
  };

  const removeFilter = (key: keyof FilterState, value?: string) => {
    if (key === 'locations' && value) {
      setFilters(prev => ({ ...prev, locations: prev.locations.filter(l => l !== value) }));
    } else if (key === 'types' && value) {
      setFilters(prev => ({ ...prev, types: prev.types.filter(t => t !== value) }));
    } else if (key === 'status') {
      setFilters(prev => ({ ...prev, status: 'all' }));
    } else if (key === 'alarm') {
      setFilters(prev => ({ ...prev, alarm: 'all' }));
    } else if (key === 'search') {
      setFilters(prev => ({ ...prev, search: '' }));
    }
  };

  return (
    <Layout style={{ height: '100%', background: '#ffffff' }}>
      {/* Mobile Filter Drawer */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setMobileFilterVisible(false)}
        open={mobileFilterVisible}
        width={280}
      >
        <FilterPanel 
          filters={filters} 
          onChange={setFilters} 
          locations={uniqueLocations} 
          types={uniqueTypes}
          counts={facetCounts}
        />
      </Drawer>

      {/* Desktop Sidebar */}
      <Sider 
        width={280} 
        theme="light" 
        breakpoint="lg" 
        collapsedWidth="0"
        onBreakpoint={() => {
          // Could handle layout changes here
        }}
        trigger={null}
        style={{ 
          overflowY: 'auto', 
          height: '100%', 
          position: 'sticky', 
          top: 0, 
          left: 0,
          borderRight: '1px solid #e8e8e8',
          padding: '24px 16px',
          display: 'none' // Hidden by default, shown via media query usually, but AntD Sider handles it.
                          // Actually, let's just use standard Sider behavior.
        }}
        className="desktop-sider" // We can use CSS to hide on mobile if needed, but breakpoint does it.
      >
        <FilterPanel 
          filters={filters} 
          onChange={setFilters} 
          locations={uniqueLocations} 
          types={uniqueTypes}
          counts={facetCounts}
        />
      </Sider>

      <Content style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Fixed Header Section */}
        <div style={{ padding: '24px 24px 0 24px', flexShrink: 0, background: '#ffffff', zIndex: 1 }}>
          <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            {/* Header & Toolbar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <Title level={2} style={{ margin: 0 }}>Sensor Monitoring</Title>
                  <Text type="secondary">Real-time data from {allDevices.length} connected sensors</Text>
                </div>
                <Space>
                  <Button 
                    icon={<FilterOutlined />} 
                    onClick={() => setMobileFilterVisible(true)}
                    className="mobile-filter-btn" // Hide on desktop via CSS if possible, or just leave it
                    style={{ display: 'none' }} // We'll rely on Sider for desktop
                  >
                    Filters
                  </Button>
                  <Input.Search 
                    placeholder="Search sensors, locations..." 
                    style={{ width: 300 }} 
                    allowClear
                    value={filters.search}
                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                  <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={refreshing} />
                </Space>
              </div>

              {/* Active Filters Chips */}
              <div style={{ minHeight: 32 }}>
                {filters.search && (
                  <Tag closable onClose={() => removeFilter('search')} color="blue">
                    Search: {filters.search}
                  </Tag>
                )}
                {filters.status !== 'all' && (
                  <Tag closable onClose={() => removeFilter('status')} color={filters.status === 'online' ? 'green' : 'default'}>
                    Status: {filters.status.toUpperCase()}
                  </Tag>
                )}
                {filters.alarm !== 'all' && (
                  <Tag closable onClose={() => removeFilter('alarm')} color={filters.alarm === 'alarm' ? 'red' : 'green'}>
                    Alarm: {filters.alarm === 'alarm' ? 'ACTIVE' : 'NORMAL'}
                  </Tag>
                )}
                {filters.locations.map(loc => (
                  <Tag key={loc} closable onClose={() => removeFilter('locations', loc)}>
                    Loc: {loc}
                  </Tag>
                ))}
                {filters.types.map(t => (
                  <Tag key={t} closable onClose={() => removeFilter('types', t)}>
                    Type: {t}
                  </Tag>
                ))}
                {(filters.locations.length > 0 || filters.types.length > 0 || filters.status !== 'all' || filters.alarm !== 'all' || filters.search) && (
                  <Button type="link" size="small" onClick={() => setFilters({ locations: [], types: [], status: 'all', alarm: 'all', search: '' })} style={{ color: '#003a8c' }}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px' }}>
          <div style={{ maxWidth: 1600, margin: '0 auto' }}>
            {/* Results Grid */}
            {filteredDevices.length > 0 ? (
              <Row gutter={[16, 16]}>
                {filteredDevices.map(device => (
                  <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={4} key={device.key}>
                    <DeviceCard device={device} onClick={() => {
                      setSelectedDevice(device);
                      setDrawerVisible(true);
                    }} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="No sensors match your filters" style={{ marginTop: 64 }} />
            )}
          </div>
        </div>
      </Content>

      {/* Detail Drawer */}
      <Drawer
        title={selectedDevice?.name}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        {selectedDevice && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', padding: '24px 0', background: '#f9f9f9', borderRadius: 8, border: '1px solid #f0f0f0' }}>
              <Text type="secondary">Current Reading</Text>
              <div style={{ fontSize: 42, fontWeight: 'bold', color: '#003a8c', lineHeight: 1.2 }}>
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
          </Space>
        )}
      </Drawer>

      {/* CSS for responsive Sider visibility */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-sider {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 993px) {
          .desktop-sider {
            display: block !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default RealTimeMonitor;
