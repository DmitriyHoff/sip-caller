import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import dotenv from 'dotenv'
dotenv.config()

// Custom APIs for renderer
const api = {
    sendTest: () => {
        ipcRenderer.send('test')
    },

    sendPhoneAcceptClick: () => {
        ipcRenderer.send('phone-accept-click')
    },
    sendPhoneCancellClick: () => {
        ipcRenderer.send('phone-cancel-click')
    },
    sendSipConnect: () => {
        ipcRenderer.send('sip-connect')
    },
    sendSipDisconnect: (error) => {
        ipcRenderer.send('sip-disconnect', error)
    },
    sendSipInvite: (invitation) => {
        ipcRenderer.send('sip-invite', invitation)
    },
    sendSipMessage: (message) => {
        ipcRenderer.send('sip-message', message)
    },
    sendSipNotify: (notify) => {
        ipcRenderer.send('sip-notify', notify)
    },
    sendSipBeginCall: () => {
        ipcRenderer.send('sip-begin-call')
    },
    onSipBeginCall: () => {
        ipcRenderer.on('sip-begin-call')
    },
    sendSipEndCall: () => {
        ipcRenderer.send('sip-end-call')
    },
    sendLoginRequest: (data) => {
        ipcRenderer.send('login-request', data)
    },
    onLoginRequest: (callback) => {
        ipcRenderer.on('login-request', (_event, value) => callback(value))
    },
    sendLoginResponse: (response) => {
        ipcRenderer.send('login-response', response)
    },
    onLoginResponse: (callback) => {
        ipcRenderer.on('login-response', (_event, value) => callback(value))
    },
    sendRegistererStateChange: (state) => {
        ipcRenderer.send('registerer-state-change', state)
    },
    onRegistererStateChange: (callback) => {
        ipcRenderer.send('registerer-state-change', (_event, value) => callback(value))
    },

    // информация о системной теме
    shouldUseDarkColors: async () => {
        return ipcRenderer.invoke('should-use-dark-colors')
    },
    SERVER_URL: process.env.SERVER_URL
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI
    window.api = api
}
