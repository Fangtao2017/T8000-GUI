export const deleteDevice = async (deviceId: number): Promise<void> => {
  try {
    const apiUrl = `/api/devices/${deviceId}`;
    
    console.log(`Deleting device ${deviceId} at:`, apiUrl);
    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting device ${deviceId}:`, error);
    throw error;
  }
};
