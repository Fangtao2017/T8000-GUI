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
	ApiOutlined,
	UserOutlined
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

		if (effectivePath === '/' || effectivePath.startsWith('/analysis') || effectivePath.startsWith('/log') || effectivePath.startsWith('/monitor')) {
			return 'home';
		}
		if (effectivePath.startsWith('/devices') || effectivePath.startsWith('/settings/modbus') || effectivePath.startsWith('/configuration/add-model') || effectivePath.startsWith('/configuration/add-parameter')) {
			return 'connected-sensor';
		}
		if (effectivePath.startsWith('/alarms') || effectivePath.startsWith('/rules') || effectivePath.startsWith('/configuration/add-rule') || effectivePath.startsWith('/configuration/add-alarm')) {
			return 'logic-configuration';
		}
		if (effectivePath.startsWith('/settings') || effectivePath.startsWith('/account')) {
			return 'system-configuration';
		}
		return 'home';
	};

	const getMenuItems = () => {
		const section = getSection();

		if (section === 'connected-sensor') {
			return [
				{ key: 'device-list', label: 'Sensor', icon: <SettingOutlined />, onClick: () => navigate(getPath('/devices')) },
				{ key: 'model-setting', label: 'Model', icon: <BlockOutlined />, onClick: () => navigate(getPath('/devices/models')) },
				{ key: 'parameter-setting', label: 'Parameter', icon: <FormOutlined />, onClick: () => navigate(getPath('/devices/parameters')) },
				{ key: 'modbus-setting', label: 'Modbus', icon: <ClusterOutlined />, onClick: () => navigate(getPath('/settings/modbus')) },
			];
		}

		if (section === 'logic-configuration') {
			return [
				{ key: 'alarm-setting', label: 'Alarm Setting', icon: <BellOutlined />, onClick: () => navigate(getPath('/alarms')) },
				{ key: 'rules-setting', label: 'Rules Setting', icon: <ControlOutlined />, onClick: () => navigate(getPath('/rules')) },
			];
		}

		if (section === 'system-configuration') {
			return [
				{ key: 'network-setting', label: 'Network Setting', icon: <WifiOutlined />, onClick: () => navigate(getPath('/settings/network')) },
				{ key: 'system-setting', label: 'Firmware Settings', icon: <SettingOutlined />, onClick: () => navigate(getPath('/settings/system')) },
				{ key: 'mqtt-setting', label: 'MQTT Setting', icon: <ApiOutlined />, onClick: () => navigate(getPath('/settings/mqtt')) },
				{ key: 'account-setting', label: 'Local Account', icon: <UserOutlined />, onClick: () => navigate(getPath('/account')) },
			];
		}

		// Default Home items
		return [
			{ key: 'overview', icon: <HomeOutlined />, label: 'Overview', onClick: () => navigate(getPath('/')) },
			{ key: 'analysis', icon: <LineChartOutlined />, label: 'Analysis', onClick: () => navigate(getPath('/analysis')) },
			{ key: 'log', icon: <FileTextOutlined />, label: 'Log', onClick: () => navigate(getPath('/log')) },
			{ key: 'monitor', icon: <AlertOutlined />, label: 'Alarm & Rule Status', onClick: () => navigate(getPath('/monitor')) },
		];
	};

	const getSectionTitle = () => {
		const section = getSection();
		if (section === 'connected-sensor') return 'Connected Sensor';
		if (section === 'logic-configuration') return 'Logic Configuration';
		if (section === 'system-configuration') return 'System Configuration';
		return 'Device Monitor';
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

	return (
		<div style={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
			<div style={{ 
				maxWidth: 1400, 
				margin: '0 auto', 
				display: 'flex', 
				alignItems: 'center',
				justifyContent: 'center',
				padding: '0 24px',
				height: 48
			}}>
				<div style={{ 
					fontSize: '16px', 
					fontWeight: 600, 
					color: '#232f3e',
					marginRight: 24,
					whiteSpace: 'nowrap'
				}}>
					{getSectionTitle()}
				</div>
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
							minWidth: 600,
							background: 'transparent',
							fontSize: 16,
							fontWeight: 500
						}}
					/>
				</ConfigProvider>
			</div>
		</div>
	);
};

export default SecondaryNav;
