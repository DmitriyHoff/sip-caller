import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin({ exclude: ['dotenv'] })]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        plugins: [vue()],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/renderer/index.html'),
                    call: resolve(__dirname, 'src/renderer/call.html'),
                    login: resolve(__dirname, 'src/renderer/login.html')
                }
            }
        }
    },
    extraFiles: [
        {
            from: '/',
            to: '/',
            filter: ['*.env']
        }
    ]
})
