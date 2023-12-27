import Window from './window'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

export default class CallWindow extends Window {
    _htmlPath = 'call.html'
    _parent
    constructor() {
        const browserWindowConstructorOptions = {
            width: 450,
            height: 70,
            show: false,
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
                preload: join(__dirname, '../preload/preload.js'),
                sandbox: false
            },
            frame: false,
            alwaysOnTop: true,
            resizable: false // false!
        }

        super(browserWindowConstructorOptions)
    }
}
