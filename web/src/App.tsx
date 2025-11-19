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
import AllModels from "./pages/AllModels";
import AllParameters from "./pages/AllParameters";
import AddModel from "./pages/AddModel";
import AddParameter from "./pages/AddParameter";
import AddAlarm from "./pages/AddAlarm";
import AddRule from "./pages/AddRule";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
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
		<Route path="devices/models" element={<AllModels />} />
		<Route path="devices/parameters" element={<AllParameters />} />

		{/* Configuration 区域 */}
		<Route path="configuration/add-model" element={<AddModel />} />
		<Route path="configuration/add-parameter" element={<AddParameter />} />
		<Route path="configuration/add-alarm" element={<AddAlarm />} />
		<Route path="configuration/add-rule" element={<AddRule />} />

		{/* Settings 区域：嵌套路由 */}
			<Route path="settings" element={<Settings />}>
			<Route index element={<Navigate to="network" replace />} />
			<Route path="network" element={<SettingsNetwork />} />
			<Route path="mqtt" element={<SettingsMqtt />} />
			<Route path="modbus" element={<SettingsModbus />} />
			<Route path="system" element={<SettingsSystem />} />
		</Route>

		{/* Account 页面 */}
		<Route path="account" element={<Account />} />

		<Route path="*" element={<Navigate to="/" replace />} />
	</Route>
</Routes>
);
};


export default App;