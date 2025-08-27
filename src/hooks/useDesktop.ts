import { useEffect, useState, useCallback } from 'react'
import type { FileFilter, MessageBoxOptions, NotificationOptions } from '@/types/electron'

// Desktop functionality hook
export const useDesktop = () => {
  const [isElectron, setIsElectron] = useState(false)
  const [appInfo, setAppInfo] = useState<any>(null)
  const [buildChannel, setBuildChannelState] = useState<string>('stable')

  useEffect(() => {
    // Check if running in Electron
    const electronAvailable = typeof window !== 'undefined' && !!window.electronAPI
    setIsElectron(electronAvailable)

    if (electronAvailable && window.electronAPI) {
      // Load app info
      window.electronAPI.getAppInfo().then(setAppInfo)
      window.electronAPI.getBuildChannel().then(setBuildChannelState)

      // Set up event listeners
      window.electronAPI.onBuildChannelChanged((channel: string) => {
        setBuildChannelState(channel)
      })

      // Cleanup on unmount
      return () => {
        window.electronAPI?.removeAllListeners('build-channel-changed')
      }
    }
  }, [])

  // Window operations
  const minimizeWindow = useCallback(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.minimizeWindow()
    }
  }, [isElectron])

  const maximizeWindow = useCallback(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.maximizeWindow()
    }
  }, [isElectron])

  const closeWindow = useCallback(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.closeWindow()
    }
  }, [isElectron])

  const toggleFullscreen = useCallback(() => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.toggleFullscreen()
    }
  }, [isElectron])

  const setWindowTitle = useCallback((title: string) => {
    if (isElectron && window.electronAPI) {
      window.electronAPI.setWindowTitle(title)
    } else {
      document.title = title
    }
  }, [isElectron])

  // File operations
  const openFile = useCallback(async (filters?: FileFilter[]) => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.openFile(filters)
    }
    return null
  }, [isElectron])

  const saveFile = useCallback(async (data: string, defaultPath?: string) => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.saveFile(data, defaultPath)
    }
    return null
  }, [isElectron])

  // Dialog operations
  const showMessageBox = useCallback(async (options: MessageBoxOptions) => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.showMessageBox(options)
    }
    // Fallback for web
    const result = confirm(`${options.message}\n\n${options.detail || ''}`)
    return { response: result ? 0 : 1, checkboxChecked: false }
  }, [isElectron])

  const showErrorBox = useCallback(async (title: string, content: string) => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.showErrorBox(title, content)
    }
    // Fallback for web
    alert(`${title}\n\n${content}`)
  }, [isElectron])

  // Notification operations
  const showNotification = useCallback(async (options: NotificationOptions) => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.showNotification(options)
    }
    
    // Fallback to web notifications
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon,
          silent: options.silent
        })
        
        if (options.onClick) {
          notification.onclick = () => {
            // Handle click
          }
        }
        
        return true
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          return showNotification(options)
        }
      }
    }
    
    return false
  }, [isElectron])

  // Build channel operations
  const setBuildChannel = useCallback(async (channel: string) => {
    if (isElectron && window.electronAPI) {
      const newChannel = await window.electronAPI.setBuildChannel(channel)
      setBuildChannelState(newChannel)
      return newChannel
    }
    return channel
  }, [isElectron])

  // DCC operations
  const launchDCC = useCallback(async (config: any) => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.launchDCC(config)
    }
    return false
  }, [isElectron])

  const getDCCApplications = useCallback(async () => {
    if (isElectron && window.electronAPI) {
      return await window.electronAPI.getDCCApplications()
    }
    return []
  }, [isElectron])

  return {
    isElectron,
    appInfo,
    buildChannel,
    
    // Window operations
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    toggleFullscreen,
    setWindowTitle,
    
    // File operations
    openFile,
    saveFile,
    
    // Dialog operations
    showMessageBox,
    showErrorBox,
    
    // Notification operations
    showNotification,
    
    // Build channel operations
    setBuildChannel,
    
    // DCC operations
    launchDCC,
    getDCCApplications
  }
}

// Menu action hook
export const useMenuActions = () => {
  const [lastAction, setLastAction] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onMenuAction((action: string) => {
        setLastAction(action)
      })

      return () => {
        window.electronAPI?.removeAllListeners('menu-action')
      }
    }
  }, [])

  const clearLastAction = useCallback(() => {
    setLastAction(null)
  }, [])

  return {
    lastAction,
    clearLastAction
  }
}

// Theme toggle hook
export const useThemeToggle = () => {
  const [themeToggleRequested, setThemeToggleRequested] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.onThemeToggleRequested(() => {
        setThemeToggleRequested(true)
      })

      return () => {
        window.electronAPI?.removeAllListeners('theme-toggle-requested')
      }
    }
  }, [])

  const clearThemeToggleRequest = useCallback(() => {
    setThemeToggleRequested(false)
  }, [])

  return {
    themeToggleRequested,
    clearThemeToggleRequest
  }
}

export default useDesktop
