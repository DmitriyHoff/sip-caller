<script setup>
import ContactList from './components/ContactList.vue'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import TabMenu from 'primevue/tabmenu'
import SipPhone from './sip-phone'
import { ref } from 'vue'
// import { useToast } from 'primevue/usetoast'

//const toast = //useToast()
const items = ref([
    {
        label: 'Главная',
        icon: 'pi pi-home',
        command: () => {
            console.log('click menu 1!')
        }
    },
    {
        label: 'Статистика',
        icon: 'pi pi-chart-line',
        command: () => {
            console.log('click menu 2!')
        }
    },
    {
        label: 'История',
        icon: 'pi pi-list',
        command: () => {
            console.log('click menu 3!')
        }
    },
    {
        label: 'Сообщения',
        icon: 'pi pi-inbox',
        command: () => {
            console.log('click menu 4!')
        }
    }
])

const { api } = window

const sipOptions = {
    uri: 'sip:202@gippars.ru',
    login: '202',
    password: 'Hatr8Qhb!h122Qr',
    server: 'wss://gippars.ru:4443/ws'
}

const delegate = {
    onConnect: () => {
        api.sendSipConnect()
        console.log('Connect...')
    },
    onDisconnect: (error) => {
        api.sendSipDisconnect(error)
        console.log('Disconnect: ', { error })
    },

    onInvite: (invitation) => {
        // this.onIncomingCall(invitation)
        api.sendSipInvite(invitation)
        console.log('Invitation...', { invitation })
    },

    onMessage: (message) => {
        api.sendSipMessage(message)
        console.log('Message ', { message })
    },

    onNotify: (notification) => {
        api.sendSipNotify(notification)
        console.log('Notify ', { notification })
    }
}
// Моя звонилка
const phone = new SipPhone(sipOptions, delegate)

function call(number) {
    phone.call(`sip:${number}@gippars.ru`)
    window.api.sendSipBeginCall()
}
function terminate() {
    phone.hangUp()
    window.api.sendSipEndCall()
}
function accept() {
    phone.answer()
}

phone.start().then(async () => phone.register())
</script>

<template>
    <div class="card text-sm">
        <TabMenu :model="items">
            <!-- <template #item="{ item, props }">
                <a v-bind="props.action" class="flex align-items-center gap-2">
                    <img
                        :alt="item.name"
                        :src="`/images/avatar/${item.image}`"
                        style="width: 32px"
                    />
                    <span class="font-bold">{{ item.label }}</span>
                </a>
            </template> -->
        </TabMenu>
    </div>
    <Splitter class="v-full h-full border-noround mb-5">
        <SplitterPanel class="flex align-items-top justify-content-center">
            <div>uyiuyiuyh</div>
        </SplitterPanel>
        <SplitterPanel class="flex align-items-stretch justify-content-stretch overflow-y-scroll">
            <ContactList />
        </SplitterPanel>
    </Splitter>
</template>
