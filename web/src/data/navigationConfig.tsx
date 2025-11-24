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
  WifiOutlined,
  UserOutlined
} from '@ant-design/icons';

export type SectionKey = 'home' | 'connected' | 'logic' | 'system';

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
      { key: 'analysis', label: 'Analysis', path: '/analysis', icon: <LineChartOutlined /> },
      { key: 'log', label: 'Log', path: '/log', icon: <FileTextOutlined /> },
      { key: 'monitor', label: 'Alarm & Rule Status', path: '/monitor', icon: <AlertOutlined /> },
    ],
  },
  connected: {
    key: 'connected',
    label: 'Connected Sensor',
    title: 'Connected Sensor',
    defaultPath: '/devices',
    icon: <SettingOutlined />,
    items: [
      { key: 'device-list', label: 'Device List', path: '/devices', icon: <UnorderedListOutlined /> },
      { key: 'model-setting', label: 'Model Setting', path: '/devices/models', icon: <BlockOutlined /> },
      { key: 'parameter-setting', label: 'Parameter Setting', path: '/devices/parameters', icon: <FormOutlined /> },
      { key: 'modbus-setting', label: 'Modbus Setting', path: '/settings/modbus', icon: <ClusterOutlined /> },
      { key: 'add-model', label: 'Add Model', path: '/configuration/add-model', icon: <BlockOutlined /> },
      { key: 'add-device', label: 'Add Sub-Device', path: '/devices/add', icon: <AppstoreAddOutlined /> },
      { key: 'supplement-add-parameter', label: 'Supplement Add Parameter', path: '/configuration/add-parameter', icon: <FormOutlined /> },
    ],
  },
  logic: {
    key: 'logic',
    label: 'Logic Configuration',
    title: 'Logic Configuration',
    defaultPath: '/alarms',
    icon: <ControlOutlined />,
    items: [
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
      { key: 'account-setting', label: 'Local Account', path: '/account', icon: <UserOutlined /> },
    ],
  },
};

export const sectionOrder: SectionKey[] = ['home', 'connected', 'logic', 'system'];

export const resolveSectionByPath = (effectivePath: string): SectionKey => {
  const path = effectivePath === '' ? '/' : effectivePath;

  if (path === '/' || path.startsWith('/analysis') || path.startsWith('/log') || path.startsWith('/monitor')) {
    return 'home';
  }

  if (
    path === '/devices' ||
    path.startsWith('/devices/') ||
    path.startsWith('/settings/modbus') ||
    path.startsWith('/configuration/add-model') ||
    path.startsWith('/configuration/add-parameter')
  ) {
    return 'connected';
  }

  if (
    path.startsWith('/alarms') ||
    path.startsWith('/rules') ||
    path.startsWith('/configuration/add-rule') ||
    path.startsWith('/configuration/add-alarm')
  ) {
    return 'logic';
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
