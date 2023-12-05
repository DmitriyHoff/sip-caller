import { UserAgent, Registerer, Inviter, SessionState } from "sip.js";

// Assumes you have a media element on the DOM
const mediaElement = new Audio();


let session;

function onInvite(invitation) {
  console.log("Invite...")
  console.log({ invitation })
  invitation.stateChange.addListener((state) => {
    console.log(`Session state changed to ${state}`);
    switch (state) {
      case SessionState.Initial: console.log('Session initial...')
        break;
      case SessionState.Establishing: console.log('Session establishing...')
        break;
      case SessionState.Established:
        console.log('Session established...')
        setupRemoteMedia(invitation);
        break;
      case SessionState.Terminating:
        console.log('Session terminating...')
        break;
      case SessionState.Terminated:
        console.log('Session terminated...')
        cleanupMedia();
        break;
      default:
        throw new Error("Unknown session state.");
    }
    invitation.accept();
  })
}

function setupRemoteMedia(invitation) {
  console.log("SETUP REMOTE MEDIA...")
  const remoteStream = new MediaStream();
  invitation.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
    if (receiver.track) {
      remoteStream.addTrack(receiver.track);
    }
  });
  mediaElement.srcObject = remoteStream;
  mediaElement.play();
  console.log({ mediaElement })
}

function cleanupMedia() {
  mediaElement.srcObject = null;
  mediaElement.pause();
}

// WebSocket server to connect with
const transportOptions = {
  server: 'wss://gippars.ru:4443/ws'
}
const uri = UserAgent.makeURI("sip:200@gippars.ru");

// UserAgent delegate
const delegate = {
  // Called upon transport transitioning to connected state.
  onConnect: () => {
    console.log("Connect...")
  },
  // Called upon transport transitioning from connected state.
  onDisconnect: (error) => {
    console.log('Disconnect: ', { error })
  },

  // Called upon receipt of an invitation.
  onInvite,

  // Called upon receipt of a message.
  onMessage: (message) => {
    console.log('Message ', { message })
  },

  // Called upon receipt of a notification.	    
  onNotify: (notification) => {
    console.log('Notify ', { notification })
  }
}

// UserAgent Options
const userAgentOptions = {
  authorizationPassword: 'Hatr8Qhb!h122Qr',
  authorizationUsername: '200',
  transportOptions,
  uri,
  delegate,
  userAgentString: 'BaltAssistanse CallCenter 0.0.1',
  logBuiltinEnabled: true,  // отключаю логирование
  sessionDescriptionHandlerFactoryOptions: {
    iceGatheringTimeout: 1000,
    peerConnectionConfiguration: {
      iceServers: []
    }
  }
};


const userAgent = new UserAgent(userAgentOptions);

const registerer = new Registerer(userAgent);

userAgent.start().then(() => {
  registerer.register();
});

function endCall() {
  if (!session) {
    console.log('ERROR')
    return
  }
  switch (session.state) {
    case SessionState.Initial:
    case SessionState.Establishing:
      if (session instanceof Inviter) {
        console.log('An unestablished outgoing session')
        session.cancel();
      } else {
        console.log('An unestablished incoming session')
        session.reject();
      }
      break;
    case SessionState.Established:
      console.log('An established session')
      session.bye();
      break;
    case SessionState.Terminating:
    case SessionState.Terminated:
      console.log('Cannot terminate a session that is already terminated')
      break;
  }
}


async function call(number) {
  const target = UserAgent.makeURI(`sip:${number}@gippars.ru`);

  const inviter = new Inviter(userAgent, target, {
    sessionDescriptionHandlerOptions: {
      constraints: { audio: true, video: false }
    },
    inviteWithoutSdp: false,
    iceCheckingTimeout: 0
  })


  // Handle outgoing session state changes
  inviter.stateChange.addListener((newState) => {
    switch (newState) {
      case SessionState.Establishing:
        console.log('Session is establishing')
        break;
      case SessionState.Established:
        console.log('Session has been established')
        setupRemoteMedia(inviter);
        break;
      case SessionState.Terminated:
        console.log('Session has terminated')
        cleanupMedia();
        break;
      default:
        break;
    }
  });
  inviter.invite().then(() => {
    session = inviter
  })
}

function terminate() {
  endCall()
}