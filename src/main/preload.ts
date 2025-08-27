import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  showMessageBox: (options: Electron.MessageBoxOptions) => 
    ipcRenderer.invoke('show-message-box', options),
  
  // File system operations (for CSV import, DCC integration)
  openFile: (filters?: Electron.FileFilter[]) => 
    ipcRenderer.invoke('open-file', filters),
  saveFile: (data: string, defaultPath?: string) => 
    ipcRenderer.invoke('save-file', data, defaultPath),
  
  // DCC launcher operations
  launchDCC: (config: any) => 
    ipcRenderer.invoke('launch-dcc', config),
  
  // Theme and window operations
  toggleTheme: () => ipcRenderer.invoke('toggle-theme'),
  setWindowTitle: (title: string) => 
    ipcRenderer.invoke('set-window-title', title),
})

// Type definitions for the exposed API
export interface ElectronAPI {
  getAppVersion: () => Promise<string>
  showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>
  openFile: (filters?: Electron.FileFilter[]) => Promise<string | null>
  saveFile: (data: string, defaultPath?: string) => Promise<string | null>
  launchDCC: (config: any) => Promise<boolean>
  toggleTheme: () => Promise<void>
  setWindowTitle: (title: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
