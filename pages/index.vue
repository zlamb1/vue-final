<script setup>
import MediaList from "~/components/list/MediaList.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";
import SplitMediaList from "~/components/list/SplitMediaList.vue";
import ResponseCode from "~/models/ResponseCode";

const $q = useQuasar();
const route = useRoute();
const {qDark} = useDarkTheme();

const {notifyPositive, notifyNegative} = useNotify();

const computedUID = computed(() => {
    return route?.query?.id;
});

const {mediaCollection} = useMediaCollection(computedUID, onError)

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
    window.scroll(0, window.scrollY + mediaList.value?.top());
}

const onScrollEvent = () => {
    if (mediaList.value) {
        showBackToTopBtn.value = mediaList.value?.top() < 0
    } else if (showBackToTopBtn.value) {
        showBackToTopBtn.value = false;
    }
}

async function addMediaItem(mediaItem) {
    const response = await mediaCollection?.dbAdd(mediaItem);
    if (response === ResponseCode.SUCCESS) {
        notifyPositive('Successfully added media item');
    } else {
        notifyNegative('Error occurred while adding media item');
    }
}

async function updateMediaItem(mediaItem) {
    const response = await mediaCollection?.dbUpdate(mediaItem);
    if (response === ResponseCode.SUCCESS) {
        notifyPositive('Successfully updated media item');
    } else {
        notifyNegative('Error occurred while updating media item');
    }
}

async function removeMediaItem(mediaItem) {
    const response = await mediaCollection?.dbRemove(mediaItem);
    if (response === ResponseCode.SUCCESS) {
        notifyPositive('Successfully removed media item');
    } else {
        notifyNegative('Error occurred while removing media item');
    }
}

onMounted(() => {
    document.addEventListener('scroll', onScrollEvent);
});

onUnmounted(() => {
    document.removeEventListener('scroll', onScrollEvent);
});
</script>

<template>
    <UserErrorCard v-if="error" />
    <div v-else>
        <div class="row justify-between items-center q-my-lg">
            <q-tabs :class="qDark ? 'text-white' : 'text-primary'" v-model="tab">
                <q-tab name="table" icon="o_table_rows" label="Table" />
                <q-tab name="grid" icon="o_grid_view" label="Grid" />
                <q-tab name="split" icon="vertical_split" label="Split" />
                <q-tab v-show="computedAllowEdits" name="graph" icon="bar_chart" label="Graph" />
            </q-tabs>
            <q-btn :color="qDark ? 'white' : 'accent'" size="md" icon="public" flat round>
                <q-tooltip class="bg-accent text-center">
                    Click to view the global media list.
                </q-tooltip>
            </q-btn>
        </div>
        <MediaList v-if="tab === 'table' || tab === 'grid'"
                   :media-collection="mediaCollection"
                   :tab="tab"
                   :allow-edits="computedAllowEdits"
                   @add-media="addMediaItem"
                   @update-media="updateMediaItem"
                   @remove-media="removeMediaItem"
                   ref="mediaList" />
        <SplitMediaList v-if="tab === 'split'"
                        :media-collection="mediaCollection"
                        :allow-edits="computedAllowEdits"
                        @add-media="addMediaItem"
                        @update-media="updateMediaItem"
                        @remove-media="removeMediaItem" />
        <GraphView v-if="tab === 'graph' && computedAllowEdits" />
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