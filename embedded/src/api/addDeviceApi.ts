export interface DeviceData {
    device_id: string;      // Name
    model_id: number;       // Model ID
    node_id: string;        // Model Name
    pri_addr?: string;
    sec_addr?: string;
    ter_addr?: string;
    log_intvl?: string;
    report_intvl?: string;
    health_intvl?: string;
    loc_id?: string;
    loc_name?: string;
    loc_subname?: string;
    loc_blk?: string;
    loc_unit?: string;
    postal_code?: string;
    loc_addr?: string;
    x?: number;
    y?: number;
    h?: number;
    fw_ver?: string;
    en?: number;
}

export const addDevice = async (data: DeviceData) => {
    console.log('Adding device with data:', JSON.stringify(data, null, 2));
    const response = await fetch('/api/devices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        let errorMsg = 'Failed to add device';
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

export const linkDeviceParameter = async (devId: number, paramId: number, sensitivity: number) => {
    const payload = {
        dev_id: devId,
        param_id: paramId,
        sensitivity: sensitivity
    };
    console.log('Linking parameter with payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch('/api/dev-param-maps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to link parameter');
    }

    return response.json();
};
