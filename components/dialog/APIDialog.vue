<script setup>
import useGoogleBookApi from "~/composables/useGoogleBookApi";
import APIBookCard from "~/components/card/APIBookCard.vue";
import APISongCard from "~/components/card/APISongCard.vue";
import SkeletonCard from "~/components/card/SkeletonCard.vue";
import {Media} from "~/models/Media";
import Book from '~/models/Book'
import Song from '~/models/Song'

const {qDark} = useDarkTheme();

const dialog = ref(null);
const morphGroupModel = ref('btn');
const searchInput = ref(null);

const apiSelected = ref('google_books');
const mediaItems = ref([]);
const totalItemsReturned = ref(0);
const totalItems = ref(0);
const searchPerformed = ref(false);
const search = ref('');
const awaitingFetch = ref(false);
const maxResults = ref(10);
const latestAction = ref(Date.now());

const actionTimeout = 1000;

const cardCount = {
    xs: 1,
    sm: 4,
    md: 6,
    lg: 12,
    xl: 18,
}

const nextMorphStep = {
    btn: 'menu',
    menu: 'btn',
}

const props = defineProps({
    existingItems: {
        type: Array,
        default: [],
    },
});

const emit = defineEmits(['import', 'remove']);

const computedNoResultsText = computed(() => {
    return search.value && searchPerformed.value ? 'Try another search term' : 'Try searching with a search term'
});

function onShow() {
    searchInput.value?.$el.focus();
}

const googleBooksApi = useGoogleBookApi();
const iTunesApi = useITunesAPI();

const computedLimit = computed(() => {
    switch (apiSelected.value) {
        case 'google_books':
            return googleBooksApi.limit;
        case 'itunes':
            return iTunesApi.limit;
        default:
            return googleBooksApi.limit;
    }
});

async function onSearch() {
    if (search.value) {
        awaitingFetch.value = true;
        const queryFn = apiSelected.value === 'google_books' ? googleBooksApi.queryApi : iTunesApi.queryApi;
        const {items, count, totalCount} = await queryFn(search.value, maxResults.value) || {};
        if (items) {
            mediaItems.value = items;
            totalItemsReturned.value = count;
            totalItems.value = totalCount;
        } else {
            mediaItems.value.length = 0
        }
        awaitingFetch.value = false;
    } else {
        search.value = '';
        mediaItems.value.length = 0;
        totalItemsReturned.value = 0;
        totalItems.value = 0;
        searchPerformed.value = false;
    }
}

function findExistingItem(mediaItem) {
    const volumeInfo = mediaItem?.volumeInfo;
    for (let i = 0; i < props.existingItems?.length; i++) {
        const media = props.existingItems[i]?.media;
        if (volumeInfo) {
            if (mediaItem?.id === media?.googleBooksId) {
                return props.existingItems[i];
            }
        } else {
            if (mediaItem?.trackId === media?.trackId) {
                return props.existingItems[i];
            }
        }
    }
}

const {notifyNegative} = useNotify();

function onImport(rawItem) {
    if (Date.now() - latestAction.value > actionTimeout) {
        latestAction.value = Date.now();
        const media = rawItem?.volumeInfo ? Book.ConvertFromGoogleBookAPI(rawItem) : Song.ConvertFromITunesAPI(rawItem);
        emit('import', new Media(media));
    } else {
        notifyNegative('Please wait a few moments before performing another action!');
    }
}

function onRemove(rawItem) {
    if (Date.now() - latestAction.value > actionTimeout) {
        latestAction.value = Date.now();
        const existingItem = findExistingItem(rawItem);
        if (existingItem) {
            emit('remove', existingItem);
        } else {
            notifyNegative("Error occurred: couldn't find item in media collection.");
        }
    } else {
        notifyNegative('Please wait a few moments before performing another action!');
    }
}

function nextMorph() {
    morphGroupModel.value = nextMorphStep[morphGroupModel.value]
}

function show() {
    dialog.value?.show();
}

watch(maxResults, (newVal) => {
    maxResults.value = Math.max(Math.min(newVal, computedLimit.value), 1);
});

defineExpose({show});
</script>

<template>
    <q-dialog class="relative-position" ref="dialog" @show="onShow" maximized>
        <div class="absolute-left menu" v-morph:menu:apigroup:200.resize="morphGroupModel">
            <div class="row justify-end q-pa-md">
                <q-btn icon="menu" @click="nextMorph" flat />
            </div>
            <div class="column  q-gutter-y-sm q-mx-md">
                <q-btn :color="apiSelected === 'google_books' ? 'primary' : undefined"
                       label="Google Books"
                       icon="auto_stories"
                       @click="apiSelected = 'google_books'"
                       push />
                <q-btn :color="apiSelected === 'itunes' ? 'primary' : undefined"
                       label="iTunes"
                       icon="music_note"
                       @click="apiSelected = 'itunes'"
                       push />
            </div>
        </div>
        <q-card class="column no-wrap">
            <q-card-section class="row q-pa-sm relative-position" :class="qDark ? 'text-white' : 'text-primary'">
                <div class="col-12 col-sm-1">
                    <q-btn class="q-mx-md" v-morph:btn:apigroup:200.resize="morphGroupModel" @click="nextMorph" icon="menu" flat />
                </div>
                <div class="col-10 row justify-center items-center">
                    <q-icon class="on-left" name="library_books" size="md" />
                    <span class="non-selectable" style="font-size: 20px;">Search for Media</span>
                </div>
                <div class="col-1 row items-center">
                    <q-btn icon="close" class="q-ml-auto q-mr-md" flat v-close-popup />
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="row">
                <div class="row justify-center q-gutter-md full-width">
                    <q-input class="col-10 col-sm-8 col-md-6 col-lg-4 col-xl-3"
                             :color="qDark ? 'white' : 'primary'"
                             label="Search"
                             type="search"
                             v-model="search"
                             @search="onSearch"
                             @clear="onSearch"
                             ref="searchInput"
                             filled>
                        <template #append>
                            <q-spinner-dots class="on-right" v-show="awaitingFetch" />
                            <div v-if="search">
                                <q-btn icon="cancel" @click="() => { search = ''; onSearch(); }" round flat />
                            </div>
                            <q-btn icon="search" @click="onSearch" round flat />
                        </template>
                    </q-input>
                    <q-input class="col-10 col-sm-2"
                             :color="qDark ? 'white' : 'primary'"
                             :label="`Max Results (1-${computedLimit})`"
                             type="number"
                             v-model.number="maxResults"
                             min="1" :max="computedLimit"
                             filled />
                </div>
            </q-card-section>
            <q-card-section class="column q-pt-none" style="flex: 1;">
                <div v-if="mediaItems.length > 0" class="row q-gutter-md text-grey-6 q-mb-sm">
                    <span>Items returned: {{totalItemsReturned}}</span>
                    <span v-show="totalItemsReturned !== totalItems">Total items: {{totalItems}}</span>
                </div>
                <span v-if="mediaItems.length < 1 && !awaitingFetch" class="column q-mt-md text-center text-grey-7">
                    No results...
                    <span>
                        {{computedNoResultsText}}
                    </span>
                </span>
                <transition-group name="list" tag="div" class="row justify-center q-gutter-y-md" appear>
                    <div class="col-12 col-md-6 col-lg-4" v-for="item in mediaItems" :key="item.id ?? item.trackId">
                        <component class="full-height q-mx-sm"
                                   :is="item?.volumeInfo ? APIBookCard : APISongCard"
                                   :item="item"
                                   :removable="!!findExistingItem(item)"
                                   @add="onImport"
                                   @remove="onRemove" />
                    </div>
                </transition-group>
                <div v-if="mediaItems.length === 0 && !awaitingFetch" class="row full-width justify-center q-mt-lg">
                    <div v-for="i in cardCount[$q.screen.name]" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 row justify-center q-px-sm">
                        <div class="full-width q-my-sm">
                            <SkeletonCard class="full-width" />
                        </div>
                    </div>
                </div>
                <div class="flex justify-center items-center q-my-auto">
                    <q-spinner-cube :color="qDark ? 'white' : 'primary'" size="xl" v-show="awaitingFetch && mediaItems.length < 1" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.title {
    font-size: 16px;
}
.menu {
    width: fit-content;
    height: 100%;
    z-index: 99;
    border-right: 1px solid rgba(229, 229, 229);
    background: #fff !important;
}
</style>