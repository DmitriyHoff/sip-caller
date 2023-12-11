// билиотеки
import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import MySipClient from './mySipClient'

// окна
import LoginWindow from './windowLogin'
import MainWindow from './windowMain'
import IncomingCallWindow from './windowIncomingCall'

// Параметры SIP
const uri = 'sip:202@gippars.ru'
const login = '202'
const password = 'Hatr8Qhb!h122Qr'
const server = 'wss://gippars.ru:4443/ws'

const mainWindow = new MainWindow()
const loginWindow = new LoginWindow()
const incomingCallWindow = new IncomingCallWindow()

let isLoggedIn = false
const mySipClient = new MySipClient({
  uri,
  login,
  password,
  server
})

const showWindow = (win) => win.show()
// mainWindow.events.on('ready-to-show', showWindow)
loginWindow.events.on('ready-to-show', showWindow)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // инициализация всех окон
  mainWindow.init()
  loginWindow.init()
  incomingCallWindow.init()

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      if (isLoggedIn) mainWindow.init()
      else loginWindow.init()
    }
  })

  ipcMain.on('userLogin', async (event, params) => {
    await mySipClient.start()
    await mySipClient.register()
    isLoggedIn = true
    loginWindow.browserWindow.close()
    mainWindow.show()
    incomingCallWindow.show()
    console.log({ params })
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
