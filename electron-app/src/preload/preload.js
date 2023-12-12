import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
    sendLogin: (data) => {
        ipcRenderer.send('login', data)
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
    sendSipEndCall: () => {
        ipcRenderer.send('sip-end-call')
    },
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
