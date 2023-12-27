import { UserAgent, Registerer, Inviter, SessionState } from 'sip.js'

const RegistererState = {
    Initial: 'Initial',
    Registered: 'Registered',
    Unregistered: 'Unregistered',
    Terminated: 'Terminated'
}

const TransportState = {
    /** The `connect()` method was called. */
    Connecting: 'Connecting',

    /** The `connect()` method resolved. */
    Connected: 'Connected',
    /** The `disconnect()` method was called. */
    Disconnecting: 'Disconnecting',
    /**
     * The `connect()` method was rejected, or
     * the `disconnect()` method completed, or
     * network connectivity was lost.
     */
    Disconnected: 'Disconnected'
}

class ConnectionError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ConnectionError'
        this.text = 'Ошибка соединения с АТС'
    }
}

class RegistrationError extends Error {
    constructor(message) {
        super(message)
        this.name = 'RegisterError'
        this.text = 'Ошибка регистрации в АТС'
    }
}

// const registererRegisterOptions = {
//     /** See `core` API. */
//     requestDelegate: outgoingRequestDelegate
//     /** See `core` API. */
//     //requestOptions?: RequestOptions;
// }
class SipPhone extends EventTarget {
    _session
    _constraints
    _mediaElement
    _uri
    _userAgent
    _registerer
    _userAgentOptions
    _callbacks

    constructor(options, delegate, callbacks) {
        super()
        const { uri, login, password, server } = options
        this._uri = UserAgent.makeURI(uri)
        this._constraints = { audio: true, video: false }
        this._delegate = {
            onConnect: () => {
                if (typeof delegate.onConnect === 'function') {
                    delegate.onConnect()
                }
                console.log('\u001b[34mConnect')
            },
            onDisconnect: (error) => {
                if (typeof delegate.onDisconnect === 'function') {
                    delegate.onDisconnect(error)
                }
                console.log('\u001b[34mDisconnect')
            },
            onInvite: (invitation) => {
                invitation // test!
                //console.log('Incoming call...', { invitation })
                console.log('\u001b[34m' + 'Incoming call: ' + invitation.state)
                // this._session = invitation

                invitation.stateChange.addListener((state) => {
                    console.log('INVITATION stateChange...')
                    this.onSessionStateCange(invitation, state)
                })

                if (typeof delegate.onInvite === 'function') {
                    delegate.onInvite(invitation)
                }
                this._session = invitation
                console.log('\u001b[34mInvite')
            },
            onMessage: (message) => {
                if (typeof delegate.onMessage === 'function') {
                    delegate.onMessage(message)
                }
                console.log('\u001b[34mMessage')
            },
            onNotify: (notification) => {
                if (typeof delegate.onNotify === 'function') {
                    delegate.onNotify(notification)
                }
                console.log('\u001b[34mNotify')
            },
            onRegister: (register) => {
                if (typeof delegate.onRegister === 'function') {
                    delegate.onRegister(register)
                }
                console.log('\u001b[34mRegister')
            }
        }

        // UserAgent Options
        this._userAgentOptions = {
            authorizationPassword: password,
            authorizationUsername: login,
            transportOptions: { server },
            uri: this._uri,
            delegate: this._delegate,
            userAgentString: window.api.USER_AGENT,
            logBuiltinEnabled: window.api.SIP_LOGGER === 'true', // отключаю логирование
            logConfiguration: false,
            sessionDescriptionHandlerFactoryOptions: {
                iceGatheringTimeout: 1000,
                peerConnectionConfiguration: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: [window.api.STUN_SERVER_URL] }
                    ],
                    bundlePolicy: 'max-compat',
                    iceTransportPolicy: 'all',
                    iceCandidatePoolSize: 10,
                    certificates: []
                }
            }
        }

        this._mediaElement = new Audio()

        this._userAgent = new UserAgent(this._userAgentOptions)

        this._callbacks = callbacks

        // this._userAgent.delegate.onInvite = (invitation) => {
        //     //this._userAgent.delegate.onInvite(invitation)
        //     this.onIncomingCall(invitation)
        // }
    }

    async start() {
        try {
            console.log('UserAgentState: ', this._userAgent.state)
            await this._userAgent.start()
        } catch (error) {
            this._userAgent.stop()
            throw new ConnectionError(error.message)
        }
    }
    /** Send `REGISTER` request */
    async register() {
        this._registerer = new Registerer(this._userAgent)
        this._registerer.stateChange.addListener((state) => {
            this._callbacks.registererStateChangeListener(state)
        })

        try {
            console.log('RegistererState: ', this._registerer.state)
            const registererRegisterOptions = {
                /** See `core` API. */
                requestDelegate: {
                    /**
                     * Received a 2xx positive final response to this request.
                     * @param response - Incoming response.
                     */
                    onAccept: (response) => {
                        console.log('Accept: ', { response })
                        this._callbacks.responseListener(response)
                    },

                    /**
                     * Received a 1xx provisional response to this request. Excluding 100 responses.
                     * @param response - Incoming response.
                     */
                    onProgress: (response) => {
                        console.log('OnProgress: ', { response })
                        this._callbacks.responseListener(response)
                    },

                    /**
                     * Received a 3xx negative final response to this request.
                     * @param response - Incoming response.
                     */
                    onRedirect: (response) => {
                        console.log('onRedirect: ', { response })
                        this._callbacks.responseListener(response)
                    },

                    /**
                     * Received a 4xx, 5xx, or 6xx negative final response to this request.
                     * @param response - Incoming response.
                     */
                    onReject: (response) => {
                        console.log('onReject: ', { response })
                        this._callbacks.responseListener(response)
                    },

                    /**
                     * Received a 100 provisional response.
                     * @param response - Incoming response.
                     */
                    onTrying: (response) => {
                        console.log('onTrying: ', { response })
                        this._callbacks.responseListener({ type: 'trying', response })
                    }
                }
            }
            console.log(registererRegisterOptions)
            await this._registerer.register(registererRegisterOptions)
        } catch (err) {
            throw new RegistrationError(err)
        }
    }

    _setupRemoteMedia(invitation) {
        // console.log('SETUP REMOTE MEDIA...')
        const remoteStream = new MediaStream()
        invitation.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
            if (receiver.track) {
                remoteStream.addTrack(receiver.track)
            }
        })
        this._mediaElement.srcObject = remoteStream
        this._mediaElement.play()
    }

    _cleanupMedia() {
        // console.log('CLEAR REMOTE MEDIA...')
        this._mediaElement.srcObject = null
        this._mediaElement.pause()
    }

    // onIncomingCall(invitation) {
    //     // console.log('Incoming call...', { invitation })
    //     // console.log(invitation.state)
    //     // // this._session = invitation
    //     // this._session.stateChange.addListener((state) => {
    //     //     console.log('state changed...')
    //     //     this.onSessionStateCange(invitation, state)
    //     // })
    // }

    onSessionStateCange(session, state) {
        console.log(`Session state changed to ${state}`)
        this._callbacks.sessionStateChangeListener(state)

        switch (state) {
            case SessionState.Initial:
                console.log('Session initial...')
                break
            case SessionState.Establishing:
                console.log('Session establishing...')
                break
            case SessionState.Established:
                console.log('Session established...')
                this._setupRemoteMedia(session)
                break
            case SessionState.Terminating:
                console.log('Session terminating...')
                break
            case SessionState.Terminated:
                console.log('Session terminated...')
                this._cleanupMedia()
                break
            default:
                throw new Error('Unknown session state.')
        }
    }
    hangUp() {
        if (!this._session) {
            console.log('HUNG_UP ERROR')
            return
        }
        switch (this._session.state) {
            case SessionState.Initial:
            case SessionState.Establishing:
                if (this._session instanceof Inviter) {
                    console.log('HUNG_UP: An unestablished outgoing session')
                    this._session.cancel()
                } else {
                    console.log('HUNG_UP: An unestablished incoming session')
                    this._session.reject()
                }
                break
            case SessionState.Established:
                console.log('HUNG_UP: An established session')
                this._session.bye()
                break
            case SessionState.Terminating:
            case SessionState.Terminated:
                console.log('HUNG_UP: Cannot terminate a session that is already terminated')
                break
        }
    }
    async call(uri) {
        const target = UserAgent.makeURI(uri)

        const inviter = new Inviter(this._userAgent, target, {
            sessionDescriptionHandlerOptions: {
                constraints: this._constraints
            }
        })

        inviter.stateChange.addListener((state) => {
            this.onSessionStateCange(inviter, state)
        })

        inviter.invite().then(() => {
            this._session = inviter
        })
    }
    answer() {
        if (!this._session) {
            console.log('Session undefined')
            return
        }
        console.log(this._session?.state)
        const options = {
            sessionDescriptionHandlerOptions: {
                constraints: this._constraints
            }
        }
        this._session.accept(options)
    }
    get registerer() {
        return this._registerer
    }
}

export { SipPhone, ConnectionError, RegistrationError, RegistererState }
