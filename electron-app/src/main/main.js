// билиотеки
import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

// окна
import LoginWindow from './windowLogin'
import MainWindow from './windowMain'
import IncomingCallWindow from './windowIncomingCall'

const mainWindow = new MainWindow()
const loginWindow = new LoginWindow()
const incomingCallWindow = new IncomingCallWindow()

let isLoggedIn = false

const showWindow = (win) => win.show()
// mainWindow.events.on('ready-to-show', showWindow)
loginWindow.events.on('ready-to-show', showWindow)

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

    ipcMain.on('login', async (event, params) => {
        isLoggedIn = true
        loginWindow.browserWindow.close()
        mainWindow.show()
        incomingCallWindow.show()
        console.log({ params })
    })

    ipcMain.on('phone-accept-click', async () => {
        console.log('phone-accept-click')
    })
    ipcMain.on('phone-cancel-click', () => {
        console.log('phone-cancel-click')
    })
    ipcMain.on('sip-connect', () => {
        console.log('sip-connect')
    })
    ipcMain.on('sip-disconnect', () => {
        console.log('sip-disconnect')
    })
    ipcMain.on('sip-begin-call', () => {
        console.log('sip-begin-call')
    })
    ipcMain.on('sip-end-call', () => {
        console.log('sip-end-call')
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
