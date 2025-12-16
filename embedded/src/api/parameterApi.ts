export interface ParameterApiData {
    key: string | number;
    name: string;
    device: string;
    dataType: string;
    unit: string;
    access: string;
    sourceInterface: string;
    channel: number;
    lowerLimit: number;
    upperLimit: number;
    bit: string | number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchParameters = async (): Promise<ParameterApiData[]> => {
  try {
    // Determine API URL based on environment
    // FORCE HARDWARE IP: 192.168.10.189
    const baseUrl = import.meta.env.DEV 
      ? 'http://192.168.10.189:9000' 
      : `http://${window.location.hostname}:9000`;
      
    const apiUrl = `${baseUrl}/api/parameters`;
    
    console.log('Fetching parameters from (Hardware IP):', apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Parameters data received:', data);
    return data as ParameterApiData[];
  } catch (error) {
    console.error('Error fetching parameters:', error);
    return [];
  }
};
