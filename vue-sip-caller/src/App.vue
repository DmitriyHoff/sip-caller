<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import userAgent from './jssip'

function call() {
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
    mediaConstraints: {
      audio: true,
      video: false
    },
    rtcOfferConstraints: {
      'offerToReceiveAudio': true,
      'offerToReceiveVideo': false
    },
    // pcConfig: {
    //   iceServers: []
    // }
  }
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  } else {
    // List cameras and microphones.
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(() => {
    userAgent.call('sip:600@gippars.ru', options)
  })

}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
  <button @click="call">CALL 600</button>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
