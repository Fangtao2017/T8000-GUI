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
		title: 'Sensor Offline', 
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
		title: 'T8000 Offline', 
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
	// Additional mock data for scroll testing
	{ 
		id: '13', 
		severity: 'warning', 
		title: 'High CPU Usage', 
		deviceName: 'Server 1',
		parameter: 'CPU',
		time: '11 hours ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740090200, type: 'triggered', value: '92%' }
		]
	},
	{ 
		id: '14', 
		severity: 'critical', 
		title: 'Database Connection Failed', 
		deviceName: 'DB Server',
		parameter: 'Connection',
		time: '12 hours ago',
		userStatus: 'acknowledged',
		type: 'alarm',
		events: [
			{ timestamp: 1740086600, type: 'triggered', value: 'Failed' }
		]
	},
	{ 
		id: '15', 
		severity: 'info', 
		title: 'Backup Completed', 
		deviceName: 'Backup System',
		parameter: 'Backup',
		time: '13 hours ago',
		userStatus: 'new',
		type: 'rule',
		events: [
			{ timestamp: 1740083000, type: 'triggered', value: 'Success' }
		]
	},
	{ 
		id: '16', 
		severity: 'warning', 
		title: 'Low Disk Space', 
		deviceName: 'Server 2',
		parameter: 'Disk',
		time: '14 hours ago',
		userStatus: 'ignored',
		type: 'alarm',
		events: [
			{ timestamp: 1740079400, type: 'triggered', value: '15% Free' }
		]
	},
	{ 
		id: '17', 
		severity: 'critical', 
		title: 'Power Supply Failure', 
		deviceName: 'UPS 1',
		parameter: 'Power',
		time: '15 hours ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740075800, type: 'triggered', value: 'Failure' }
		]
	},
	{ 
		id: '18', 
		severity: 'info', 
		title: 'User Login', 
		deviceName: 'Admin Panel',
		parameter: 'Security',
		time: '16 hours ago',
		userStatus: 'new',
		type: 'rule',
		events: [
			{ timestamp: 1740072200, type: 'triggered', value: 'Login' }
		]
	},
	{ 
		id: '19', 
		severity: 'warning', 
		title: 'High Network Latency', 
		deviceName: 'Gateway G1',
		parameter: 'Network',
		time: '17 hours ago',
		userStatus: 'new',
		type: 'alarm',
		events: [
			{ timestamp: 1740068600, type: 'triggered', value: '300ms' }
		]
	},
	{ 
		id: '20', 
		severity: 'critical', 
		title: 'Fire Alarm Triggered', 
		deviceName: 'Zone 1',
		parameter: 'Fire',
		time: '18 hours ago',
		userStatus: 'acknowledged',
		type: 'alarm',
		events: [
			{ timestamp: 1740065000, type: 'triggered', value: 'Detected' }
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
