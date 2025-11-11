import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from './layouts/RootLayout';
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import DeviceAdd from "./pages/DeviceAdd";
import DeviceRules from "./pages/DeviceRules";
import Settings from "./pages/Settings";
import SettingsNetwork from "./pages/settings/Network";
import SettingsMqtt from "./pages/settings/Mqtt";
import SettingsModbus from "./pages/settings/Modbus";
import SettingsSystem from "./pages/settings/System";

const App: React.FC = () => {
return (
<Routes>
	{/* 外层使用 RootLayout 包裹，所有子路由显示在其 <Outlet/> 里 */}
	<Route path="/" element={<RootLayout />}>
		{/* index 表示与父路径相同（/）时渲染的默认子页面 */}
		<Route index element={<Home />} />

		{/* Devices 区域，可拓展子页面 */}
		<Route path="devices" element={<Devices />} />
		<Route path="devices/add" element={<DeviceAdd />} />
		<Route path="devices/rules" element={<DeviceRules />} />

		{/* Settings 区域：嵌套路由 */}
			<Route path="settings" element={<Settings />}>
			<Route index element={<Navigate to="network" replace />} />
			<Route path="network" element={<SettingsNetwork />} />
			<Route path="mqtt" element={<SettingsMqtt />} />
			<Route path="modbus" element={<SettingsModbus />} />
			<Route path="system" element={<SettingsSystem />} />
		</Route>

		{/* 未匹配到的路径，统一重定向到首页（可按需改 404） */}
		<Route path="*" element={<Navigate to="/" replace />} />
	</Route>
</Routes>
);
};


export default App;