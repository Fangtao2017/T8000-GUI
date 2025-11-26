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
      {/* Button to jump to Embedded Web */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 100px)' 
      }}>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => navigate('/device/T8000-001')}
          style={{ height: 60, fontSize: 20, padding: '0 40px' }}
        >
          Go to Embedded Web
        </Button>
      </div>
    </div>
  );
};

export default CloudDashboard;
