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
const page = ref(1);
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

async function onRefresh(done) {
    await onSearch();
    done();
}

async function onSearch() {
    if (search.value) {
        awaitingFetch.value = true;
        const queryFn = apiSelected.value === 'google_books' ? googleBooksApi.queryApi : iTunesApi.queryApi;
        const {items, count, totalCount} = await queryFn(search.value, maxResults.value, (page.value - 1) * maxResults.value) || {};
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

function closeMenu() {
    if (morphGroupModel.value === 'menu') {
        nextMorph();
    }
}

function show() {
    dialog.value?.show();
}

watch(maxResults, (newVal) => {
    maxResults.value = Math.max(Math.min(newVal, computedLimit.value), 1);
});

watch(search, () => {
    page.value = 1;
});

watch(maxResults, () => {
    page.value = 1;
    onSearch();
});

watch(page, () => {
   onSearch();
});

defineExpose({show});
</script>

<template>
    <q-dialog class="relative-position" ref="dialog" @show="onShow" maximized>
        <div class="absolute-left menu" v-morph:menu:apigroup:200.resize="morphGroupModel">
            <div class="column q-gutter-y-md q-pa-md">
                <div class="row q-ml-auto">
                    <q-btn :color="qDark ? 'white' : 'primary'" icon="menu" @click="nextMorph" flat />
                </div>
                <div class="column q-gutter-y-sm q-mx-md">
                    <q-btn label="Google Books"
                           icon="auto_stories"
                           :color="apiSelected === 'google_books' ? 'accent' : 'white'"
                           :text-color="apiSelected === 'google_books' ? 'white' : 'primary'"
                           @click="apiSelected = 'google_books'"
                           push />
                    <q-btn label="iTunes"
                           icon="music_note"
                           :color="apiSelected === 'itunes' ? 'accent' : 'white'"
                           :text-color="apiSelected === 'itunes' ? 'white' : 'primary'"
                           @click="apiSelected = 'itunes'"
                           push />
                </div>
            </div>
        </div>
        <q-card class="column no-wrap" @click="closeMenu">
            <q-card-section class="row q-pa-sm relative-position" :class="qDark ? 'text-white' : 'text-primary'">
                <div class="col-12 col-sm-1">
                    <q-btn class="q-mx-md" v-morph:btn:apigroup:200.resize="morphGroupModel" @click.stop="nextMorph" icon="menu" flat />
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
                <div class="row justify-center items-center q-gutter-md full-width">
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
                                <q-btn icon="cancel" :color="qDark ? 'white' : 'primary'" @click="() => { search = ''; onSearch(); }" round flat />
                            </div>
                            <q-icon name="info" :color="qDark ? 'white' : 'primary'">
                                <q-tooltip class="bg-primary text-white">
                                    Search Google Book API or iTunes API for media to add to your media list.
                                </q-tooltip>
                            </q-icon>
                            <q-btn :color="qDark ? 'white' : 'primary'" icon="search" @click="onSearch" round flat />
                        </template>
                    </q-input>
                    <q-input class="col-10 col-sm-2"
                             type="number"
                             v-model.number="maxResults"
                             min="1" :max="computedLimit"
                             :color="qDark ? 'white' : 'primary'"
                             :label="`Max Results (1-${computedLimit})`"
                             filled />
                </div>
            </q-card-section>
            <q-card-section class="column q-pt-none" style="flex: 1;">
                <div class="row text-grey-6">
                    <div v-if="mediaItems.length > 0" class="col-12 col-sm-3 row items-center q-gutter-x-md non-selectable">
                        <span>Items returned: {{totalItemsReturned}}</span>
                        <span v-show="totalItemsReturned !== totalItems">Total items: {{totalItems}}</span>
                    </div>
                    <div v-if="totalItems > 0" class="col row justify-center items-center full-height">
                        <q-pagination
                            v-model="page"
                            :max="totalItems / maxResults"
                            :max-pages="5"
                            color="grey"
                            active-color="primary"
                            input flat />
                    </div>
                    <div v-if="mediaItems.length > 0" class="col-0 col-sm-3" />
                </div>
                <span v-if="mediaItems.length < 1 && !awaitingFetch" class="column q-mt-md text-center text-grey-7">
                    No results...
                    <span>
                        {{computedNoResultsText}}
                    </span>
                </span>
                <q-pull-to-refresh @refresh="onRefresh">
                    <transition-group name="list" tag="div" class="row justify-center q-gutter-y-md" appear>
                        <div class="col-12 col-md-6 col-lg-4" v-for="item in mediaItems" :key="item.id ?? item.trackId">
                            <component class="full-height q-mx-sm"
                                       :is="item?.volumeInfo ? APIBookCard : APISongCard"
                                       :item="item"
                                       :removable="!!findExistingItem(item)"
                                       @add="onImport"
                                       @remove="onRemove"
                                       @hide="mediaItems?.splice(mediaItems?.indexOf(item), 1)" />
                        </div>
                    </transition-group>
                </q-pull-to-refresh>
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
.menu {
    width: fit-content;
    z-index: 99;
    border-right: 1px solid rgba(229, 229, 229);
}

.body--light .menu {
    background: #fff !important;
}

.body--dark .menu {
    background: var(--q-dark) !important;
}
</style>