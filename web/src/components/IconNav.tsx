import React, { useState } from 'react';
import { Flex, Menu } from 'antd';
import type { MenuProps } from 'antd';
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
	const [hoveredSection, setHoveredSection] = useState<string | null>(null);
	const [menuPosition, setMenuPosition] = useState({ top: 0 });

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
				{ key: 'add-parameter', label: 'Add Parameter', icon: <FormOutlined />, path: '/configuration/add-parameter' },
				{ key: 'add-alarm', label: 'Add Alarm & Rule', icon: <BellOutlined />, path: '/configuration/add-alarm' },
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

	const handleIconClick = (item: typeof navigationItems[0]) => {
		if (!item.hasDropdown) {
			navigate(item.path!);
		}
	};

	const handleMouseEnter = (item: typeof navigationItems[0], e: React.MouseEvent<HTMLDivElement>) => {
		if (item.hasDropdown) {
			const rect = e.currentTarget.getBoundingClientRect();
			setMenuPosition({ top: rect.top });
			setHoveredSection(item.key);
		}
	};

	const handleMouseLeave = () => {
		// Don't close immediately to allow moving to submenu
	};

	const handleSubmenuClick: MenuProps['onClick'] = ({ key }) => {
		const allItems = navigationItems.flatMap(nav => nav.submenu || []);
		const item = allItems.find(i => i.key === key);
		if (item) {
			navigate(item.path);
			setHoveredSection(null);
		}
	};

	return (
		<>
			<Flex
				vertical
				gap={8}
				style={{
					width: 180,
					background: '#001529',
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
					return (
						<div
							key={item.key}
							onClick={() => handleIconClick(item)}
							onMouseEnter={(e) => {
								handleMouseEnter(item, e);
								if (!active) {
									e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
								}
							}}
							onMouseLeave={(e) => {
								handleMouseLeave();
								if (!active) {
									e.currentTarget.style.background = 'transparent';
								}
							}}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 12,
								padding: '12px 16px',
								margin: '0 8px',
								borderRadius: 4,
								color: active ? '#1677ff' : 'rgba(255,255,255,0.85)',
								cursor: 'pointer',
								transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
								background: active ? 'rgba(22, 119, 255, 0.15)' : 'transparent',
								position: 'relative',
								fontSize: 14,
								fontWeight: active ? 500 : 400,
							}}
						>
							<span style={{ fontSize: 18 }}>{item.icon}</span>
							<span style={{ flex: 1 }}>{item.label}</span>
							{item.hasDropdown && (
								<DownOutlined style={{ 
									fontSize: 10,
									opacity: 0.6,
									transition: 'transform 0.3s',
									transform: hoveredSection === item.key ? 'rotate(180deg)' : 'rotate(0deg)',
								}} />
							)}
						</div>
					);
				})}
			</Flex>

			{/* Dropdown Menu */}
			{hoveredSection && (
				<div
					style={{
						position: 'fixed',
						left: 180,
						top: menuPosition.top,
						zIndex: 1002,
					}}
					onMouseEnter={() => {
						// Keep menu open when hovering over it
					}}
					onMouseLeave={() => {
						setHoveredSection(null);
					}}
				>
					<Menu
						mode="vertical"
						theme="dark"
						onClick={handleSubmenuClick}
						selectedKeys={[location.pathname]}
						items={navigationItems
							.find(item => item.key === hoveredSection)
							?.submenu?.map(sub => ({
								key: sub.key,
								icon: sub.icon,
								label: sub.label,
							})) || []
						}
						style={{
							width: 220,
							background: '#001529',
							border: '1px solid rgba(255,255,255,0.1)',
							borderRadius: '0 4px 4px 0',
							boxShadow: '4px 0 8px rgba(0,0,0,0.3)',
						}}
					/>
				</div>
			)}
		</>
	);
};

export default IconNav;