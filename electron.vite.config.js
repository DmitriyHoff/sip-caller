import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin({ exclude: ['sip.js'] })]
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
        transformHead({ assets }) {
            // adjust the regex accordingly to match your font
            const myFontFile = assets.find((file) => /font-name\.\w+\.ttf/)
            if (myFontFile) {
                return [
                    [
                        'link',
                        {
                            rel: 'preload',
                            href: myFontFile,
                            as: 'font',
                            type: 'font/ttf',
                            crossorigin: ''
                        }
                    ]
                ]
            }
        }
    }
})
