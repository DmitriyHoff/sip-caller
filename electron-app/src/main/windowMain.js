import Window from './window'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

export default class MainWindow extends Window {
    _htmlPath = 'index.html'
    constructor() {
        const browserWindowConstructorOptions = {
            width: 600,
            height: 480,
            show: false,
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
                preload: join(__dirname, '../preload/preload.js'),
                sandbox: false
            },
            useContentSize: true
        }
        super(browserWindowConstructorOptions)
    }
}
