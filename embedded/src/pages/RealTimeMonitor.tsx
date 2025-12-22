import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Card, Input, Button, Row, Col, Typography, 
  Space, Tag, Badge, Drawer, List, Table, Collapse, Checkbox, 
  Radio, Empty, Spin, Statistic, InputNumber, message 
} from 'antd';
import { 
  ReloadOutlined, FilterOutlined, 
  AppstoreOutlined, BarsOutlined, WifiOutlined, 
  DisconnectOutlined, AlertOutlined, CheckCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { fetchDevices } from '../api/deviceApi';
import type { DeviceData, DeviceParameterData } from '../data/devicesData';

dayjs.extend(relativeTime);

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

// --- Types ---
interface FilterState {
  status: ('online' | 'offline')[];
  alarm: ('active' | 'normal')[];
  locations: string[];
  types: string[];
  freshness: 'all' | '1min' | '5min' | 'stale';
  search: string;
}

// --- Helper Functions ---
const getDeviceType = (device: DeviceData): string => {
  if (device.modelName?.includes('OCC')) return 'Occupancy';
  if (device.modelName?.includes('DIM')) return 'Lighting';
  if (device.modelName?.includes('EMS')) return 'Power Meter';
  if (device.modelName?.includes('TK') || device.modelName?.includes('FM')) return 'Water Meter';
  // Fallback based on parameters if model name is generic
  if (device.liveData) {
      if (device.liveData.some(p => p.name.toLowerCase().includes('temp'))) return 'Temperature';
      if (device.liveData.some(p => p.name.toLowerCase().includes('power'))) return 'Power';
  }
  return 'Other';
};

const getFreshnessStatus = (timestamp?: number) => {
    if (!timestamp) return 'stale';
    const diff = dayjs().unix() - timestamp;
    if (diff < 60) return 'fresh';
    if (diff < 300) return 'recent';
    return 'stale';
};

const getFreshnessColor = (status: string) => {
    switch (status) {
        case 'fresh': return '#52c41a'; // Green
        case 'recent': return '#faad14'; // Yellow
        case 'stale': return '#d9d9d9'; // Grey
        default: return '#d9d9d9';
    }
};

// --- Components ---

// 1. Filter Panel
const FilterPanel: React.FC<{
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  locations: string[];
  types: string[];
  counts: { locations: Record<string, number>; types: Record<string, number> };
}> = ({ filters, onChange, locations, types, counts }) => {
  
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={5}><FilterOutlined /> Filters</Title>
      </div>

      <Collapse defaultActiveKey={['status', 'alarm', 'freshness']} ghost expandIconPosition="end">
        <Panel header="Sensor Status" key="status">
          <Checkbox.Group 
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            value={filters.status}
            onChange={(vals) => onChange({ ...filters, status: vals as any[] })}
          >
            <Checkbox value="online"><Badge status="success" text="Online" /></Checkbox>
            <Checkbox value="offline"><Badge status="error" text="Offline" /></Checkbox>
          </Checkbox.Group>
        </Panel>

        <Panel header="Alarm Status" key="alarm">
           <Checkbox.Group 
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            value={filters.alarm}
            onChange={(vals) => onChange({ ...filters, alarm: vals as any[] })}
          >
            <Checkbox value="active"><Text type="danger"><AlertOutlined /> Active Alarm</Text></Checkbox>
            <Checkbox value="normal"><Text type="success"><CheckCircleOutlined /> Normal</Text></Checkbox>
          </Checkbox.Group>
        </Panel>

        <Panel header="Data Freshness" key="freshness">
            <Radio.Group 
                value={filters.freshness} 
                onChange={e => onChange({ ...filters, freshness: e.target.value })}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
                <Radio value="all">All Data</Radio>
                <Radio value="1min"><Text type="success">Updated &lt; 1 min</Text></Radio>
                <Radio value="5min"><Text type="warning">Updated &lt; 5 min</Text></Radio>
                <Radio value="stale"><Text type="secondary">Stale / No Data</Text></Radio>
            </Radio.Group>
        </Panel>

        <Panel header="Location" key="location">
            <Checkbox.Group 
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                value={filters.locations}
                onChange={(vals) => onChange({ ...filters, locations: vals as string[] })}
            >
                {locations.map(loc => (
                    <Checkbox key={loc} value={loc}>
                        {loc || 'Unknown'} <Text type="secondary" style={{ fontSize: 12 }}>({counts.locations[loc] || 0})</Text>
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </Panel>

        <Panel header="Device Type" key="type">
             <Checkbox.Group 
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                value={filters.types}
                onChange={(vals) => onChange({ ...filters, types: vals as string[] })}
            >
                {types.map(type => (
                    <Checkbox key={type} value={type}>
                        {type} <Text type="secondary" style={{ fontSize: 12 }}>({counts.types[type] || 0})</Text>
                    </Checkbox>
                ))}
            </Checkbox.Group>
        </Panel>
      </Collapse>
      
      <Button type="link" onClick={() => onChange({
          status: [], alarm: [], locations: [], types: [], freshness: 'all', search: ''
      })}>
          Clear All Filters
      </Button>
    </div>
  );
};

// 2. Device Card
const DeviceCard: React.FC<{ device: DeviceData; onClick: () => void }> = ({ device, onClick }) => {
    const isOnline = device.nwkStatus === 1;
    const isAlarm = device.liveData?.some(p => p.alarm);
    
    // Find latest timestamp among parameters
    const lastUpdate = device.liveData?.reduce((max, p) => Math.max(max, p.timestamp || 0), 0) || device.lastSeen || 0;
    const freshness = getFreshnessStatus(lastUpdate);
    
    // Get top 2 parameters
    const keyParams = device.liveData?.slice(0, 2) || [];

    return (
        <Card
            hoverable
            onClick={onClick}
            style={{ 
                height: '100%', 
                borderTop: `3px solid ${isAlarm ? '#ff4d4f' : isOnline ? '#52c41a' : '#ff4d4f'}`,
                opacity: isOnline ? 1 : 0.7
            }}
            bodyStyle={{ padding: '12px 16px', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                <div>
                    <Text strong style={{ fontSize: 16, display: 'block' }}>{device.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>{device.location || 'No Location'}</Text>
                </div>
                {isAlarm && <AlertOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />}
            </div>

            <div style={{ flex: 1, marginBottom: 12 }}>
                {keyParams.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {keyParams.map(p => (
                            <div key={p.id} style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4 }}>
                                <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{p.name}</Text>
                                <Text strong>{p.value !== null ? p.value : '--'} <span style={{ fontSize: 10 }}>{p.unit}</span></Text>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '12px 0', color: '#ccc' }}>
                        No Parameters
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                <Space size={4}>
                    <ClockCircleOutlined style={{ fontSize: 12, color: getFreshnessColor(freshness) }} />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        {lastUpdate ? dayjs.unix(lastUpdate).fromNow() : 'Never'}
                    </Text>
                </Space>
                <Button size="small" onClick={(e) => { e.stopPropagation(); onClick(); }}>Details</Button>
            </div>
        </Card>
    );
};

// 3. Main Page
const RealTimeMonitor: React.FC = () => {
    const [devices, setDevices] = useState<DeviceData[]>([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [mobileFilterVisible, setMobileFilterVisible] = useState(false);
    
    const [filters, setFilters] = useState<FilterState>({
        status: [],
        alarm: [],
        locations: [],
        types: [],
        freshness: 'all',
        search: ''
    });

    const loadData = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await fetchDevices();
            setDevices(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const startPolling = () => {
            // Clear existing to be safe
            if (interval) clearInterval(interval);
            interval = setInterval(() => {
                if (!document.hidden) {
                    loadData(true);
                }
            }, 1000);
        };

        // Initial load
        loadData(false);
        startPolling();

        // Visibility change handler to pause/resume polling
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearInterval(interval);
            } else {
                loadData(true); // Immediate update when becoming visible
                startPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Derived Data
    const uniqueLocations = useMemo(() => Array.from(new Set(devices.map(d => d.location || 'Unknown'))).sort(), [devices]);
    const uniqueTypes = useMemo(() => Array.from(new Set(devices.map(d => getDeviceType(d)))).sort(), [devices]);
    
    const facetCounts = useMemo(() => {
        const locs: Record<string, number> = {};
        const typs: Record<string, number> = {};
        devices.forEach(d => {
            const l = d.location || 'Unknown';
            locs[l] = (locs[l] || 0) + 1;
            const t = getDeviceType(d);
            typs[t] = (typs[t] || 0) + 1;
        });
        return { locations: locs, types: typs };
    }, [devices]);

    const filteredDevices = useMemo(() => {
        return devices.filter(d => {
            // Search
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const matchName = d.name.toLowerCase().includes(q);
                const matchLoc = d.location?.toLowerCase().includes(q);
                const matchParam = d.liveData?.some(p => p.name.toLowerCase().includes(q));
                if (!matchName && !matchLoc && !matchParam) return false;
            }
            // Status
            if (filters.status.length > 0) {
                const status = d.nwkStatus === 1 ? 'online' : 'offline';
                if (!filters.status.includes(status)) return false;
            }
            // Alarm
            if (filters.alarm.length > 0) {
                const hasAlarm = d.liveData?.some(p => p.alarm);
                const status = hasAlarm ? 'active' : 'normal';
                if (!filters.alarm.includes(status)) return false;
            }
            // Location
            if (filters.locations.length > 0 && !filters.locations.includes(d.location || 'Unknown')) return false;
            // Type
            if (filters.types.length > 0 && !filters.types.includes(getDeviceType(d))) return false;
            // Freshness
            if (filters.freshness !== 'all') {
                const lastUpdate = d.liveData?.reduce((max, p) => Math.max(max, p.timestamp || 0), 0) || d.lastSeen || 0;
                const status = getFreshnessStatus(lastUpdate);
                if (filters.freshness === '1min' && status !== 'fresh') return false;
                if (filters.freshness === '5min' && (status === 'stale')) return false; // fresh or recent
                if (filters.freshness === 'stale' && status !== 'stale') return false;
            }
            return true;
        });
    }, [devices, filters]);

    // Table Columns
    const tableColumns: any = [
        {
            title: 'Device',
            dataIndex: 'name',
            key: 'name',
            width: 220,
            render: (text: string, record: DeviceData) => (
                <Space>
                    <Badge status={record.nwkStatus === 1 ? 'success' : 'error'} />
                    <Text strong style={{ whiteSpace: 'nowrap' }}>{text}</Text>
                </Space>
            )
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            width: 180,
            ellipsis: true,
        },
        {
            title: 'Parameters',
            key: 'parameters',
            render: (_: any, record: DeviceData) => {
                // Sort parameters by timestamp descending (newest first)
                const params = [...(record.liveData || [])].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                const displayParams = params.slice(0, 2);
                const moreCount = params.length - 2;
                
                return (
                    <Space size={8} wrap>
                        {displayParams.map(p => (
                            <div key={p.id} style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                background: p.alarm ? '#fff2f0' : '#f0f5ff', 
                                border: `1px solid ${p.alarm ? '#ffccc7' : '#adc6ff'}`,
                                borderRadius: 4,
                                padding: '2px 8px',
                                fontSize: 13
                            }} onClick={e => e.stopPropagation()}>
                                <span style={{ color: '#595959', marginRight: 6 }}>{p.name}:</span>
                                <span style={{ fontWeight: 600, color: p.alarm ? '#cf1322' : '#1d39c4' }}>
                                    {p.value} <span style={{ fontSize: 11, fontWeight: 400 }}>{p.unit}</span>
                                </span>
                            </div>
                        ))}
                        {moreCount > 0 && (
                            <Tag style={{ margin: 0, borderRadius: 10 }}>+{moreCount} more</Tag>
                        )}
                    </Space>
                );
            }
        },
        {
            title: 'Last Updated',
            key: 'lastSeen',
            width: 180,
            render: (_: any, record: DeviceData) => {
                const lastUpdate = record.liveData?.reduce((max, p) => Math.max(max, p.timestamp || 0), 0) || record.lastSeen || 0;
                return <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>{lastUpdate ? dayjs.unix(lastUpdate).fromNow() : '-'}</Text>;
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_: any, record: DeviceData) => (
                <Button size="small" onClick={() => { setSelectedDevice(record); setDrawerVisible(true); }}>
                    Details
                </Button>
            )
        }
    ];

    return (
        <Layout style={{ height: 'calc(100vh - 140px)', background: '#ffffff' }}>
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

            <Sider 
                width={280} 
                theme="light" 
                style={{ overflowY: 'auto', borderRight: '1px solid #e8e8e8' }}
                className="desktop-sider"
                breakpoint="lg"
                collapsedWidth="0"
                trigger={null}
            >
                <FilterPanel 
                    filters={filters} 
                    onChange={setFilters} 
                    locations={uniqueLocations} 
                    types={uniqueTypes}
                    counts={facetCounts}
                />
            </Sider>
            
            <Content style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>Sensor Monitoring</Title>
                        <Text type="secondary">Real-time data from {filteredDevices.length} sensors</Text>
                    </div>
                    <Space>
                        <Button 
                            icon={<FilterOutlined />} 
                            onClick={() => setMobileFilterVisible(true)}
                            className="mobile-filter-btn"
                            style={{ display: 'none' }}
                        >
                            Filters
                        </Button>
                        <Input.Search 
                            placeholder="Search sensors..." 
                            style={{ width: 250 }} 
                            onSearch={val => setFilters({...filters, search: val})}
                            onChange={e => setFilters({...filters, search: e.target.value})}
                        />
                        <Radio.Group value={viewMode} onChange={e => setViewMode(e.target.value)}>
                            <Radio.Button value="card"><AppstoreOutlined /></Radio.Button>
                            <Radio.Button value="table"><BarsOutlined /></Radio.Button>
                        </Radio.Group>
                        <Button icon={<ReloadOutlined />} onClick={() => loadData(false)} loading={loading}>Refresh</Button>
                    </Space>
                </div>

                {/* Content */}
                <div style={{ flex: '1 1 auto', overflowY: 'auto', overflowX: 'hidden', paddingRight: 4 }}>
                {loading && devices.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>
                ) : filteredDevices.length === 0 ? (
                    <Empty description="No sensors match your filters" />
                ) : viewMode === 'card' ? (
                    <div className="device-grid">
                        {filteredDevices.map(device => (
                            <DeviceCard key={device.id} device={device} onClick={() => { setSelectedDevice(device); setDrawerVisible(true); }} />
                        ))}
                    </div>
                ) : (
                    <Table 
                        columns={tableColumns} 
                        dataSource={filteredDevices} 
                        rowKey="id" 
                        pagination={false}
                        size="small"
                    />
                )}
                </div>
            </Content>

            {/* Detail Drawer */}
            <Drawer
                title={selectedDevice?.name}
                placement="right"
                width={500}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                {selectedDevice && (
                    <div>
                        <Card bordered={false} style={{ background: '#fafafa', marginBottom: 24 }}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Statistic 
                                        title="Status" 
                                        value={selectedDevice.nwkStatus === 1 ? 'Online' : 'Offline'} 
                                        valueStyle={{ color: selectedDevice.nwkStatus === 1 ? '#52c41a' : '#ff4d4f' }}
                                        prefix={selectedDevice.nwkStatus === 1 ? <WifiOutlined /> : <DisconnectOutlined />}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic 
                                        title="Location" 
                                        value={selectedDevice.location || 'N/A'} 
                                        prefix={<EnvironmentOutlined />}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        <Title level={5}>Parameters</Title>
                        <List
                            itemLayout="horizontal"
                            dataSource={selectedDevice.liveData || []}
                            renderItem={(item: DeviceParameterData) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.name}
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">ID: {item.id}</Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    Updated: {item.timestamp ? dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss') : 'Never'}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                    <div style={{ textAlign: 'right' }}>
                                        {item.rw === 1 ? (
                                            <InputNumber 
                                                defaultValue={Number(item.value)}
                                                onPressEnter={(e) => {
                                                    message.success(`Parameter ${item.id} updated to ${(e.target as HTMLInputElement).value}`);
                                                }}
                                                onBlur={(e) => {
                                                    message.success(`Parameter ${item.id} updated to ${e.target.value}`);
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <Text strong style={{ fontSize: 18 }}>{item.value !== null ? item.value : '--'}</Text>
                                                <Text type="secondary" style={{ marginLeft: 4 }}>{item.unit}</Text>
                                            </>
                                        )}
                                        {item.alarm && <Tag color="red" style={{ display: 'block', marginTop: 4 }}>Alarm</Tag>}
                                    </div>
                                </List.Item>
                            )}
                        />
                        {(!selectedDevice.liveData || selectedDevice.liveData.length === 0) && (
                            <Empty description="No parameters available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        )}
                    </div>
                )}
            </Drawer>
            <style>{`
                .device-grid {
                    display: grid;
                    gap: 16px;
                    grid-template-columns: repeat(1, 1fr);
                }
                @media (min-width: 576px) { .device-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 768px) { .device-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 992px) { .device-grid { grid-template-columns: repeat(4, 1fr); } }
                @media (min-width: 1300px) { .device-grid { grid-template-columns: repeat(5, 1fr); } }

                @media (max-width: 992px) {
                    .desktop-sider { display: none !important; }
                    .mobile-filter-btn { display: inline-flex !important; }
                }
            `}</style>
        </Layout>
    );
};

export default RealTimeMonitor;
