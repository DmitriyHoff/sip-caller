import Window from './window'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
/**
 * Класс окна авторизации
 */
export default class LoginWindow extends Window {
  _htmlPath = 'login.html'
  constructor() {
    const browserWindowConstructorOptions = {
      width: 400,
      height: 540,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/preload.js'),
        sandbox: false
      },
      // useContentSize: true,
      resizable: false,
      fullscreenable: false
    }
    super(browserWindowConstructorOptions)
  }
}
