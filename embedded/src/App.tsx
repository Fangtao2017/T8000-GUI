import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from './layouts/RootLayout';
import Home from "./pages/Home";
import Monitor from "./pages/Monitor";
import RealTimeMonitor from "./pages/RealTimeMonitor";
import Alarms from "./pages/Alarms";
import Log from "./pages/Log";
import Analysis from "./pages/Analysis";
import Devices from "./pages/Devices";
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
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";

const App: React.FC = () => {
return (
<Routes>
	<Route path="/login" element={<Login />} />
	{/* Embedded Web - Single Device Layer */}
	<Route path="/" element={<RootLayout />}>
		<Route index element={<Home />} />
		<Route path="monitor" element={<Monitor />} />
		<Route path="realtime" element={<RealTimeMonitor />} />
		<Route path="alarms" element={<Alarms />} />
		<Route path="log" element={<Log />} />
		<Route path="analysis" element={<Analysis />} />
		<Route path="rules" element={<DeviceRules />} />

		{/* Devices 区域 */}
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
		<Route path="user-management" element={<UserManagement />} />

		<Route path="*" element={<Navigate to="/" replace />} />
	</Route>
</Routes>
);
};


export default App;