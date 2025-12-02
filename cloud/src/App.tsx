import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CloudLayout from './layouts/CloudLayout';

// Home
import CloudHomeOverview from './pages/cloud_home_overview';

// Monitor & Control
import CloudMonitorOverview from './pages/cloud_monitor_overview';
import CloudMonitorRealtime from './pages/cloud_monitor_realtime';
import CloudMonitorAlarmStatus from './pages/cloud_monitor_alarm_status';

// Devices
import CloudDevicesGateways from './pages/cloud_devices_gateways';
import CloudDevicesInventory from './pages/cloud_devices_inventory';
import CloudDevicesModels from './pages/cloud_devices_models';
import CloudDevicesParameters from './pages/cloud_devices_parameters';
import CloudDevicesSource from './pages/cloud_devices_source';

// Rules & Alarms
import CloudRulesAlarmCenter from './pages/cloud_rules_alarm_center';
import CloudRulesTemplates from './pages/cloud_rules_templates';
import CloudRulesMapping from './pages/cloud_rules_mapping';

// Report
import CloudReportTrends from './pages/cloud_report_trends';
import CloudReportEnergy from './pages/cloud_report_energy';
import CloudReportComparison from './pages/cloud_report_comparison';
import CloudReportScheduled from './pages/cloud_report_scheduled';

// Admin
import CloudAdminTenant from './pages/cloud_admin_tenant';
import CloudAdminUsers from './pages/cloud_admin_users';
import CloudAdminNotifications from './pages/cloud_admin_notifications';
import CloudAdminAudit from './pages/cloud_admin_audit';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CloudLayout />}>
        <Route index element={<Navigate to="/home/overview" replace />} />
        
        {/* Home */}
        <Route path="home">
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CloudHomeOverview />} />
        </Route>

        {/* Monitor & Control */}
        <Route path="monitor">
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CloudMonitorOverview />} />
          <Route path="realtime" element={<CloudMonitorRealtime />} />
          <Route path="alarm-status" element={<CloudMonitorAlarmStatus />} />
        </Route>

        {/* Devices */}
        <Route path="devices">
          <Route index element={<Navigate to="gateways" replace />} />
          <Route path="gateways" element={<CloudDevicesGateways />} />
          <Route path="inventory" element={<CloudDevicesInventory />} />
          <Route path="models" element={<CloudDevicesModels />} />
          <Route path="parameters" element={<CloudDevicesParameters />} />
          <Route path="source" element={<CloudDevicesSource />} />
        </Route>

        {/* Rules & Alarms */}
        <Route path="rules">
          <Route index element={<Navigate to="alarm-center" replace />} />
          <Route path="alarm-center" element={<CloudRulesAlarmCenter />} />
          <Route path="templates" element={<CloudRulesTemplates />} />
          <Route path="mapping" element={<CloudRulesMapping />} />
        </Route>

        {/* Report */}
        <Route path="report">
          <Route index element={<Navigate to="trends" replace />} />
          <Route path="trends" element={<CloudReportTrends />} />
          <Route path="energy" element={<CloudReportEnergy />} />
          <Route path="comparison" element={<CloudReportComparison />} />
          <Route path="scheduled" element={<CloudReportScheduled />} />
        </Route>

        {/* Admin */}
        <Route path="admin">
          <Route index element={<Navigate to="tenant" replace />} />
          <Route path="tenant" element={<CloudAdminTenant />} />
          <Route path="users" element={<CloudAdminUsers />} />
          <Route path="notifications" element={<CloudAdminNotifications />} />
          <Route path="audit" element={<CloudAdminAudit />} />
        </Route>

        <Route path="*" element={<Navigate to="/home/overview" replace />} />
      </Route>
    </Routes>
  );
};

export default App;