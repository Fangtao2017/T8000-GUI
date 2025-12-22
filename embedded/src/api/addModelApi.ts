export interface AddModelData {
    brand: string;
    model: string;
    dev_type: string;
    interface: number;
}

export const addModel = async (data: AddModelData) => {
    console.log('Adding model with data:', JSON.stringify(data, null, 2));
    const response = await fetch('/api/models', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        let errorMsg = 'Failed to add model';
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch (e) {
            const text = await response.text();
            console.error('API Error (Non-JSON):', text);
            errorMsg += `: ${text.substring(0, 100)}`;
        }
        throw new Error(errorMsg);
    }

    return response.json();
};
