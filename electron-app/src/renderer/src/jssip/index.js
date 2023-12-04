// const configuration = {
//   sockets: [socket],
//   uri: 'sip:200@gippars.ru',
//   password: 'Hatr8Qhb!h122Qr',
//   realm: 'asterisk'
// }
import { Web } from 'sip.js'

// Helper function to get an HTML audio element
function getAudioElement(id) {
  //const el = document.getElementById(id)
  const el = new Audio()
  if (!(el instanceof HTMLAudioElement)) {
    throw new Error(`Element "${id}" not found or not an audio element.`)
  }
  return el
}

// Options for SimpleUser
const options = {
  aor: 'sip:200@gippars.ru', // caller
  media: {
    constraints: { audio: true, video: false }, // audio only call
    remote: { audio: getAudioElement('remoteAudio') } // play remote audio
  }
}

// WebSocket server to connect with
const server = 'wss://gippars.ru:4443/ws'

// Construct a SimpleUser instance
const simpleUser = new Web.SimpleUser(server, options)

// Connect to server and place call
simpleUser
  .connect()
  .then(() => simpleUser.call('sip:200@gippars.ru'))
  .catch((error) => {
    console.log(error)
  })

export default simpleUser
