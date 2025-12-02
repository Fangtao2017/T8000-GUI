import React from 'react';
import {
  HomeOutlined,
  UnorderedListOutlined,
  LineChartOutlined,
  FileTextOutlined,
  AlertOutlined,
  SettingOutlined,
  BlockOutlined,
  FormOutlined,
  ClusterOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  ControlOutlined,
  ApiOutlined,
  WifiOutlined
} from '@ant-design/icons';

export type SectionKey = 'home' | 'report' | 'sensor-setting' | 'monitor-control' | 'system';

export interface SecondaryNavItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface NavSection {
  key: SectionKey;
  label: string;
  title: string;
  defaultPath: string;
  icon: React.ReactNode;
  items: SecondaryNavItem[];
}

export const navSections: Record<SectionKey, NavSection> = {
  home: {
    key: 'home',
    label: 'Home',
    title: 'Device Monitor',
    defaultPath: '/',
    icon: <HomeOutlined />,
    items: [
      { key: 'overview', label: 'Overview', path: '/', icon: <HomeOutlined /> },
    ],
  },
  report: {
    key: 'report',
    label: 'Report',
    title: 'Report',
    defaultPath: '/analysis',
    icon: <LineChartOutlined />,
    items: [
      { key: 'analysis', label: 'Analysis', path: '/analysis', icon: <LineChartOutlined /> },
      { key: 'log', label: 'Log', path: '/log', icon: <FileTextOutlined /> },
    ],
  },
  'sensor-setting': {
    key: 'sensor-setting',
    label: 'Sensor Setting',
    title: 'Sensor Setting',
    defaultPath: '/devices',
    icon: <SettingOutlined />,
    items: [
      { key: 'device-list', label: 'Device List', path: '/devices', icon: <UnorderedListOutlined /> },
      { key: 'model-setting', label: 'Model Setting', path: '/devices/models', icon: <BlockOutlined /> },
      { key: 'parameter-setting', label: 'Parameter Setting', path: '/devices/parameters', icon: <FormOutlined /> },
      { key: 'modbus-setting', label: 'Source Interface', path: '/settings/modbus', icon: <ClusterOutlined /> },
      { key: 'add-model', label: 'Add Model', path: '/configuration/add-model', icon: <BlockOutlined /> },
      { key: 'add-device', label: 'Add Sub-Device', path: '/devices/add', icon: <AppstoreAddOutlined /> },
      { key: 'supplement-add-parameter', label: 'Supplement Add Parameter', path: '/configuration/add-parameter', icon: <FormOutlined /> },
    ],
  },
  'monitor-control': {
    key: 'monitor-control',
    label: 'Monitor & Control',
    title: 'Monitor & Control',
    defaultPath: '/monitor',
    icon: <ControlOutlined />,
    items: [
      { key: 'monitor', label: 'Alarm & Rule Status', path: '/monitor', icon: <AlertOutlined /> },
      { key: 'alarm-setting', label: 'Alarm Setting', path: '/alarms', icon: <BellOutlined /> },
      { key: 'rules-setting', label: 'Rules Setting', path: '/rules', icon: <ControlOutlined /> },
      { key: 'add-rule', label: 'Add Rule', path: '/configuration/add-rule', icon: <ControlOutlined /> },
      { key: 'add-alarm', label: 'Add Alarm', path: '/configuration/add-alarm', icon: <BellOutlined /> },
    ],
  },
  system: {
    key: 'system',
    label: 'System Configuration',
    title: 'System Configuration',
    defaultPath: '/settings/network',
    icon: <ApiOutlined />,
    items: [
      { key: 'network-setting', label: 'Network Setting', path: '/settings/network', icon: <WifiOutlined /> },
      { key: 'system-setting', label: 'Firmware Settings', path: '/settings/system', icon: <SettingOutlined /> },
      { key: 'mqtt-setting', label: 'MQTT Setting', path: '/settings/mqtt', icon: <ApiOutlined /> },
    ],
  },
};

export const sectionOrder: SectionKey[] = ['home', 'report', 'sensor-setting', 'monitor-control', 'system'];

export const resolveSectionByPath = (effectivePath: string): SectionKey => {
  const path = effectivePath === '' ? '/' : effectivePath;

  if (path === '/') {
    return 'home';
  }

  if (path.startsWith('/analysis') || path.startsWith('/log')) {
    return 'report';
  }

  if (
    path === '/devices' ||
    path.startsWith('/devices/') ||
    path.startsWith('/settings/modbus') ||
    path.startsWith('/configuration/add-model') ||
    path.startsWith('/configuration/add-parameter')
  ) {
    return 'sensor-setting';
  }

  if (
    path.startsWith('/monitor') ||
    path.startsWith('/alarms') ||
    path.startsWith('/rules') ||
    path.startsWith('/configuration/add-rule') ||
    path.startsWith('/configuration/add-alarm')
  ) {
    return 'monitor-control';
  }

  if (
    path.startsWith('/settings/network') ||
    path.startsWith('/settings/system') ||
    path.startsWith('/settings/mqtt') ||
    path.startsWith('/account')
  ) {
    return 'system';
  }

  return 'home';
};
