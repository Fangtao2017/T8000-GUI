import { allDevices } from './devicesData';
import type { DeviceData } from './devicesData';

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
}

export interface Site {
  id: string;
  tenantId: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  image?: string;
}

export const tenants: Tenant[] = [
  { id: 'T001', name: 'National University of Singapore' },
  { id: 'T002', name: 'Marina Bay Sands Management' },
];

export const sites: Site[] = [
  { 
    id: 'S001', 
    tenantId: 'T001', 
    name: 'Engineering Block E4', 
    location: '4 Engineering Drive 3',
    coordinates: [1.2966, 103.7764]
  },
  { 
    id: 'S002', 
    tenantId: 'T001', 
    name: 'University Town', 
    location: '2 College Avenue West',
    coordinates: [1.3040, 103.7737]
  },
  { 
    id: 'S003', 
    tenantId: 'T002', 
    name: 'Hotel Tower 1', 
    location: '10 Bayfront Avenue',
    coordinates: [1.2847, 103.8610]
  },
];

// Filter only T8000 Gateways for the Cloud View
// We will assign them to sites for the map visualization
export const cloudGateways = allDevices.filter(d => d.model === 'T8000').map((d, index) => {
  // Assign to one of the 3 sites round-robin
  const siteIndex = index % sites.length;
  const site = sites[siteIndex];
  
  return {
    ...d,
    // Use site coordinates with slight jitter to show they are in the same site but distinct if needed
    // But for "Site View" we will group them.
    // Storing siteId for grouping
    loc_id: site.id, 
    location: site.name,
    x: site.coordinates[0],
    y: site.coordinates[1]
  };
});

// Generate more mock T8000s for visualization
// Distribute them among the sites
for (let i = 1; i <= 30; i++) {
  const siteIndex = i % sites.length;
  const site = sites[siteIndex];

  cloudGateways.push({
    id: 100 + i,
    key: `mock-gw-${i}`,
    name: `Gateway T8000-${100 + i}`,
    modelName: 'T8000',
    model: 'T8000', // Keep for compatibility if needed, or remove if strictly typed
    serialNumber: `2024000${100 + i}`,
    location: site.name,
    loc_id: site.id,
    status: Math.random() > 0.2 ? 'online' : 'offline',
    nwkStatus: Math.random() > 0.2 ? 1 : 0,
    enabled: 1,
    priAddr: 100 + i,
    fw_ver: '1.0.0',
    alarm_state: Math.random() > 0.9 ? 'Active Alarm' : 'Not alarm',
    err_state: 'No error',
    lastReport: `${Math.floor(Math.random() * 10)} min ago`,
    parameters: { voltage: 220, uptime: 100 + i * 10 },
    // Same coordinates as site
    x: site.coordinates[0],
    y: site.coordinates[1],
  } as any); // Cast to any to avoid strict type checking against the mixed type if necessary, or better, match the type exactly.

}

// Helper to get devices for a site
// ...existing code...
export const getDevicesBySite = (siteId: string): DeviceData[] => {
  return cloudGateways.filter(d => d.loc_id === siteId);
};

export const getSiteStats = (siteId: string) => {
  const devices = getDevicesBySite(siteId);
  const total = devices.length;
  const online = devices.filter(d => d.status === 'online').length;
  const offline = total - online;
  const alarms = devices.filter(d => d.alarm_state === 'Active Alarm').length;
  
  return { total, online, offline, alarms };
};

export const getGlobalStats = () => {
  const totalDevices = cloudGateways.length;
  const onlineDevices = cloudGateways.filter(d => d.status === 'online').length;
  const activeAlarms = cloudGateways.filter(d => d.alarm_state === 'Active Alarm').length;
  const totalSites = sites.length;
  
  return { totalDevices, onlineDevices, activeAlarms, totalSites };
};
