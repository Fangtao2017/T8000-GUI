import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface NotificationEvent {
	timestamp: number; // Unix timestamp
	type: 'triggered' | 'normalized';
	value: string | number;
}

export interface NotificationItem {
	id: string;
	severity: 'critical' | 'warning' | 'info';
	title: string;
	deviceName: string;
	parameter: string;
	time: string; // Display time (e.g. "2 min ago")
	events: NotificationEvent[];
	userStatus: 'new' | 'acknowledged' | 'ignored';
	type?: 'alarm' | 'rule'; // Added type field as requested for the new page
}

const initialNotifications: NotificationItem[] = [
	{ 
		id: '1', 
		severity: 'critical', 
		title: 'High Temperature Alert', 
		deviceName: 'Temperature Sensor 1',
		parameter: 'Temperature',
		time: '2 min ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740129764, type: 'triggered', value: '85°C' },
			{ timestamp: 1740129800, type: 'normalized', value: '45°C' }
		]
	},
	{ 
		id: '2', 
		severity: 'critical', 
		title: 'Device Offline', 
		deviceName: 'Controller C5',
		parameter: 'Connection',
		time: '10 min ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740129200, type: 'triggered', value: 'Disconnected' }
		]
	},
	{ 
		id: '3', 
		severity: 'warning', 
		title: 'Low Battery Warning', 
		deviceName: 'Sensor A3',
		parameter: 'Battery Level',
		time: '15 min ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740128900, type: 'triggered', value: '15%' }
		]
	},
	{ 
		id: '4', 
		severity: 'critical', 
		title: 'Pressure Exceeded', 
		deviceName: 'Sensor A3',
		parameter: 'Pressure',
		time: '20 min ago',
		userStatus: 'new',
		type: 'rule',
		events: [
			{ timestamp: 1740128600, type: 'triggered', value: '120 PSI' }
		]
	},
	{ 
		id: '6', 
		severity: 'critical', 
		title: 'Device Offline', 
		deviceName: 'Gateway G2',
		parameter: 'Connection',
		time: '2 hours ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740122600, type: 'triggered', value: 'Disconnected' }
		]
	},
	{ 
		id: '8', 
		severity: 'warning', 
		title: 'Memory Usage High', 
		deviceName: 'System',
		parameter: 'Memory',
		time: '4 hours ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740115400, type: 'triggered', value: '85%' }
		]
	},
	{ 
		id: '9', 
		severity: 'warning', 
		title: 'Disk Space Low', 
		deviceName: 'System',
		parameter: 'Storage',
		time: '5 hours ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740111800, type: 'triggered', value: '90%' }
		]
	},
	{ 
		id: '10', 
		severity: 'info', 
		title: 'Device Added', 
		deviceName: 'Sensor B8',
		parameter: 'Registration',
		time: '6 hours ago',
		userStatus: 'new',
		type: 'rule',
		events: [
			{ timestamp: 1740108200, type: 'triggered', value: 'Registered' }
		]
	},
	{ 
		id: '11', 
		severity: 'info', 
		title: 'Configuration Updated', 
		deviceName: 'System',
		parameter: 'MQTT Settings',
		time: '8 hours ago',
		userStatus: 'new',
		type: 'rule',
		events: [
			{ timestamp: 1740101000, type: 'triggered', value: 'Updated' }
		]
	},
	{ 
		id: '12', 
		severity: 'info', 
		title: 'Routine Maintenance', 
		deviceName: 'System',
		parameter: 'Maintenance',
		time: '10 hours ago',
		userStatus: 'new',
		type: 'rule',
		events: [
			{ timestamp: 1740093800, type: 'triggered', value: 'Completed' }
		]
	},
];

interface NotificationContextType {
	notifications: NotificationItem[];
	updateNotificationStatus: (id: string, status: 'new' | 'acknowledged' | 'ignored') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

	const updateNotificationStatus = (id: string, status: 'new' | 'acknowledged' | 'ignored') => {
		setNotifications(prev => prev.map(n => 
			n.id === id ? { ...n, userStatus: status } : n
		));
	};

	return (
		<NotificationContext.Provider value={{ notifications, updateNotificationStatus }}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error('useNotifications must be used within a NotificationProvider');
	}
	return context;
};
