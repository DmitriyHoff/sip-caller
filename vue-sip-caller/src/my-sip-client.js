import { UserAgent, Registerer, Inviter, SessionState } from 'sip.js'

class MySipClient {
    _session
    _sessionIn
    _constraints
    _mediaElement
    _uri
    _userAgent
    _registerer
    _userAgentOptions

    constructor(options) {
        const { uri, login, password, server, delegate } = options
        this._uri = UserAgent.makeURI(uri)
        this._constraints = { audio: true, video: false }
        // UserAgent Options
        this._userAgentOptions = {
            authorizationPassword: password,
            authorizationUsername: login,
            transportOptions: { server },
            uri: this._uri,
            delegate,
            userAgentString: 'BaltAssistanсe CallCenter 0.0.1',
            logBuiltinEnabled: false, // отключаю логирование
            logConfiguration: false,
            sessionDescriptionHandlerFactoryOptions: {
                iceGatheringTimeout: 1000,
                peerConnectionConfiguration: {
                    iceServers: []
                }
            }
        }

        this._mediaElement = new Audio()

        this._userAgent = new UserAgent(this._userAgentOptions)
    }

    async start() {
        await this._userAgent.start()
    }

    async register() {
        this._registerer = new Registerer(this._userAgent)
        await this._registerer.register()
    }

    _setupRemoteMedia(invitation) {
        console.log('SETUP REMOTE MEDIA...')
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
        console.log('CLEAR REMOTE MEDIA...')
        this._mediaElement.srcObject = null
        this._mediaElement.pause()
    }

    onInvite(invitation) {
        console.log('Invite...', { invitation })
        this._session = invitation

        invitation.stateChange.addListener((state) => {
            this.onSessionStateCange(invitation, state)
        })

        this._session.accept({
            sessionDescriptionHandlerOptions: {
                constraints: this._constraints
            }
        })
    }

    onSessionStateCange(session, state) {
        console.log(`Session state changed to ${state}`)
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
        //invitation.accept()
    }
    hangUp() {
        if (!this._session) {
            console.log('ERROR')
            return
        }
        switch (this._session.state) {
            case SessionState.Initial:
            case SessionState.Establishing:
                if (this._session instanceof Inviter) {
                    console.log('An unestablished outgoing session')
                    this._session.cancel()
                } else {
                    console.log('An unestablished incoming session')
                    this._session.reject()
                }
                break
            case SessionState.Established:
                console.log('An established session')
                this._session.bye()
                break
            case SessionState.Terminating:
            case SessionState.Terminated:
                console.log('Cannot terminate a session that is already terminated')
                break
        }
    }
    async call(uri) {
        const target = UserAgent.makeURI(uri)

        const inviter = new Inviter(this._userAgent, target, {
            sessionDescriptionHandlerOptions: {
                constraints: this.constraints
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
        const options = {
            sessionDescriptionHandlerOptions: {
                constraints: this._constraints
            }
        }

        this._sessionIn.accept(options)
    }
}

export default MySipClient
