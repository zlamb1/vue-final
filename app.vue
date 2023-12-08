<script setup>
import SliderToggle from "~/components/toggle/SliderToggle.vue";
import useGoogleBookApi from "~/composables/useGoogleBookApi";

const route = useRoute();
const $q = useQuasar();
const {dark, useDarkThemeTransition} = useDarkTheme();

// load initial value
$q.dark.set(dark.value);

const darkModeSlider = ref(null);

function toggleDarkMode() {
    if (darkModeSlider.value) {
        const boundingRect = darkModeSlider.value.$el.getBoundingClientRect();
        const x = boundingRect.left + ((boundingRect.right - boundingRect.left) / 2);
        const y = boundingRect.top + ((boundingRect.bottom - boundingRect.top) / 2);
        useDarkThemeTransition(x, y);
    } else {
        console.warn('cannot toggle dark mode without a slider reference!');
    }
}
</script>

<template>
    <q-layout>
        <AppHeader>
            <SliderToggle active-color="yellow-2"
                          left-icon="light_mode"
                          left-icon-color="yellow-8"
                          right-icon="dark_mode"
                          right-icon-color="grey-6"
                          size="sm"
                          v-model="dark"
                          @update:model-value="toggleDarkMode"
                          ref="darkModeSlider" />
        </AppHeader>
        <q-page-container>
            <q-page class="q-ma-xl">
                <NuxtPage />
            </q-page>
        </q-page-container>
        <AppFooter />
    </q-layout>
</template>