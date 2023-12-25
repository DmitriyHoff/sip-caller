import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { EventEmitter } from 'events'

/**
 * Абстрактный класс окна
 * @abstract
 */
export default class Window {
    _browserWindow
    _htmlPath
    _emiter
    _browserWindowConstructorOptions
    constructor(browserWindowConstructorOptions) {
        if (new.target === Window) {
            throw new Error(`You cannot instantiate an abstract class Window`)
        }
        this._emiter = new EventEmitter()
        this._browserWindowConstructorOptions = browserWindowConstructorOptions
    }
    async init() {
        if (arguments.length > 0) {
            this._browserWindowConstructorOptions.webPreferences.additionalArguments = arguments
        }
        // Create the browser window.
        this._browserWindow = new BrowserWindow(this._browserWindowConstructorOptions)

        this._browserWindow.on('ready-to-show', () => {
            this._emiter.emit('ready-to-show', this)
        })

        this._browserWindow.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })

        if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
            this._browserWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${this._htmlPath}`)
        } else {
            this._browserWindow.loadFile(join(__dirname, `../renderer/${this._htmlPath}`))
        }

        this._browserWindow.on('closed', (event) => {
            console.log(this.constructor.name, 'closed')
        })
    }

    show() {
        this._browserWindow.show()
    }

    hide() {
        this._browserWindow.hide()
    }
    close() {
        this._browserWindow.close()
    }
    get events() {
        return this._emiter
    }

    get browserWindow() {
        return this._browserWindow
    }
}
