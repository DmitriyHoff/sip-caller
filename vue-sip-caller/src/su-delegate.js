export default {
    /** Called when a call is answered.*/
    onCallAnswered: () => {
        console.log('Call answered')
    },

    /** Called when a call is created. */
    onCallCreated: () => {
        console.log('Call created')
    },

    /** Called when a call receives an incoming DTMF tone. */
    onCallDTMFReceived: (tone, duration) =>{
        console.log('DTMF received: %s:%s', tone, duration)
    },

    /** Called when a call is hung up. */
    onCallHangup: () => {
        console.log('Call hangup')
    }, //


    onCallHold: (held) => {
        console.log('Call hold: ', held)
    }, // 	Called when a call is put on hold or taken off hold.

    // 	Called when a call is received.
    onCallReceived: () => {
        console.log('Call received')
    },

    // 	Called upon receiving a message.
    onMessageReceived: (message) => {
        console.log('Message received: ', message)
    },

    // 	Called when user is registered to received calls.
    onRegistered: () => {
        console.log('Registered')
    },

    // 	Called when user is connected to server.
    onServerConnect: () => {
        console.log('Server connect')
    },

    // 	Called when user is no longer connected.
    onServerDisconnect: (error) => {
        console.log('Server disconnect: ', error)
    },

    // 	Called when user is no longer registered to received calls.
    onUnregistered: () => {
        console.log('Unregistered')
    },
}
