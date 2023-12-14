/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2022
        // parser: '@babel/eslint-parser',
        // parserOptions: {
        //     requireConfigFile: false,
        //     babelOptions: {
        //         plugins: ['@babel/plugin-syntax-import-assertions']
        //     }
        // }
    },
    extends: [
//        'prettier',
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        '@electron-toolkit',
        '@vue/eslint-config-prettier'
    ],
    rules: {
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off'
    },
    // options: {
    //     'vue/no-reserved-component-names': [
    //         'error',
    //         {
    //             disallowVueBuiltInComponents: false,
    //             disallowVue3BuiltInComponents: false
    //         }
    //     ]
    // }
}
