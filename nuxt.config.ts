// https://nuxt.com/docs/api/configuration/nuxt-config
import materialIcons from 'quasar/icon-set/svg-material-icons';
import materialIconsOutlined from 'quasar/icon-set/material-icons-outlined';
import materialIconsRound from 'quasar/icon-set/svg-material-icons-round'

export default defineNuxtConfig({
    app: {
        pageTransition: { name: 'fade', mode: 'out-in' }
    },
    ssr: false,
    modules: ['nuxt-quasar-ui', 'nuxt-vuefire'],
    components: {
        global: true,
        dirs: ['~/components'],
    },
    css: ['~/assets/css/main.css', '~/assets/css/icons.css'],
    quasar: {
        sassVariables: '~/assets/quasar.variables.scss',
        plugins: ['AppFullscreen', 'Notify', 'Dialog'],
        iconSet: {
            ...materialIcons, materialIconsOutlined,
            colorPicker: materialIconsRound.colorPicker,
        },
        extras: {
            fontIcons: ['material-icons', 'material-icons-outlined'],
            animations: 'all',
        },
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
