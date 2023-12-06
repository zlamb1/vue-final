<script setup>
import MediaList from "~/components/list/MediaList.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";

const $q = useQuasar();
const route = useRoute();
const {qDark} = useDarkTheme();

const {mediaCollection} = useMediaCollection(route?.query?.id, onError)

const tab = ref($q.screen.lt.md ? 'grid' : 'table');
const error = ref(false);
const showBackToTopBtn = ref(false);

const mediaList = ref(null);

const computedAllowEdits = computed(() => {
    return !Boolean(route.query.id);
})

function onError(err) {
    if (err?.message.includes('Missing or insufficient permissions.')) {
        error.value = true;
    }
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
    <UserErrorCard v-if="error" />
    <div v-else>
        <div class="row justify-between items-center q-my-lg">
            <q-tabs :class="qDark ? 'text-white' : 'text-primary'" v-model="tab">
                <q-tab name="table" icon="o_table_rows" label="Table" />
                <q-tab name="grid" icon="o_grid_view" label="Grid" />
            </q-tabs>
            <q-btn :color="qDark ? 'white' : 'accent'" size="md" icon="public" flat round>
                <q-tooltip class="bg-accent text-center">
                    Click to view the global media list.
                </q-tooltip>
            </q-btn>
        </div>
        <MediaList :media-collection="mediaCollection"
                   :tab="tab"
                   :allow-edits="computedAllowEdits"
                   ref="mediaList" />
        <div class="full-width row justify-center fixed-top q-ma-lg" style="z-index: 9999;" v-show="showBackToTopBtn">
            <q-btn
                icon="keyboard_double_arrow_up"
                :color="qDark ? 'grey-6' : 'primary'"
                :text-color="qDark ? 'white' : 'grey-4'"
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