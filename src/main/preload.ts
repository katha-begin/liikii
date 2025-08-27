import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),

  // Dialog operations
  showMessageBox: (options: Electron.MessageBoxOptions) =>
    ipcRenderer.invoke('show-message-box', options),
  showErrorBox: (title: string, content: string) =>
    ipcRenderer.invoke('show-error-box', title, content),
  showOpenDialog: (options: Electron.OpenDialogOptions) =>
    ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options: Electron.SaveDialogOptions) =>
    ipcRenderer.invoke('show-save-dialog', options),

  // File system operations
  openFile: (filters?: Electron.FileFilter[]) =>
    ipcRenderer.invoke('open-file', filters),
  saveFile: (data: string, defaultPath?: string) =>
    ipcRenderer.invoke('save-file', data, defaultPath),

  // Window operations
  setWindowTitle: (title: string) =>
    ipcRenderer.invoke('set-window-title', title),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),

  // Theme operations
  toggleTheme: () => ipcRenderer.invoke('toggle-theme'),

  // Notification operations
  showNotification: (options: {
    title: string
    body: string
    icon?: string
    silent?: boolean
    onClick?: boolean
    id?: string
  }) => ipcRenderer.invoke('show-notification', options),

  // Build channel operations
  getBuildChannel: () => ipcRenderer.invoke('get-build-channel'),
  setBuildChannel: (channel: string) => ipcRenderer.invoke('set-build-channel', channel),

  // DCC launcher operations
  launchDCC: (config: any) => ipcRenderer.invoke('launch-dcc', config),
  getDCCApplications: () => ipcRenderer.invoke('get-dcc-applications'),

  // Event listeners
  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-action', (_, action) => callback(action))
  },
  onBuildChannelChanged: (callback: (channel: string) => void) => {
    ipcRenderer.on('build-channel-changed', (_, channel) => callback(channel))
  },
  onThemeToggleRequested: (callback: () => void) => {
    ipcRenderer.on('theme-toggle-requested', callback)
  },
  onNotificationClicked: (callback: (id: string) => void) => {
    ipcRenderer.on('notification-clicked', (_, id) => callback(id))
  },

  // Remove event listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel)
  }
})

// Type definitions for the exposed API
export interface AppInfo {
  version: string
  name: string
  buildChannel: string
  platform: string
  arch: string
  electronVersion: string
  nodeVersion: string
  chromeVersion: string
}

export interface DCCApplication {
  name: string
  path: string
  version: string
}

export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  silent?: boolean
  onClick?: boolean
  id?: string
}

export interface ElectronAPI {
  // App information
  getAppVersion: () => Promise<string>
  getAppInfo: () => Promise<AppInfo>

  // Dialog operations
  showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>
  showErrorBox: (title: string, content: string) => Promise<void>
  showOpenDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
  showSaveDialog: (options: Electron.SaveDialogOptions) => Promise<Electron.SaveDialogReturnValue>

  // File system operations
  openFile: (filters?: Electron.FileFilter[]) => Promise<string | null>
  saveFile: (data: string, defaultPath?: string) => Promise<string | null>

  // Window operations
  setWindowTitle: (title: string) => Promise<void>
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  closeWindow: () => Promise<void>
  toggleFullscreen: () => Promise<void>

  // Theme operations
  toggleTheme: () => Promise<void>

  // Notification operations
  showNotification: (options: NotificationOptions) => Promise<boolean>

  // Build channel operations
  getBuildChannel: () => Promise<string>
  setBuildChannel: (channel: string) => Promise<string>

  // DCC launcher operations
  launchDCC: (config: any) => Promise<boolean>
  getDCCApplications: () => Promise<DCCApplication[]>

  // Event listeners
  onMenuAction: (callback: (action: string) => void) => void
  onBuildChannelChanged: (callback: (channel: string) => void) => void
  onThemeToggleRequested: (callback: () => void) => void
  onNotificationClicked: (callback: (id: string) => void) => void

  // Remove event listeners
  removeAllListeners: (channel: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
