export interface AddModbusData {
    model_id: number;
    att: string;
    reg: number | null;
    len: number | null;
    readFC: number | null;
    writeFC: number | null;
    datatype: number | null;
    dp: number | null;
    scaler: number | null;
    offset: number | null;
    timeout: number | null;
    poll_speed: number | null;
}

export const addModbus = async (data: AddModbusData): Promise<{ success: boolean; id?: number; error?: string }> => {
    try {
        // Ensure undefined values are converted to null
        const payload = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value === undefined ? null : value])
        );

        const response = await fetch('/api/modbus-configs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add Modbus configuration');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error adding Modbus configuration:', error);
        throw error;
    }
};
