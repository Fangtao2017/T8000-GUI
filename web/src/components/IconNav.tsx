import React, { useState } from 'react';
import { Flex } from 'antd';
import { 
	HomeOutlined, 
	DashboardOutlined,
	LineChartOutlined,
	BellOutlined,
	FileTextOutlined,
	AppstoreAddOutlined,
	ControlOutlined,
	ToolOutlined,
	WifiOutlined,
	ApiOutlined,
	ClusterOutlined,
	SettingOutlined,
	DownOutlined,
	BlockOutlined,
	FormOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const IconNav: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [expandedSection, setExpandedSection] = useState<string | null>(null);

	// Determine current top-level section
	const section = (() => {
		const path = location.pathname;
		if (path === '/') return 'overview';
		if (path === '/devices' || path === '/analysis' || path === '/alarms' || path === '/log' || path === '/rules') return 'monitor';
		if (path.startsWith('/devices/') || path.startsWith('/configuration')) return 'configuration';
		if (path.startsWith('/settings')) return 'administration';
		return 'overview';
	})();

	// Navigation items configuration
	const navigationItems = [
		{
			key: 'overview',
			icon: <HomeOutlined />,
			label: 'Dashboard',
			path: '/',
			hasDropdown: false,
		},
		{
			key: 'monitor',
			icon: <DashboardOutlined />,
			label: 'Monitoring',
			hasDropdown: true,
			submenu: [
				{ key: 'devices-list', label: 'All Devices', icon: <AppstoreAddOutlined />, path: '/devices' },
				{ key: 'all-model', label: 'All Model', icon: <BlockOutlined />, path: '/devices/models' },
				{ key: 'all-parameter', label: 'All Parameter', icon: <FormOutlined />, path: '/devices/parameters' },
				{ key: 'analysis', label: 'Analysis', icon: <LineChartOutlined />, path: '/analysis' },
				{ key: 'alarms', label: 'Alarms', icon: <BellOutlined />, path: '/alarms' },
				{ key: 'log', label: 'Log', icon: <FileTextOutlined />, path: '/log' },
				{ key: 'rules', label: 'Rules', icon: <ControlOutlined />, path: '/rules' },
			],
		},
		{
			key: 'configuration',
			icon: <AppstoreAddOutlined />,
			label: 'Configuration',
			hasDropdown: true,
			submenu: [
				{ key: 'add-device', label: 'Add Device', icon: <AppstoreAddOutlined />, path: '/devices/add' },
				{ key: 'add-model', label: 'Add Model', icon: <BlockOutlined />, path: '/configuration/add-model' },
				{ key: 'add-parameter', label: 'Supplement Add Parameter', icon: <FormOutlined />, path: '/configuration/add-parameter' },
				{ key: 'add-alarm', label: 'Add Alarm', icon: <BellOutlined />, path: '/configuration/add-alarm' },
				{ key: 'add-rule', label: 'Add Rule', icon: <ControlOutlined />, path: '/configuration/add-rule' },
			],
		},
		{
			key: 'administration',
			icon: <ToolOutlined />,
			label: 'Administration',
			hasDropdown: true,
			submenu: [
				{ key: 'network', label: 'Network Settings', icon: <WifiOutlined />, path: '/settings/network' },
				{ key: 'mqtt', label: 'MQTT Configuration', icon: <ApiOutlined />, path: '/settings/mqtt' },
				{ key: 'modbus', label: 'Modbus Settings', icon: <ClusterOutlined />, path: '/settings/modbus' },
				{ key: 'system', label: 'System Settings', icon: <SettingOutlined />, path: '/settings/system' },
			],
		},
	];

	const handleItemClick = (item: typeof navigationItems[0]) => {
		if (item.hasDropdown) {
			setExpandedSection(expandedSection === item.key ? null : item.key);
		} else {
			navigate(item.path!);
		}
	};

	const handleSubmenuClick = (path: string) => {
		navigate(path);
	};

	return (
		<Flex
			vertical
			gap={8}
			style={{
				width: 220,
				background: '#001B34',
				paddingTop: 16,
				paddingBottom: 16,
				height: '100%',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				position: 'relative',
				zIndex: 1001,
				borderRight: '1px solid rgba(255,255,255,0.1)',
				overflowY: 'auto',
				overflowX: 'hidden',
			}}
		>
			{navigationItems.map((item) => {
				const active = section === item.key;
				const expanded = expandedSection === item.key;
				
				return (
					<div key={item.key}>
						{/* Main Menu Item */}
						<div
							onClick={() => handleItemClick(item)}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								padding: '12px 16px',
								margin: '0 8px',
								borderRadius: 4,
								color: active ? '#8CC63F' : 'rgba(255,255,255,0.85)',
								cursor: 'pointer',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								background: active ? 'rgba(140, 198, 63, 0.15)' : 'transparent',
								position: 'relative',
								fontSize: 14,
								fontWeight: active ? 500 : 400,
							}}
							onMouseEnter={(e) => {
								if (!active) {
									e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
								}
							}}
							onMouseLeave={(e) => {
								if (!active) {
									e.currentTarget.style.background = 'transparent';
								}
							}}
						>
							<span style={{ fontSize: 18 }}>{item.icon}</span>
							<span style={{ flex: 1 }}>{item.label}</span>
							{item.hasDropdown && (
								<DownOutlined style={{ 
									fontSize: 10,
									opacity: 0.6,
									transition: 'transform 0.3s',
									transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
								}} />
							)}
						</div>
						
						{/* Submenu Items */}
						{item.hasDropdown && expanded && (
							<div style={{
								paddingLeft: 8,
								paddingRight: 8,
								marginTop: 4,
								marginBottom: 4,
							}}>
								{item.submenu?.map((subItem) => {
									const subActive = location.pathname === subItem.path;
									return (
										<div
											key={subItem.key}
											onClick={() => handleSubmenuClick(subItem.path)}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 10,
												padding: '10px 16px 10px 32px',
												margin: '2px 0',
												borderRadius: 4,
												color: subActive ? '#8CC63F' : 'rgba(255,255,255,0.65)',
												cursor: 'pointer',
												transition: 'all 0.2s',
												background: subActive ? 'rgba(140, 198, 63, 0.1)' : 'transparent',
												fontSize: 13,
											}}
											onMouseEnter={(e) => {
												if (!subActive) {
													e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
													e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
												}
											}}
											onMouseLeave={(e) => {
												if (!subActive) {
													e.currentTarget.style.background = 'transparent';
													e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
												}
											}}
										>
											<span style={{ fontSize: 14, opacity: 0.8 }}>{subItem.icon}</span>
											<span>{subItem.label}</span>
										</div>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</Flex>
	);
};

export default IconNav;