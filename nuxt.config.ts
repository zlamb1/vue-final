// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    modules: ['nuxt-quasar-vite', 'nuxt-vuefire'],
    components: {
        global: true,
        dirs: ['~/components'],
    },
    css: ['~/assets/css/main.css', '~/assets/css/icons.css'],
    quasar: {
        sassVariables: '~/assets/quasar.variables.scss',
        css: [
            '@quasar/extras/material-icons/material-icons.css',
            '@quasar/extras/material-icons-outlined/material-icons-outlined.css',
        ],
        plugins: ['Dialog'],
        config: {
            dark: false,
        }
    },
    vuefire: {
        emulators: {
            enabled: false,
        },
        auth: {
            enabled: true,
        },
        config: {
            apiKey: "AIzaSyAiSuWkxUqQ3ZJyRjPhqHr9FYyVsj67BCI",
            authDomain: "vue-final-2c897.firebaseapp.com",
            projectId: "vue-final-2c897",
            storageBucket: "vue-final-2c897.appspot.com",
            messagingSenderId: "90340709809",
            appId: "1:90340709809:web:b726c41627fd11e9bf5990",
            measurementId: "G-1K97LVVS5D"
        }
    },
});
