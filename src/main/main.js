// билиотеки
import { app, BrowserWindow, ipcMain, nativeTheme, systemPreferences } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { AppEvent } from './events'
// окна
import LoginWindow from './windowLogin'
import MainWindow from './windowMain'
import CallWindow from './windowCall'

const windows = []
const mainWindow = new MainWindow()
const loginWindow = new LoginWindow()
const callWindow = new CallWindow()
windows.push(mainWindow, loginWindow, callWindow)
let isLoggedIn = false

const showWindow = (win) => win.show()
// mainWindow.events.on('ready-to-show', showWindow) // <-- отобразить главное окно для отладки
// callWindow.events.on('ready-to-show', showWindow)
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
    // callWindow.init()

    app.on(AppEvent.Activate, async function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            loginWindow.init()
            mainWindow.init()
        }
    })

    /* Запрос авторизации от loginWindow */
    ipcMain.on(AppEvent.LoginRequest, async (event, params) => {
        console.log('electron: login-request')
        console.log({ params })
        // mainWindow.show()
        mainWindow.browserWindow.webContents.send(AppEvent.LoginRequest, params)
    })

    /* Ответ основного окна на запрос авторизации */
    ipcMain.on(AppEvent.LoginResponse, async (event, params) => {
        console.log('electron: login-response', params)

        if (!params.error) {
            loginWindow.browserWindow.close()
            mainWindow.show()
        } else {
            loginWindow.browserWindow.webContents.send(AppEvent.LoginResponse, params)
            const micUse = await systemPreferences.askForMediaAccess('microphone')
            if (!micUse) {
                alert('Error')
            }
        }
    })
    
    ipcMain.on(AppEvent.SipInvite, async (event, params) => {
        console.log('electron: sip-invite', params)
        callWindow.init().then(() => {
            callWindow.browserWindow.webContents.send(AppEvent.SipInvite, params)
            callWindow.show()
        })
    })
    ipcMain.on(AppEvent.PhoneAcceptClick, async (event, params) => {
        console.log('electron: phone-accept-click')
        mainWindow.browserWindow.webContents.send(AppEvent.PhoneAcceptClick, params)
    })
    ipcMain.on(AppEvent.PhoneCancellClick, async (event, params) => {
        console.log('electron: phone-cancel-click')
        mainWindow.browserWindow.webContents.send(AppEvent.PhoneCancellClick, params)
    })
    ipcMain.on(AppEvent.SipConnect, () => {
        isLoggedIn = true
        console.log('electron: sip-connect')
    })
    ipcMain.on(AppEvent.SipDisconnect, () => {
        console.log('electron: sip-disconnect')
    })
    ipcMain.on(AppEvent.SipBeginCall, () => {
        console.log('electron: sip-begin-call')
        //callWindow.browserWindow.webContents.send('sip-begin-call')
        callWindow.init()
        callWindow.show()
        callWindow.browserWindow.webContents.send(AppEvent.SipBeginCall)
    })
    ipcMain.on('sip-end-call', () => {
        console.log('electron: sip-end-call')
        callWindow.browserWindow.close()
    })

    ipcMain.handle(AppEvent.ShouldUseDarkColors, () => {
        console.log('electron: should-use-dark-colors: ', nativeTheme.shouldUseDarkColors)
        return nativeTheme.shouldUseDarkColors
    })

    nativeTheme.on('updated', async () => {
        console.log('electron:system theme updated!', nativeTheme.shouldUseDarkColors)
        try {
            if (loginWindow.browserWindow)
                await loginWindow.browserWindow.webContents.send(
                    'native-theme-updated',
                    nativeTheme.shouldUseDarkColors
                )
            if (mainWindow.browserWindow)
                await mainWindow.browserWindow.webContents.send(
                    'native-theme-updated',
                    nativeTheme.shouldUseDarkColors
                )
        } catch (error) {
            console.log(error)
        }
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
