export interface ModelApiData {
    model: string;
    type: string;
    brand: string;
    usage: number;
    last_updated: number; // timestamp
}

export const fetchModels = async (): Promise<ModelApiData[]> => {
  try {
    // Determine API URL based on environment
    // In development, we point to the specific IP where the backend is running
    // In production, we assume the backend is on port 9000 of the same host
    // FORCE HARDWARE IP: 192.168.10.189
    const baseUrl = import.meta.env.DEV 
      ? 'http://192.168.10.189:9000' 
      : `http://${window.location.hostname}:9000`;
      
    const apiUrl = `${baseUrl}/api/models`;
    
    console.log('Fetching models from (Hardware IP):', apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Models data received:', data);
    return data as ModelApiData[];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};
