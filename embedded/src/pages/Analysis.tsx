import React, { useState } from 'react';
import { 
  Card, Row, Col, Select, DatePicker, Button, Space, Typography, 
  Statistic, Badge, ConfigProvider 
} from 'antd';
import { 
  FilterOutlined, ReloadOutlined, 
  LineChartOutlined, InfoCircleOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Option } = Select;

// --- Mock Data ---

// KPI Data
const kpiData = {
  current: 24.5,
  avg: 23.8,
  max: 28.2,
  min: 19.5,
  stdDev: 1.2,
  unit: '°C'
};

// Data Quality Data
const qualityData = {
  total: 1440,
  missing: 12,
  outOfRange: 5,
  duplicates: 0,
  interval: '1 min'
};

// Chart Data (Time Series)
const generateChartData = () => {
  const data = [];
  const start = dayjs().startOf('day');
  // Generate exactly 24 hours of data (96 * 15min) to avoid overlap/wrap-around lines
  for (let i = 0; i < 96; i++) {
    const time = start.add(i * 15, 'minute');
    let value = 20 + Math.random() * 10;
    // Inject anomalies
    if (i === 20) value = 35; // Spike
    if (i === 50) value = 15; // Drop
    
    data.push({
      time: time.format('HH:mm'),
      value: parseFloat(value.toFixed(1)),
      type: 'Temperature'
    });
  }
  return data;
};

const chartData = generateChartData();

const Analysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>([dayjs().subtract(24, 'hour'), dayjs()]);
  const [filterLabel, setFilterLabel] = useState('Last 24 Hours');
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleApply = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const presetOptions = [
    { label: 'Today', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
    { label: 'Yesterday', value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')] },
    { label: 'This Week', value: [dayjs().startOf('week'), dayjs().endOf('week')] },
    { label: 'This Month', value: [dayjs().startOf('month'), dayjs().endOf('month')] },
    { label: 'Last 7 Days', value: [dayjs().subtract(7, 'day'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().subtract(30, 'day'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().subtract(90, 'day'), dayjs()] },
  ];

  const handlePresetSelect = (preset: any) => {
    setDates(preset.value as [dayjs.Dayjs, dayjs.Dayjs]);
    setFilterLabel(preset.label);
    setPickerOpen(false);
    handleApply();
  };

  const handleRangeChange = (values: any) => {
    setDates(values);
    if (values && values[0] && values[1]) {
      setFilterLabel(`${values[0].format('MMM D')} - ${values[1].format('MMM D')}`);
    }
  };

  // Chart Config
  const config = {
    data: chartData,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: '#003A70',
    point: {
      size: 3,
      shape: 'circle',
    },
    interactions: [{ type: 'marker-active' }, { type: 'brush' }],
    slider: {
      start: 0,
      end: 1,
      height: 20,
    },
    xAxis: {
      tickCount: 12, // Reduce label density
    },
    tooltip: {
      showMarkers: true,
      showCrosshairs: true,
      shared: true,
    },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '16px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          
          {/* 1. Filter Bar */}
          <Card bordered={false} bodyStyle={{ padding: '12px 24px' }} style={{ flexShrink: 0, border: '1px solid #f0f0f0' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={5}>
                <Select placeholder="Select Device" style={{ width: '100%' }} defaultValue="sensor-01">
                  <Option value="sensor-01">Temp Sensor 01</Option>
                  <Option value="meter-02">Energy Meter 3P</Option>
                </Select>
              </Col>
              <Col xs={24} md={5}>
                <Select placeholder="Select Parameter" style={{ width: '100%' }} defaultValue="temp">
                  <Option value="temp">Temperature</Option>
                  <Option value="humidity">Humidity</Option>
                </Select>
              </Col>
              <Col xs={24} md={14}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                  
                  {/* Custom Time Filter Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <Button 
                      onClick={() => setPickerOpen(!pickerOpen)} 
                      style={{ minWidth: 180, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      {filterLabel} <DownOutlined style={{ fontSize: 12, color: '#bfbfbf' }} />
                    </Button>
                    
                    <ConfigProvider theme={{ token: { colorPrimary: '#faad14' } }}>
                      <RangePicker 
                        open={pickerOpen}
                        onOpenChange={setPickerOpen}
                        value={dates}
                        onChange={handleRangeChange}
                        showTime
                        style={{ width: 0, height: 0, padding: 0, border: 0, position: 'absolute', top: '100%', left: 0, opacity: 0, pointerEvents: 'none' }}
                        panelRender={(menu) => (
                          <div style={{ display: 'flex', backgroundColor: '#fff', overflow: 'hidden' }} onMouseDown={e => e.preventDefault()}>
                            {/* Sidebar Presets */}
                            <div style={{ width: 160, borderRight: '1px solid #f0f0f0', padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
                              {presetOptions.map(option => (
                                <div 
                                  key={option.label}
                                  onClick={() => handlePresetSelect(option)}
                                  style={{ 
                                    padding: '8px 16px', 
                                    cursor: 'pointer', 
                                    backgroundColor: filterLabel === option.label ? '#fff7e6' : 'transparent',
                                    color: filterLabel === option.label ? '#faad14' : 'rgba(0,0,0,0.85)',
                                    transition: 'all 0.3s',
                                    fontSize: 14
                                  }}
                                  onMouseEnter={(e) => {
                                    if (filterLabel !== option.label) e.currentTarget.style.backgroundColor = '#f5f5f5';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (filterLabel !== option.label) e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  {option.label}
                                </div>
                              ))}
                              <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '8px 0' }} />
                              <div style={{ padding: '8px 16px', color: '#999', fontSize: 12 }}>Custom Range</div>
                            </div>
                            
                            {/* Calendar Panel */}
                            <div style={{ padding: 0 }}>
                              {menu}
                            </div>
                          </div>
                        )}
                      />
                    </ConfigProvider>
                  </div>

                  <Space>
                    <Button type="primary" icon={<FilterOutlined />} onClick={handleApply} loading={loading} style={{ backgroundColor: '#003A70' }}>
                      Apply
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleApply} />
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 2. KPI Summary & Data Quality */}
          <Card bordered={false} bodyStyle={{ padding: '16px 24px' }} style={{ flexShrink: 0, border: '1px solid #f0f0f0' }}>
            <Row gutter={[24, 16]} align="middle">
              <Col xs={12} sm={6} lg={4}>
                <Statistic 
                  title="Current" 
                  value={kpiData.current} 
                  precision={1} 
                  suffix={kpiData.unit}
                  valueStyle={{ fontSize: 20, fontWeight: 600 }}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <Statistic 
                  title="Average" 
                  value={kpiData.avg} 
                  precision={1} 
                  suffix={kpiData.unit} 
                  valueStyle={{ fontSize: 20, fontWeight: 600 }}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <Statistic 
                  title="Max" 
                  value={kpiData.max} 
                  precision={1} 
                  suffix={kpiData.unit}
                  valueStyle={{ color: '#cf1322', fontSize: 20, fontWeight: 600 }}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <Statistic 
                  title="Min" 
                  value={kpiData.min} 
                  precision={1} 
                  suffix={kpiData.unit}
                  valueStyle={{ color: '#3f8600', fontSize: 20, fontWeight: 600 }}
                />
              </Col>
              
              {/* Divider or Spacer */}
              <Col xs={0} lg={1} style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 1, height: 40, backgroundColor: '#f0f0f0' }} />
              </Col>

              {/* Data Quality Compact */}
              <Col xs={24} lg={7}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Space><InfoCircleOutlined /><Text strong>Data Quality</Text></Space>
                  <Space size={16} wrap>
                    <Badge color="blue" text={`Total: ${qualityData.total}`} />
                    <Badge color="red" text={`Missing: ${qualityData.missing}`} />
                    <Badge color="orange" text={`Out: ${qualityData.outOfRange}`} />
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 3. Main Trend Chart */}
          <Card 
            title={<Space><LineChartOutlined /> Trend Analysis</Space>} 
            bordered={false} 
            style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', border: '1px solid #f0f0f0' }}
            bodyStyle={{ padding: '0 24px 24px 24px', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ height: 320, width: '100%' }}>
              <Line {...config} />
            </div>
          </Card>

      </div>
    </div>
  );
};

export default Analysis;
