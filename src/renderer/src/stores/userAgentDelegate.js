export default {
    onConnect: () => {
        window.api.sendSipConnect()
        console.log('Connect')
    },
    onDisconnect: (error) => {
        window.api.sendSipDisconnect(error)
        console.log('Disconnect: ', { error })
    },
    onInvite: (invitation) => {
        // this.onIncomingCall(invitation)
        window.api.sendSipInvite(invitation)
        console.log('Invitation...', { invitation })
    },
    onMessage: (message) => {
        window.api.sendSipMessage(message)
        console.log('Message ', { message })
    },
    onNotify: (notification) => {
        window.api.sendSipNotify(notification)
        console.log('Notify ', { notification })
    },
    onRegister: (register) => {
        console.log('Register ->>> ', { register })
    },
    onRegisterRequest: (reg) => {
        console.log('RegisterRequest ->>>', { reg })
    }
}
