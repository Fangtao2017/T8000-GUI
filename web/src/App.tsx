import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from './layouts/RootLayout';
import Home from "./pages/Home";
import Alarms from "./pages/Alarms";
import Log from "./pages/Log";
import Analysis from "./pages/Analysis";
import Devices from "./pages/devices";
import DeviceAdd from "./pages/DeviceAdd";
import DeviceRules from "./pages/DeviceRules";
import AddModel from "./pages/AddModel";
import AddParameter from "./pages/AddParameter";
import AddAlarmRule from "./pages/AddAlarm";
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
		<Route path="alarms" element={<Alarms />} />
		<Route path="log" element={<Log />} />
		<Route path="analysis" element={<Analysis />} />
		<Route path="rules" element={<DeviceRules />} />

		{/* Devices 区域，可拓展子页面 */}
		<Route path="devices" element={<Devices />} />
		<Route path="devices/add" element={<DeviceAdd />} />

		{/* Configuration 区域 */}
		<Route path="configuration/add-model" element={<AddModel />} />
		<Route path="configuration/add-parameter" element={<AddParameter />} />
		<Route path="configuration/add-alarm" element={<AddAlarmRule />} />

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