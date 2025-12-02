import React from 'react';
import { Menu, ConfigProvider } from 'antd';
import { 
	HomeOutlined, 
	LineChartOutlined, 
	FileTextOutlined, 
	AlertOutlined,
	SettingOutlined,
	BlockOutlined,
	FormOutlined,
	ClusterOutlined,
	BellOutlined,
	ControlOutlined,
	WifiOutlined,
	ApiOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const SecondaryNav: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { deviceId } = useParams<{ deviceId: string }>();

	// Helper to format path with deviceId
	const getPath = (path: string) => {
		if (!deviceId) return path;
		if (path === '/') return `/device/${deviceId}`;
		return `/device/${deviceId}${path}`;
	};

	const getSection = () => {
		const path = location.pathname;
		const relativePath = deviceId ? path.replace(`/device/${deviceId}`, '') : path;
		const effectivePath = relativePath === '' ? '/' : relativePath;

		if (effectivePath === '/') {
			return 'home';
		}
		if (effectivePath.startsWith('/analysis') || effectivePath.startsWith('/log')) {
			return 'report';
		}
		if (effectivePath.startsWith('/devices') || effectivePath.startsWith('/settings/modbus') || effectivePath.startsWith('/configuration/add-model') || effectivePath.startsWith('/configuration/add-parameter')) {
			return 'sensor-setting';
		}
		if (effectivePath.startsWith('/monitor') || effectivePath.startsWith('/alarms') || effectivePath.startsWith('/rules') || effectivePath.startsWith('/configuration/add-rule') || effectivePath.startsWith('/configuration/add-alarm')) {
			return 'monitor-control';
		}
		if (effectivePath.startsWith('/settings') || effectivePath.startsWith('/account')) {
			return 'system-configuration';
		}
		return 'home';
	};

	const getMenuItems = () => {
		const section = getSection();

		if (section === 'home') {
			return [];
		}

		if (section === 'report') {
			return [
				{ key: 'analysis', icon: <LineChartOutlined />, label: 'Analysis', onClick: () => navigate(getPath('/analysis')) },
				{ key: 'log', icon: <FileTextOutlined />, label: 'Log', onClick: () => navigate(getPath('/log')) },
			];
		}

		if (section === 'sensor-setting') {
			return [
				{ key: 'device-list', label: 'Sensor', icon: <SettingOutlined />, onClick: () => navigate(getPath('/devices')) },
				{ key: 'model-setting', label: 'Model', icon: <BlockOutlined />, onClick: () => navigate(getPath('/devices/models')) },
				{ key: 'parameter-setting', label: 'Parameter', icon: <FormOutlined />, onClick: () => navigate(getPath('/devices/parameters')) },
				{ key: 'modbus-setting', label: 'Source Interface', icon: <ClusterOutlined />, onClick: () => navigate(getPath('/settings/modbus')) },
			];
		}

		if (section === 'monitor-control') {
			return [
				{ key: 'monitor', icon: <AlertOutlined />, label: 'Alarm & Rule Status', onClick: () => navigate(getPath('/monitor')) },
				{ key: 'alarm-setting', label: 'Alarm', icon: <BellOutlined />, onClick: () => navigate(getPath('/alarms')) },
				{ key: 'rules-setting', label: 'Rules', icon: <ControlOutlined />, onClick: () => navigate(getPath('/rules')) },
			];
		}

		if (section === 'system-configuration') {
			return [
				{ key: 'network-setting', label: 'Network', icon: <WifiOutlined />, onClick: () => navigate(getPath('/settings/network')) },
				{ key: 'system-setting', label: 'Firmware', icon: <SettingOutlined />, onClick: () => navigate(getPath('/settings/system')) },
				{ key: 'mqtt-setting', label: 'MQTT', icon: <ApiOutlined />, onClick: () => navigate(getPath('/settings/mqtt')) },
			];
		}

		return [];
	};

	// Determine selected key based on path
	const getSelectedKey = () => {
		const path = location.pathname;
		const relativePath = deviceId ? path.replace(`/device/${deviceId}`, '') : path;
		const effectivePath = relativePath === '' ? '/' : relativePath;

		if (effectivePath === '/') return ['overview'];
		if (effectivePath.startsWith('/analysis')) return ['analysis'];
		if (effectivePath.startsWith('/log')) return ['log'];
		if (effectivePath.startsWith('/monitor')) return ['monitor'];
		
		if (effectivePath === '/devices') return ['device-list'];
		if (effectivePath === '/devices/models') return ['model-setting'];
		if (effectivePath === '/devices/parameters') return ['parameter-setting'];
		if (effectivePath === '/settings/modbus') return ['modbus-setting'];
		if (effectivePath === '/configuration/add-model') return ['add-model'];
		if (effectivePath === '/devices/add') return ['add-device'];
		if (effectivePath === '/configuration/add-parameter') return ['supplement-add-parameter'];
		
		if (effectivePath === '/alarms') return ['alarm-setting'];
		if (effectivePath === '/rules') return ['rules-setting'];
		if (effectivePath === '/configuration/add-rule') return ['add-rule'];
		if (effectivePath === '/configuration/add-alarm') return ['add-alarm'];
		
		if (effectivePath === '/settings/network') return ['network-setting'];
		if (effectivePath === '/settings/system') return ['system-setting'];
		if (effectivePath === '/settings/mqtt') return ['mqtt-setting'];
		if (effectivePath.startsWith('/account')) return ['account-setting'];
		
		return [];
	};

	const getBreadcrumb = () => {
		const path = location.pathname;
		const relativePath = deviceId ? path.replace(`/device/${deviceId}`, '') : path;
		const effectivePath = relativePath === '' ? '/' : relativePath;

		// Home
		if (effectivePath === '/') return 'T8000 gateway / Home / Overview';
		
		// Report
		if (effectivePath.startsWith('/analysis')) return 'T8000 gateway / Report / Analysis';
		if (effectivePath.startsWith('/log')) return 'T8000 gateway / Report / Log';
		
		// Sensor Setting
		if (effectivePath === '/devices') return 'T8000 gateway / Sensor Setting / Sensor';
		if (effectivePath === '/devices/models') return 'T8000 gateway / Sensor Setting / Model';
		if (effectivePath === '/devices/parameters') return 'T8000 gateway / Sensor Setting / Parameter';
		if (effectivePath === '/settings/modbus') return 'T8000 gateway / Sensor Setting / Source Interface';
		if (effectivePath === '/devices/add') return 'T8000 gateway / Sensor Setting / Add Device';
		if (effectivePath === '/configuration/add-model') return 'T8000 gateway / Sensor Setting / Add Model';
		if (effectivePath === '/configuration/add-parameter') return 'T8000 gateway / Sensor Setting / Add Parameter';
		
		// Monitor & Control
		if (effectivePath.startsWith('/monitor')) return 'T8000 gateway / Monitor & Control / Alarm & Rule Status';
		if (effectivePath === '/alarms') return 'T8000 gateway / Monitor & Control / Alarm';
		if (effectivePath === '/rules') return 'T8000 gateway / Monitor & Control / Rules';
		if (effectivePath === '/configuration/add-rule') return 'T8000 gateway / Monitor & Control / Add Rule';
		if (effectivePath === '/configuration/add-alarm') return 'T8000 gateway / Monitor & Control / Add Alarm';
		
		// System
		if (effectivePath === '/settings/network') return 'T8000 gateway / System / Network';
		if (effectivePath === '/settings/system') return 'T8000 gateway / System / Firmware';
		if (effectivePath === '/settings/mqtt') return 'T8000 gateway / System / MQTT';
		if (effectivePath.startsWith('/account')) return 'T8000 gateway / System / Local Account';
		
		return 'T8000 gateway / Home / Overview';
	};

	const section = getSection();
	if (section === 'home') {
		return null;
	}

	return (
		<div style={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
			<div style={{ 
				width: '100%', 
				display: 'flex', 
				alignItems: 'center',
				padding: '0 0',
				height: 48,
				position: 'relative'
			}}>
				{/* Left Section - Fixed Width to align with TopNav */}
				<div style={{ 
					width: 420, 
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					paddingLeft: 20,
					flexShrink: 0,
					fontSize: 16, 
					fontWeight: 500, 
					color: '#001B34',
					boxSizing: 'border-box'
				}}>
					{getBreadcrumb()}
				</div>

				{/* Separator Line - Aligned with TopNav separator */}
				<div style={{ width: 1, height: 24, backgroundColor: '#001B34', marginRight: 16 }} />

				<ConfigProvider
					theme={{
						components: {
							Menu: {
								colorPrimary: '#001B34',
								itemSelectedColor: '#001B34',
								itemHoverColor: '#001B34',
							},
						},
					}}
				>
					<Menu
						mode="horizontal"
						selectedKeys={getSelectedKey()}
						items={getMenuItems()}
						style={{ 
							borderBottom: 'none', 
							lineHeight: '46px',
							flex: 1,
							background: 'transparent',
							fontSize: 16,
							fontWeight: 500,
							marginLeft: 0
						}}
					/>
				</ConfigProvider>
			</div>
		</div>
	);
};

export default SecondaryNav;
