import React, { useMemo } from 'react';
import { Menu } from 'antd'; // Antd 菜单
import type { MenuProps } from 'antd';
import {
	HomeOutlined,
	AppstoreOutlined,
	PlusCircleOutlined,
	ApiOutlined,
	ClusterOutlined,
	PlayCircleOutlined,
	SettingOutlined,
	WifiOutlined,
	BellOutlined,
	FileTextOutlined,
	LineChartOutlined,
} from '@ant-design/icons'; // 一些图标做区分


// 组件 props：告诉我当前路径（高亮），以及点击要跳转到哪里
interface SidebarProps {
	currentPath: string;
	section: 'home' | 'devices' | 'settings';
	onSelect: (path: string) => void;
}


// 抽离一个生成菜单项的小工具，保证类型推断更友好
function item(
	label: React.ReactNode,
	key: string,
	icon?: React.ReactNode,
): Required<MenuProps>['items'][number] {
	return { key, icon, label } as Required<MenuProps>['items'][number];
}


const Sidebar: React.FC<SidebarProps> = ({ currentPath, section, onSelect }) => {
	// 根据主分区生成对应的侧栏菜单, 当 section 改变时才重算菜单项。这样避免每次渲染都重新分配数组（小优化）。
	const items = useMemo(() => {
			if (section === 'settings') {
				return [
					item('Network settings', '/settings/network', <WifiOutlined />),
					item('MQTT configuration', '/settings/mqtt', <ApiOutlined />),
					item('Modbus settings', '/settings/modbus', <ClusterOutlined />),
					item('System settings', '/settings/system', <SettingOutlined />),
				];
			}
			if (section === 'devices') {
				return [
					item('Add device', '/devices/add', <PlusCircleOutlined />),
				];
		}
		// 默认 Home 的子菜单（可按需扩展）
		return [
			item('Overview', '/', <HomeOutlined />),
			item('All Devices', '/devices', <AppstoreOutlined />),
			item('Analysis', '/analysis', <LineChartOutlined />),
			item('Alarms', '/alarms', <BellOutlined />),
			item('Log', '/log', <FileTextOutlined />),
			item('Rules', '/rules', <PlayCircleOutlined />),
		];
	}, [section]);	// 当访问 /settings 时，将默认高亮 network（因为路由会重定向到 /settings/network）
	const selectedKey = currentPath === '/settings' ? '/settings/network' : currentPath;

	return (
		<div style={{ padding: '8px 0' }}>
			<Menu
				theme="dark"
				mode="inline"
				items={items}
				selectedKeys={[selectedKey]}
				onClick={(e) => onSelect(e.key)}
				style={{ 
					borderRight: 0,
					background: 'transparent',
				}}
				className="custom-sidebar-menu"
			/>
			<style>{`
				.custom-sidebar-menu .ant-menu-item {
					border-radius: 0 24px 24px 0 !important;
					margin: 4px 0 4px 8px !important;
					height: 44px !important;
					line-height: 44px !important;
					padding-left: 16px !important;
					position: relative;
					overflow: hidden;
					transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
				}
				
				.custom-sidebar-menu .ant-menu-item::before {
					content: '';
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					width: 0;
					background: #1677ff;
					transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
					z-index: 0;
				}
				
				.custom-sidebar-menu .ant-menu-item-selected::before {
					width: 100%;
				}
				
				.custom-sidebar-menu .ant-menu-item > * {
					position: relative;
					z-index: 1;
				}
				
				.custom-sidebar-menu .ant-menu-item-selected {
					background: transparent !important;
				}
				
				.custom-sidebar-menu .ant-menu-item:hover:not(.ant-menu-item-selected) {
					background: rgba(255, 255, 255, 0.08) !important;
				}
				
				.custom-sidebar-menu .ant-menu-item-selected .ant-menu-title-content,
				.custom-sidebar-menu .ant-menu-item-selected .anticon {
					color: #fff !important;
				}
			`}</style>
		</div>
	);
};


export default Sidebar;