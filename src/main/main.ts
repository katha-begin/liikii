import { app, BrowserWindow, Menu, shell, ipcMain, Tray, nativeImage } from 'electron'
import { join } from 'path'
import { isDev } from './utils'

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

const createWindow = (): void => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1120, // As specified in PRD
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default', // Can be changed to 'hidden' for frameless
    show: false, // Don't show until ready
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
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
}

const createTray = (): void => {
  // Create tray icon (placeholder - will need actual icon)
  const icon = nativeImage.createEmpty()
  tray = new Tray(icon)
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Liikii', click: () => mainWindow?.show() },
    { type: 'separator' },
    { label: 'Build Channel', submenu: [
      { label: 'Stable', type: 'radio', checked: true },
      { label: 'Beta', type: 'radio' },
      { label: 'Nightly', type: 'radio' },
    ]},
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ])
  
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Liikii Desktop')
}

const createMenu = (): void => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { label: 'New Project...', accelerator: 'CmdOrCtrl+N' },
        { label: 'Import CSV...', accelerator: 'CmdOrCtrl+I' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
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
        { label: 'Toggle Theme', accelerator: 'CmdOrCtrl+Shift+T' }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'DCC Launcher...', accelerator: 'CmdOrCtrl+Shift+D' },
        { label: 'Environment Manager...' },
        { label: 'Build Picker...' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Documentation', click: () => shell.openExternal('https://docs.example.com') },
        { label: 'About' }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// App event handlers
app.whenReady().then(() => {
  createWindow()
  createMenu()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for renderer communication
ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('show-message-box', async (_, options) => {
  const { dialog } = await import('electron')
  return dialog.showMessageBox(mainWindow!, options)
})
