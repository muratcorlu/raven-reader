'use strict'

import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron'
import updateElectron from 'update-electron-app'
import jetpack from 'fs-jetpack'
import os from 'os'
import Store from 'electron-store'

updateElectron({
  repo: 'mrgodhani/raven-reader',
  updateInterval: '1 hour'
})

/**
* Set `__static` path to static files in production
* https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
*/
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let preferenceWindow
let trayImage
let tray
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`
const store = new Store()

function createMenu () {
  // Create the Application's main menu
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { label: 'Preferences',
          accelerator: 'Command+,',
          click: function () {
            if (typeof preferenceWindow === 'undefined' || preferenceWindow === null || preferenceWindow.isDestroyed()) {
              const modalPath = process.env.NODE_ENV === 'development' ? 'http://localhost:9080/#/user-preference'
                : `file://${__dirname}/index.html#user-preference`
              preferenceWindow = new BrowserWindow({
                width: 860,
                height: 700,
                webPreferences: {
                  webSecurity: false
                },
                useContentSize: false,
                resizable: false
              })
              preferenceWindow.setTitle('Preferences')
              preferenceWindow.loadURL(modalPath)
            } else {
              preferenceWindow.show()
            }
          }
        },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createTray () {
  if (os.platform() === 'darwin') {
    trayImage = require('path').join(__static, '/mactrayiconTemplate.png')
  }

  if (os.platform() === 'win32') {
    trayImage = require('path').join(__static, '/windowstrayicon.ico')
  }

  if (os.platform() === 'linux') {
    trayImage = require('path').join(__static, '/trayicon-linux.png')
  }

  tray = new Tray(trayImage)

  const contextMenu = Menu.buildFromTemplate([
    { role: 'quit' }
  ])

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
  tray.on('click', () => {
    mainWindow.show()
    if (process.platform === 'darwin' && !app.dock.isVisible()) {
      app.dock.show()
    }
  })
}

function createWindow () {
  /**
   * If there is already data in old directory. Moved it to new
   */
  const oldDirectory = jetpack.cwd(app.getPath('userData'))
  const newDirectory = jetpack.cwd(app.getPath('home'))
  const existsArticle = jetpack.exists(oldDirectory.path(`articles.db`))
  const existsFeed = jetpack.exists(oldDirectory.path(`feeds.db`))

  if (existsArticle && existsFeed) {
    jetpack.move(oldDirectory.path(`feeds.db`), newDirectory.path('.rss-reader/feeds.db'))
    jetpack.move(oldDirectory.path(`articles.db`), newDirectory.path('.rss-reader/articles.db'))
  }
  /**
  * Initial window options
  */
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false
    },
    minHeight: 768,
    minWidth: 1204,
    width: 1204,
    title: 'Raven Reader',
    height: 768
  })

  mainWindow.loadURL(winURL)

  const proxy = store.get('settings.proxy') ? store.get('settings.proxy') : null
  let proxyRules = 'direct://'
  if (proxy) {
    if (proxy.http !== null && proxy.https === null) {
      proxyRules = `http=${proxy.http},${proxyRules}`
    }
    if (proxy.http !== null && proxy.https !== null) {
      proxyRules = `http=${proxy.http};https=${proxy.https},${proxyRules}`
    }
  }

  mainWindow.webContents.session.setProxy({
    proxyRules: proxyRules,
    proxyBypassRules: proxy && proxy.bypass ? proxy.bypass : '<local>' }, () => {
    mainWindow.loadURL(winURL)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    preferenceWindow = null
  })

  mainWindow.on('close', (event) => {
    if (app.isQuiting) {
      mainWindow = null
    } else {
      event.preventDefault()
      mainWindow.hide()
      if (process.platform === 'darwin') {
        app.dock.hide()
      }
      return false
    }
  })

  createMenu()
  createTray()
}

app.requestSingleInstanceLock()
app.on('second-instance', (event, argv, cwd) => {
  app.quit()
})

app.on('ready', () => {
  createWindow()
})

app.on('before-quit', () => {
  app.isQuiting = true
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('online-status-changed', (event, status) => {
  event.sender.send('onlinestatus', status)
})

ipcMain.on('settingsChanged', (event, arg) => {
  mainWindow.webContents.send('settingsChanged', arg)
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
