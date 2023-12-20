// билиотеки
import { app, BrowserWindow, ipcMain, nativeTheme, systemPreferences } from 'electron'
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
mainWindow.events.on('ready-to-show', showWindow) // <-- отобразить главное окно для отладки
loginWindow.events.on('ready-to-show', showWindow)

app.whenReady().then(async () => {
    console.log('nativeTheme.shouldUseDarkColors: ', nativeTheme.shouldUseDarkColors)
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

    /* Запрос авторизации от loginWindow */
    ipcMain.on('login-request', async (event, params) => {
        console.log('electron: login-request')
        console.log({ params })
        mainWindow.show()
        mainWindow.browserWindow.webContents.send('login-request', params)
    })

    /* Ответ основного окна на запрос авторизации */
    ipcMain.on('login-response', async (event, params) => {
        console.log('electron: login-response', params)

        if (!params.error) {
            loginWindow.browserWindow.close()
            mainWindow.show()
        } else {
            loginWindow.browserWindow.webContents.send('login-response', params)
            const micUse = await systemPreferences.askForMediaAccess('microphone')
            if (!micUse) {
                alert('Error')
            }
        }
    })
    ipcMain.on('phone-accept-click', async () => {
        console.log('electron: phone-accept-click')
    })
    ipcMain.on('sip-invite', async () => {
        console.log('electron: sip-invite')
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
        //callWindow.browserWindow.webContents.send('sip-begin-call')
        callWindow.show()
        callWindow.browserWindow.webContents.send('sip-begin-call')
    })
    ipcMain.on('sip-end-call', () => {
        console.log('electron: sip-end-call')
    })

    ipcMain.handle('should-use-dark-colors', () => {
        console.log('electron: should-use-dark-colors: ', nativeTheme.shouldUseDarkColors)
        return nativeTheme.shouldUseDarkColors
    })

    nativeTheme.on('updated', () => {
        console.log('electron:system theme updated!', nativeTheme.shouldUseDarkColors)
        loginWindow.browserWindow.webContents.send(
            'native-theme-updated',
            nativeTheme.shouldUseDarkColors
        )
        mainWindow.browserWindow.webContents.send(
            'native-theme-updated',
            nativeTheme.shouldUseDarkColors
        )
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
