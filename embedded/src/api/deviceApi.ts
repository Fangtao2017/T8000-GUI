import type { DeviceData } from '../data/devicesData';

export const fetchDevices = async (): Promise<DeviceData[]> => {
  try {
    const apiUrl = '/api/devices';
    
    console.log('Fetching devices from:', apiUrl);
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Devices data received:', data);
    return data as DeviceData[];
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

export interface DeviceParameter {
    id: number;
    mapId?: number;
    name: string;
    sensitivity: number;
    unit: string;
    dataType: number;
    rw: number;
}

export const unbindDeviceParameter = async (mapId: number): Promise<void> => {
  try {
    const apiUrl = `/api/dev-param-maps/${mapId}`;
    
    console.log(`Unbinding parameter map ${mapId} at:`, apiUrl);
    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error unbinding parameter map ${mapId}:`, error);
    throw error;
  }
};

export const fetchDeviceParameters = async (deviceId: number): Promise<DeviceParameter[]> => {
  try {
    const apiUrl = `/api/devices/${deviceId}/parameters`;
    
    console.log(`Fetching parameters for device ${deviceId} from:`, apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as DeviceParameter[];
  } catch (error) {
    console.error(`Error fetching parameters for device ${deviceId}:`, error);
    return [];
  }
};

export const updateDevice = async (deviceId: number, data: Partial<DeviceData>): Promise<DeviceData> => {
  try {
    const apiUrl = `/api/devices/${deviceId}`;
    
    console.log(`Updating device ${deviceId} at:`, apiUrl, data);
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result as DeviceData;
  } catch (error) {
    console.error(`Error updating device ${deviceId}:`, error);
    throw error;
  }
};
