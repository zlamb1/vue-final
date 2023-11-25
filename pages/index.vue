<script setup>
import useDarkTheme from "~/composables/useDarkTheme";

import MediaList from "~/components/list/MediaList.vue";

const {dark} = useDarkTheme();

const showGridView = ref(false);
const showBackToTopBtn = ref(false);

let mediaList = ref(null);

function onToggleView() {
    mediaList.value.setShowGridView(showGridView.value);
}

function scrollToTop() {
    window.scroll(0, window.scrollY + mediaList.value.top());
}

const onScrollEvent = () => {
    showBackToTopBtn.value = mediaList.value.top() < 0
}

onMounted(() => {
    document.addEventListener('scroll', onScrollEvent);
});

onUnmounted(() => {
    document.removeEventListener('scroll', onScrollEvent);
})
</script>

<template>
    <div>
        <div class="row justify-between items-center q-my-lg">
            <q-btn-toggle
                class="q-ma-none fit-content"
                toggle-color="primary"
                :options="[
                        {icon: 'o_table_rows', value: false},
                        {icon: 'o_grid_view', value: true},
                    ]"
                v-model="showGridView"
                @click="onToggleView"
                spread>
            </q-btn-toggle>
            <q-btn color="blue-9" size="md" icon="public" flat round>
                <q-tooltip class="bg-accent text-center">
                    Click to view the global media list.
                </q-tooltip>
            </q-btn>
        </div>
        <MediaList ref="mediaList"></MediaList>
        <div class="full-width row justify-center fixed-top q-ma-lg" style="z-index: 9999;" v-show="showBackToTopBtn">
            <q-btn
                icon="keyboard_double_arrow_up"
                :color="dark ? 'grey-6' : 'primary'"
                :text-color="dark ? 'white' : 'grey-4'"
                @click="scrollToTop"
                round>
            </q-btn>
        </div>
    </div>
</template>

<style scoped>
.q-btn-toggle {
    width: 200px;
}
</style>