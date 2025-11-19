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
	UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

interface IconNavProps {
	collapsed?: boolean;
}

const IconNav: React.FC<IconNavProps> = ({ collapsed }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [expandedSection, setExpandedSection] = useState<string | null>(null);

	// Determine current top-level section
	const section = (() => {
		const path = location.pathname;
		if (path === '/') return 'overview';
		
		if (path.startsWith('/analysis') || path.startsWith('/log') || path.startsWith('/alarms') || path.startsWith('/rules')) return 'monitoring';
		
		if (path.startsWith('/devices') || path === '/settings/modbus' || path === '/configuration/add-model' || path === '/configuration/add-parameter') return 'device-management';
		
		if (path === '/configuration/add-rule' || path === '/configuration/add-alarm') return 'logic-management';
		
		if (path === '/settings/network' || path === '/settings/system' || path === '/settings/mqtt' || path.startsWith('/account')) return 'communication-management';
		
		return 'overview';
	})();

	// Navigation items configuration
	const navigationItems = [
		{
			key: 'overview',
			icon: <HomeOutlined />,
			label: 'Overview',
			path: '/',
			hasDropdown: false,
		},
		{
			key: 'monitoring',
			icon: <DashboardOutlined />,
			label: 'Monitoring',
			hasDropdown: true,
			submenu: [
				{ key: 'analysis', label: 'Analysis', icon: <LineChartOutlined />, path: '/analysis' },
				{ key: 'log', label: 'Log', icon: <FileTextOutlined />, path: '/log' },
				{ key: 'alarms', label: 'Alarms', icon: <BellOutlined />, path: '/alarms' },
				{ key: 'rules', label: 'Rules', icon: <ControlOutlined />, path: '/rules' },
			],
		},
		{
			key: 'device-management',
			icon: <AppstoreAddOutlined />,
			label: 'Device Management',
			hasDropdown: true,
			submenu: [
				{ key: 'model-setting', label: 'Model Setting', icon: <BlockOutlined />, path: '/devices/models' },
				{ key: 'device-setting', label: 'Device Setting', icon: <AppstoreAddOutlined />, path: '/devices' },
				{ key: 'parameter-setting', label: 'Parameter Setting', icon: <FormOutlined />, path: '/devices/parameters' },
				{ key: 'modbus-setting', label: 'Modbus Setting', icon: <ClusterOutlined />, path: '/settings/modbus' },
				{ key: 'add-model', label: 'Add Model', icon: <BlockOutlined />, path: '/configuration/add-model' },
				{ key: 'add-device', label: 'Add Device', icon: <AppstoreAddOutlined />, path: '/devices/add' },
				{ key: 'supplement-add-parameter', label: 'Supplement Add Parameter', icon: <FormOutlined />, path: '/configuration/add-parameter' },
			],
		},
		{
			key: 'logic-management',
			icon: <ControlOutlined />,
			label: 'Logic Management',
			hasDropdown: true,
			submenu: [
				{ key: 'add-rule', label: 'Add Rule', icon: <ControlOutlined />, path: '/configuration/add-rule' },
				{ key: 'add-alarm', label: 'Add Alarm', icon: <BellOutlined />, path: '/configuration/add-alarm' },
			],
		},
		{
			key: 'communication-management',
			icon: <ApiOutlined />,
			label: 'Communication Management',
			hasDropdown: true,
			submenu: [
				{ key: 'network-setting', label: 'Network Setting', icon: <WifiOutlined />, path: '/settings/network' },
				{ key: 'system-setting', label: 'System Setting', icon: <SettingOutlined />, path: '/settings/system' },
				{ key: 'mqtt-setting', label: 'MQTT Setting', icon: <ApiOutlined />, path: '/settings/mqtt' },
				{ key: 'account-setting', label: 'Account Setting', icon: <UserOutlined />, path: '/account' },
			],
		},
	];

	const handleItemClick = (item: typeof navigationItems[0]) => {
		if (collapsed && item.hasDropdown) return;
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
				width: '100%',
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
								justifyContent: collapsed ? 'center' : 'flex-start',
								gap: 12,
								padding: collapsed ? '12px 0' : '12px 16px',
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
							{!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
							{!collapsed && item.hasDropdown && (
								<DownOutlined style={{ 
									fontSize: 10,
									opacity: 0.6,
									transition: 'transform 0.3s',
									transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
								}} />
							)}
						</div>
						
						{/* Submenu Items */}
						{!collapsed && item.hasDropdown && (
							<div style={{
								paddingLeft: 8,
								paddingRight: 8,
								marginTop: expanded ? 4 : 0,
								marginBottom: expanded ? 4 : 0,
								maxHeight: expanded ? 500 : 0,
								opacity: expanded ? 1 : 0,
								overflow: 'hidden',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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