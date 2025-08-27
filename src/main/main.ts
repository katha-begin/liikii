import { app, BrowserWindow, Menu, shell, ipcMain, Tray, nativeImage, Notification, dialog, globalShortcut } from 'electron'
import { join } from 'path'
import { writeFileSync, existsSync } from 'fs'
import { isDev } from './utils'

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

// Add isQuiting property to app
declare global {
  namespace Electron {
    interface App {
      isQuiting?: boolean
    }
  }
}

// Window state management
interface WindowState {
  width: number
  height: number
  x?: number
  y?: number
  isMaximized: boolean
  isFullScreen: boolean
}

// const defaultWindowState: WindowState = {
//   width: 1200,
//   height: 800,
//   isMaximized: false,
//   isFullScreen: false
// }

// Get window state file path
const getWindowStateFilePath = (): string => {
  return join(app.getPath('userData'), 'window-state.json')
}

// Load window state from file (currently unused in development)
// const loadWindowState = (): WindowState => {
//   try {
//     const filePath = getWindowStateFilePath()
//     if (existsSync(filePath)) {
//       const data = readFileSync(filePath, 'utf8')
//       return { ...defaultWindowState, ...JSON.parse(data) }
//     }
//   } catch (error) {
//     console.warn('Failed to load window state:', error)
//   }
//   return defaultWindowState
// }

// Save window state to file
const saveWindowState = (): void => {
  if (!mainWindow) return

  try {
    const bounds = mainWindow.getBounds()
    const state: WindowState = {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: mainWindow.isMaximized(),
      isFullScreen: mainWindow.isFullScreen()
    }

    const filePath = getWindowStateFilePath()
    writeFileSync(filePath, JSON.stringify(state, null, 2))
  } catch (error) {
    console.warn('Failed to save window state:', error)
  }
}

const createWindow = async (): Promise<void> => {
  // Create the browser window with simple defaults
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1120, // As specified in PRD
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
      webSecurity: !isDev, // Allow local resources in dev
    },
    titleBarStyle: 'default', // Can be changed to 'hidden' for frameless
    show: true, // Show immediately
    icon: isDev ? undefined : join(__dirname, '../assets/icon.png'), // App icon
  })

  console.log('Window created and should be visible')

  // Load the app
  if (isDev) {
    const devPort = process.env.VITE_DEV_PORT || '5173'
    const devUrl = `http://localhost:${devPort}`
    console.log(`Loading development URL: ${devUrl}`)

    try {
      await mainWindow.loadURL(devUrl)
      mainWindow.webContents.openDevTools()
    } catch (error) {
      console.error('Failed to load development URL:', error)
      // Try alternative ports
      const altPorts = ['5174', '5175', '5176']
      for (const port of altPorts) {
        try {
          const altUrl = `http://localhost:${port}`
          console.log(`Trying alternative URL: ${altUrl}`)
          await mainWindow.loadURL(altUrl)
          console.log(`Successfully loaded from port ${port}`)
          mainWindow.webContents.openDevTools()
          break
        } catch (altError) {
          console.log(`Port ${port} failed, trying next...`)
        }
      }
    }
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Window is already shown, no need for state restoration in development

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready-to-show event fired')
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
      console.log('Window shown and focused')
    }
  })

  // Fallback: Show window after a timeout if ready-to-show doesn't fire
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      console.log('Fallback: Showing window after timeout')
      mainWindow.show()
      mainWindow.focus()
    }
  }, 3000)

  // Save window state on resize/move
  mainWindow.on('resize', saveWindowState)
  mainWindow.on('move', saveWindowState)
  mainWindow.on('maximize', saveWindowState)
  mainWindow.on('unmaximize', saveWindowState)
  mainWindow.on('enter-full-screen', saveWindowState)
  mainWindow.on('leave-full-screen', saveWindowState)

  // Handle window close - minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuiting && process.platform !== 'darwin') {
      event.preventDefault()
      mainWindow?.hide()

      // Show notification about minimizing to tray
      if (Notification.isSupported()) {
        new Notification({
          title: 'Liikii Desktop',
          body: 'Application was minimized to tray',
          silent: true
        }).show()
      }
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Handle navigation - prevent navigation away from app
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)

    if (parsedUrl.origin !== 'http://localhost:5173' && !navigationUrl.includes('renderer/index.html')) {
      event.preventDefault()
      shell.openExternal(navigationUrl)
    }
  })
}

const createTray = (): void => {
  // Create tray icon - use a simple icon for now
  let icon: Electron.NativeImage
  try {
    // Try to load app icon, fallback to empty icon
    const iconPath = join(__dirname, '../assets/tray-icon.png')
    icon = existsSync(iconPath) ? nativeImage.createFromPath(iconPath) : nativeImage.createEmpty()

    // Resize icon for tray (16x16 on Windows, 22x22 on macOS)
    if (!icon.isEmpty()) {
      icon = icon.resize({ width: 16, height: 16 })
    }
  } catch (error) {
    console.warn('Failed to load tray icon:', error)
    icon = nativeImage.createEmpty()
  }

  tray = new Tray(icon)

  // Build context menu
  const buildTrayMenu = () => {
    const isVisible = mainWindow?.isVisible() ?? false

    return Menu.buildFromTemplate([
      {
        label: isVisible ? 'Hide Liikii' : 'Show Liikii',
        click: () => {
          if (mainWindow?.isVisible()) {
            mainWindow.hide()
          } else {
            mainWindow?.show()
            mainWindow?.focus()
          }
        }
      },
      { type: 'separator' },
      {
        label: 'New Project...',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow?.show()
          mainWindow?.focus()
          mainWindow?.webContents.send('menu-action', 'new-project')
        }
      },
      {
        label: 'Import CSV...',
        accelerator: 'CmdOrCtrl+I',
        click: () => {
          mainWindow?.show()
          mainWindow?.focus()
          mainWindow?.webContents.send('menu-action', 'import-csv')
        }
      },
      { type: 'separator' },
      {
        label: 'Build Channel',
        submenu: [
          { label: 'Stable', type: 'radio', checked: true, click: () => setBuildChannel('stable') },
          { label: 'Beta', type: 'radio', click: () => setBuildChannel('beta') },
          { label: 'Nightly', type: 'radio', click: () => setBuildChannel('nightly') },
        ]
      },
      {
        label: 'DCC Launcher...',
        click: () => {
          mainWindow?.show()
          mainWindow?.focus()
          mainWindow?.webContents.send('menu-action', 'dcc-launcher')
        }
      },
      { type: 'separator' },
      {
        label: 'About Liikii',
        click: () => showAboutDialog()
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.isQuiting = true
          app.quit()
        }
      }
    ])
  }

  // Set initial context menu
  tray.setContextMenu(buildTrayMenu())
  tray.setToolTip('Liikii Desktop - VFX Production Management')

  // Handle tray click
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.focus()
    } else {
      mainWindow?.show()
      mainWindow?.focus()
    }
  })

  // Update tray menu when window visibility changes
  mainWindow?.on('show', () => tray?.setContextMenu(buildTrayMenu()))
  mainWindow?.on('hide', () => tray?.setContextMenu(buildTrayMenu()))
}

// Build channel management
let currentBuildChannel = 'stable'

const setBuildChannel = (channel: string) => {
  currentBuildChannel = channel
  console.log(`Build channel set to: ${channel}`)

  // Notify renderer about build channel change
  mainWindow?.webContents.send('build-channel-changed', channel)

  // Show notification
  if (Notification.isSupported()) {
    new Notification({
      title: 'Build Channel Changed',
      body: `Switched to ${channel} channel`,
      silent: true
    }).show()
  }
}

// About dialog
const showAboutDialog = () => {
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'About Liikii Desktop',
    message: 'Liikii Desktop',
    detail: `Version: ${app.getVersion()}\nBuild Channel: ${currentBuildChannel}\n\nVFX Production Management Tool\nBuilt with Electron and React`,
    buttons: ['OK']
  })
}

const createMenu = (): void => {
  const isMac = process.platform === 'darwin'

  const template: Electron.MenuItemConstructorOptions[] = [
    // macOS app menu
    ...(isMac ? [{
      label: app.getName(),
      submenu: [
        { label: 'About Liikii', click: () => showAboutDialog() },
        { type: 'separator' as const },
        { label: 'Preferences...', accelerator: 'Cmd+,' },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const }
      ]
    }] : []),

    // File menu
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project...',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu-action', 'new-project')
        },
        {
          label: 'Open Project...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu-action', 'open-project')
        },
        { type: 'separator' },
        {
          label: 'Import CSV...',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow?.webContents.send('menu-action', 'import-csv')
        },
        {
          label: 'Export Data...',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow?.webContents.send('menu-action', 'export-data')
        },
        { type: 'separator' },
        ...(!isMac ? [
          {
            label: 'Preferences...',
            accelerator: 'Ctrl+,',
            click: () => mainWindow?.webContents.send('menu-action', 'preferences')
          },
          { type: 'separator' as const },
          { role: 'quit' as const }
        ] : [])
      ]
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find...',
          accelerator: 'CmdOrCtrl+F',
          click: () => mainWindow?.webContents.send('menu-action', 'find')
        }
      ]
    },

    // View menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Toggle Theme',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: () => mainWindow?.webContents.send('menu-action', 'toggle-theme')
        },
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow?.webContents.send('menu-action', 'toggle-sidebar')
        }
      ]
    },

    // Tools menu
    {
      label: 'Tools',
      submenu: [
        {
          label: 'DCC Launcher...',
          accelerator: 'CmdOrCtrl+Shift+D',
          click: () => mainWindow?.webContents.send('menu-action', 'dcc-launcher')
        },
        {
          label: 'Environment Manager...',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => mainWindow?.webContents.send('menu-action', 'environment-manager')
        },
        {
          label: 'Build Picker...',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => mainWindow?.webContents.send('menu-action', 'build-picker')
        },
        { type: 'separator' },
        {
          label: 'Task Manager',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: () => mainWindow?.webContents.send('menu-action', 'task-manager')
        }
      ]
    },

    // Window menu (macOS)
    ...(isMac ? [{
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'close' as const },
        { type: 'separator' as const },
        { role: 'front' as const }
      ]
    }] : []),

    // Help menu
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://docs.liikii.com')
        },
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: () => mainWindow?.webContents.send('menu-action', 'keyboard-shortcuts')
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/liikii/desktop/issues')
        },
        { type: 'separator' },
        ...(!isMac ? [
          {
            label: 'About Liikii',
            click: () => showAboutDialog()
          }
        ] : [])
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// Global shortcuts
const registerGlobalShortcuts = (): void => {
  // Quick show/hide window
  globalShortcut.register('CmdOrCtrl+Shift+L', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow?.show()
      mainWindow?.focus()
    }
  })

  // Quick new project
  globalShortcut.register('CmdOrCtrl+Alt+N', () => {
    mainWindow?.show()
    mainWindow?.focus()
    mainWindow?.webContents.send('menu-action', 'new-project')
  })
}

// App event handlers
app.whenReady().then(async () => {
  await createWindow()
  createMenu()
  createTray()
  registerGlobalShortcuts()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow()
    } else {
      mainWindow?.show()
      mainWindow?.focus()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  app.isQuiting = true
  saveWindowState()
})

app.on('will-quit', () => {
  // Unregister all global shortcuts
  globalShortcut.unregisterAll()
})

// IPC handlers for renderer communication
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    name: app.getName(),
    buildChannel: currentBuildChannel,
    platform: process.platform,
    arch: process.arch,
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node,
    chromeVersion: process.versions.chrome
  }
})

ipcMain.handle('show-message-box', async (_, options) => {
  return dialog.showMessageBox(mainWindow!, options)
})

ipcMain.handle('show-error-box', async (_, title, content) => {
  return dialog.showErrorBox(title, content)
})

ipcMain.handle('show-open-dialog', async (_, options) => {
  return dialog.showOpenDialog(mainWindow!, options)
})

ipcMain.handle('show-save-dialog', async (_, options) => {
  return dialog.showSaveDialog(mainWindow!, options)
})

// File system operations
ipcMain.handle('open-file', async (_, filters) => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: filters || [
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('save-file', async (_, data, defaultPath) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath,
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'CSV Files', extensions: ['csv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (!result.canceled && result.filePath) {
    try {
      writeFileSync(result.filePath, data, 'utf8')
      return result.filePath
    } catch (error) {
      console.error('Failed to save file:', error)
      throw error
    }
  }
  return null
})

// Window operations
ipcMain.handle('set-window-title', async (_, title) => {
  mainWindow?.setTitle(title)
})

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize()
})

ipcMain.handle('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.handle('close-window', () => {
  mainWindow?.close()
})

ipcMain.handle('toggle-fullscreen', () => {
  const isFullScreen = mainWindow?.isFullScreen() ?? false
  mainWindow?.setFullScreen(!isFullScreen)
})

// Theme operations
ipcMain.handle('toggle-theme', () => {
  mainWindow?.webContents.send('theme-toggle-requested')
})

// Notification operations
ipcMain.handle('show-notification', (_, options) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: options.title,
      body: options.body,
      icon: options.icon,
      silent: options.silent ?? false
    })

    if (options.onClick) {
      notification.on('click', () => {
        mainWindow?.webContents.send('notification-clicked', options.id)
      })
    }

    notification.show()
    return true
  }
  return false
})

// Build channel operations
ipcMain.handle('get-build-channel', () => {
  return currentBuildChannel
})

ipcMain.handle('set-build-channel', (_, channel) => {
  setBuildChannel(channel)
  return currentBuildChannel
})

// DCC launcher operations (placeholder)
ipcMain.handle('launch-dcc', async (_, config) => {
  console.log('DCC launch requested:', config)
  // TODO: Implement actual DCC launching logic
  return true
})

ipcMain.handle('get-dcc-applications', () => {
  // TODO: Scan system for installed DCC applications
  return [
    { name: 'Maya', path: '/usr/autodesk/maya2024/bin/maya', version: '2024' },
    { name: 'Houdini', path: '/opt/hfs19.5/bin/houdini', version: '19.5' },
    { name: 'Nuke', path: '/usr/local/Nuke15.0v1/Nuke15.0', version: '15.0v1' }
  ]
})
