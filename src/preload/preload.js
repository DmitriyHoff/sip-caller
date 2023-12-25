import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import dotenv from 'dotenv'
import { AppEvent } from '../main/events'
dotenv.config()

// Custom APIs for renderer
const api = {
    // Отправляется из Call Window
    sendPhoneAcceptClick: () => {
        ipcRenderer.send(AppEvent.PhoneAcceptClick)
    },

    sendPhoneCancellClick: () => {
        ipcRenderer.send(AppEvent.PhoneCancellClick)
    },

    onPhoneAcceptClick: (callback) => {
        ipcRenderer.on(AppEvent.PhoneAcceptClick, (_event, value) => callback(value))
    },

    onPhoneCancellClick: (callback) => {
        ipcRenderer.on(AppEvent.PhoneCancellClick, (_event, value) => callback(value))
    },

    sendSipConnect: () => {
        ipcRenderer.send(AppEvent.SipConnect)
    },

    sendSipDisconnect: (error) => {
        ipcRenderer.send(AppEvent.SipDisconnect, error)
    },

    sendSipInvite: (invitation) => {
        ipcRenderer.send(AppEvent.SipInvite, invitation)
    },

    onSipInvite: (callback) => {
        ipcRenderer.on(AppEvent.SipInvite, (_event, value) => callback(value))
    },

    sendSipMessage: (message) => {
        ipcRenderer.send(AppEvent.SipMessage, message)
    },

    sendSipNotify: (notify) => {
        ipcRenderer.send(AppEvent.SipNotify, notify)
    },

    sendSipBeginCall: () => {
        ipcRenderer.send(AppEvent.SipBeginCall)
    },

    onSipBeginCall: () => {
        ipcRenderer.on(AppEvent.SipBeginCall)
    },

    sendSipEndCall: () => {
        ipcRenderer.send(AppEvent.SipEndCall)
    },

    sendLoginRequest: (data) => {
        ipcRenderer.send(AppEvent.LoginRequest, data)
    },

    onLoginRequest: (callback) => {
        ipcRenderer.on(AppEvent.LoginRequest, (_event, value) => callback(value))
    },

    sendLoginResponse: (response) => {
        ipcRenderer.send(AppEvent.LoginResponse, response)
    },

    onLoginResponse: (callback) => {
        ipcRenderer.on(AppEvent.LoginResponse, (_event, value) => callback(value))
    },

    sendRegistererStateChange: (state) => {
        ipcRenderer.send(AppEvent.RegistererStateChange, state)
    },

    onRegistererStateChange: (callback) => {
        ipcRenderer.send(AppEvent.RegistererStateChange, (_event, value) => callback(value))
    },

    // информация о системной теме
    shouldUseDarkColors: async () => {
        return ipcRenderer.invoke(AppEvent.ShouldUseDarkColors)
    },

    // изменение системной темы
    onNativeThemeUpdated: async (callback) => {
        ipcRenderer.on(AppEvent.NativeThemeChanged, (_event, value) => callback(value))
    },
    SERVER_URL: process.env.SERVER_URL,
    WEB_SOCKET_SERVER: process.env.WEB_SOCKET_SERVER,
    FROG_AUTH_OFF: process.env.FROG_AUTH_OFF,
    STUN_SERVER_URL: process.env.STUN_SERVER_URL,
    USER_AGENT: process.env.USER_AGENT
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
        contextBridge.exposeInMainWorld('AppEvent', AppEvent)
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI
    window.api = api
    window.AppEvent = AppEvent
}
