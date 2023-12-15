// билиотеки
import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
// окна
import LoginWindow from './windowLogin'
import MainWindow from './windowMain'
import CallWindow from './windowCall'

const mainWindow = new MainWindow()
const loginWindow = new LoginWindow()
const callWindow = new CallWindow()

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
    callWindow.init()

    app.on('activate', async function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            if (isLoggedIn) mainWindow.init()
            else loginWindow.init()
        }
    })

    ipcMain.on('test', async (event, params) => {
        console.log('main:test')
    })
    ipcMain.on('login-request', async (event, params) => {
        console.log('electron: login-request')
        console.log({ params })
        mainWindow.browserWindow.webContents.send('login-request', params)
    })

    ipcMain.on('login-response', async (event, params) => {
        console.log('electron: login-response', params)

        loginWindow.browserWindow.webContents.send('login-response', params)
        if (!params.error) {
            loginWindow.browserWindow.close()
            mainWindow.show()
        }
    })
    ipcMain.on('phone-accept-click', async () => {
        console.log('electron: phone-accept-click')
    })

    ipcMain.on('phone-cancel-click', () => {
        console.log('electron: phone-cancel-click')
    })
    ipcMain.on('sip-connect', () => {
        isLoggedIn = true

        console.log('electron: sip-connect')
    })
    ipcMain.on('sip-disconnect', () => {
        console.log('electron: sip-disconnect')
    })
    ipcMain.on('sip-begin-call', () => {
        console.log('electron: sip-begin-call')
        callWindow.webContents.send('sip-begin-call')
        callWindow.show()
    })
    ipcMain.on('sip-end-call', () => {
        console.log('electron: sip-end-call')
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
