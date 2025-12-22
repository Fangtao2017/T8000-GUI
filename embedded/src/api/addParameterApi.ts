export interface AddParameterData {
    model_id: number;
    name: string;
    attr: string;
    unit?: string | null;
    data_type: number; // 0=Discrete, 1=Integer, 2=Float
    rw: number; // 0=Read Only, 1=Read/Write
    source: number; // 0=DI, 1=AI, 2=DO, 3=Modbus, 4=Zigbee
    channel?: number | null;
    lower_limit?: number | null;
    upper_limit?: number | null;
    bit?: number | null;
    runtime?: number | null;
    description?: string | null;
}

export const addParameter = async (data: AddParameterData): Promise<{ success: boolean; id?: number; error?: string }> => {
    try {
        // Ensure undefined values are converted to null
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === undefined ? null : value])
        );

        const response = await fetch('/api/parameters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add parameter');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding parameter:', error);
        throw error;
    }
};
