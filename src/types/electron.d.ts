// Electron API type definitions
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

export interface FileFilter {
  name: string
  extensions: string[]
}

export interface MessageBoxOptions {
  type?: 'none' | 'info' | 'error' | 'question' | 'warning'
  buttons?: string[]
  defaultId?: number
  title?: string
  message: string
  detail?: string
  checkboxLabel?: string
  checkboxChecked?: boolean
  icon?: string
  cancelId?: number
  noLink?: boolean
  normalizeAccessKeys?: boolean
}

export interface MessageBoxReturnValue {
  response: number
  checkboxChecked: boolean
}

export interface OpenDialogOptions {
  title?: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'>
  message?: string
  securityScopedBookmarks?: boolean
}

export interface OpenDialogReturnValue {
  canceled: boolean
  filePaths: string[]
  bookmarks?: string[]
}

export interface SaveDialogOptions {
  title?: string
  defaultPath?: string
  buttonLabel?: string
  filters?: FileFilter[]
  message?: string
  nameFieldLabel?: string
  showsTagField?: boolean
  properties?: Array<'showHiddenFiles' | 'createDirectory' | 'treatPackageAsDirectory' | 'showOverwriteConfirmation' | 'dontAddToRecent'>
  securityScopedBookmarks?: boolean
}

export interface SaveDialogReturnValue {
  canceled: boolean
  filePath?: string
  bookmark?: string
}

export interface ElectronAPI {
  // App information
  getAppVersion: () => Promise<string>
  getAppInfo: () => Promise<AppInfo>
  
  // Dialog operations
  showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxReturnValue>
  showErrorBox: (title: string, content: string) => Promise<void>
  showOpenDialog: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>
  showSaveDialog: (options: SaveDialogOptions) => Promise<SaveDialogReturnValue>
  
  // File system operations
  openFile: (filters?: FileFilter[]) => Promise<string | null>
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
    electronAPI?: ElectronAPI
  }
}
