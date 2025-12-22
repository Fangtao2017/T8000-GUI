export interface ModelApiData {
    model: string;
    type: string;
    brand: string;
    usage: number;
    last_updated: number; // timestamp
}

export const fetchModels = async (): Promise<ModelApiData[]> => {
  try {
    const apiUrl = '/api/models';
    
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
