import JsSIP from 'jssip'

// Create our JsSIP instance and run it:
const socket = new JsSIP.WebSocketInterface('wss://gippars.ru:4443/ws')
const configuration = {
  sockets: [socket],
  uri: 'sip:200@gippars.ru',
  password: 'Hatr8Qhb!h122Qr',
  realm: 'asterisk'
}

const ua = new JsSIP.UA(configuration)
ua.on('connected', (e) => {
  console.log('Connected..')
  console.log({ e })
})

ua.on('disconnected', (e) => {
  console.log('disconnected...')
})

ua.on('sending', (e) => {
  console.log('sending...')
})

ua.on('newRTCSession', (ev1) => {
  console.log('new RTC Sesion...')
  console.log({ ev1 })

  const session = ev1.session

  session.connection.addEventListener('track', function (e) {
    console.log('set remote audio stream')
    console.log({ e })
    //const remoteAudio = new Audio('https://upload.wikimedia.org/wikipedia/commons/5/52/Hymni_i_Flamurit_instrumental.ogg')
    // const remoteAudio = new Audio()
    // remoteAudio.srcObject = e.streams[0]
    // remoteAudio.play()

    var ctx = new AudioContext()
    var audio = new Audio()
    audio.srcObject = e.streams[0]
    var gainNode = ctx.createGain()
    gainNode.gain.value = 0.5
    audio.onloadedmetadata = () => {
      var source = ctx.createMediaStreamSource(audio.srcObject)
      audio.play()
      audio.muted = true
      source.connect(gainNode)
      gainNode.connect(ctx.destination)
    }

    console.log('connectionState:', session.connection.connectionState)
  })

  session.on('confirmed', (e) => {
    console.log('the call has connected, and audio is playing')
    console.log({ e })
    const localStream = session.connection.getLocalStreams()[0]
    session.connection.createDTMFSender(localStream.getAudioTracks()[0])
  })
})

ua.on('newMessage', (e) => {
  console.log('new message...')
})

ua.on('registered', (e) => {
  console.log('registered...')
  console.log({ e })
})
ua.on('unregistered', (e) => {
  console.log('unregistered...')
})
ua.on('registrationFailed', (e) => {
  console.log('registratin failed...')
})

// Register callbacks to desired call events
const eventHandlers = {
  progress: (e) => {
    console.log('call is in progress')
  },
  failed: (e) => {
    console.log('call failed with cause: ' + e?.cause)
    console.log({ e })
  },
  ended: (e) => {
    console.log('call ended with cause: ' + e?.cause)
  },
  confirmed: (e) => {
    console.log('call confirmed')
    console.log({ e })
  }
}

var options = {
  eventHandlers: eventHandlers,
  mediaConstraints: { audio: true, video: true }
}

ua.start()
ua.call('sip:600@gippars.ru', options)

export default ua
