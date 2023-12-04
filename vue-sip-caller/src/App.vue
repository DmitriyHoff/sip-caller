<script setup>
import { ref } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import userAgent from './jssip'

const session = ref({});
function call(number) {
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
    session.value = userAgent.call(`sip:${number}@gippars.ru`, options)
    console.log(session.value.connection.connectionState)
  })

}
function terminate(session) {
  console.log(session.connection.connectionState)
  if (session.connection.connectionState === 'connected') session.terminate();
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
  <button @click="call(600)">600 (Echo test)</button>
  <button @click="call(202)">202 (Second account)</button>
  <button @click="call(602)">602 (Re-call)</button>
  <button @click="terminate(session)">TERMINATE</button>
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
