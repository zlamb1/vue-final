<script setup>
import {mapArray} from '~/models/Book'

const {qDark} = useDarkTheme();

const dialog = ref(null);
const descDialog = ref(null);
const searchInput = ref(null);

const books = ref([]);
const selectedBook = ref(null);

const totalItemsReturned = ref(0);
const totalItems = ref(0);

const searchPerformed = ref(false);
const search = ref('');

const awaitingFetch = ref(false);

const maxResults = ref(10);

const props = defineProps({
    books: {
        type: Array,
        default: Array(),
    }
});

const emit = defineEmits(['import', 'remove']);

const computedNoResultsText = computed(() => {
    return search.value && searchPerformed.value ? 'Try another search term' : 'Try searching with a search term'
});

function onShow() {
    searchInput.value?.$el.focus();
}

const {queryApi, limit} = useBookApi();
function onSearch() {
    if (search.value) {
        awaitingFetch.value = true;
        queryApi(search.value, maxResults.value).then((response) => {
            const items = response.data?.value?.items;
            if (items) {
                books.value = items;
                totalItemsReturned.value = items.length;
                totalItems.value = response.data?.value?.totalItems;
            } else {
                books.value.length = 0;
            }
            searchPerformed.value = true;
        }).finally(() => {
            awaitingFetch.value = false;
        });
    } else {
        search.value = '';
        books.value.length = 0;
        totalItemsReturned.value = 0;
        totalItems.value = 0;
        searchPerformed.value = false;
    }
}

function onRemove(book) {
    const foundBook = findBookByIsbn(book);
    if (foundBook) {
        emit('remove', foundBook);
    }
}

function trimDescription(desc) {
    const maxLength = 150;
    let str = desc;
    if (str.length > maxLength) {
        return str.substr(0, maxLength) + '...';
    } else {
        return str;
    }
}

function findBookByIsbn(book) {
    let foundBook = undefined;
    const identifiers = book?.volumeInfo?.industryIdentifiers;
    if (identifiers) {
        identifiers.every((id) => {
            let cont = true;
            props.books.every((book) => {
                let _cont = true;
                book.isbn.every((isbn) => {
                    if (isbn === id) {
                        cont = false;
                        _cont = false;
                        foundBook = book;
                        return false;
                    }
                    return true;
                });
                return _cont;
            });
            return cont;
        });
    }
    return foundBook;
}

function bookExists(book) {
    if (findBookByIsbn(book)) {
        return true;
    }
    return false;
}

function show() {
    dialog.value?.show();
}

function showDescDialog(book) {
    selectedBook.value = book;
    descDialog.value?.show();
}

watch(maxResults, (newVal) => {
    maxResults.value = Math.max(Math.min(newVal, limit), 1);
});

defineExpose({show});
</script>

<template>
    <q-dialog ref="dialog" @show="onShow" maximized>
        <q-card class="column no-wrap">
            <q-card-section class="row items-center q-gutter-md" :class="qDark ? 'text-white' : 'text-primary'">
                <q-icon name="library_books" size="sm" />
                <span class="non-selectable title">Search Google Books API</span>
                <q-btn icon="close" class="q-ml-auto" dense flat round v-close-popup />
            </q-card-section>
            <q-separator />
            <q-card-section class="row justify-center q-gutter-x-md">
                <q-input class="col-8 col-md-6 col-xl-4"
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
                <q-input class="col-3 col-md-2"
                         :color="qDark ? 'white' : 'primary'"
                         :label="`Max Results (1-${limit})`"
                         type="number"
                         v-model.number="maxResults"
                         min="1" :max="limit"
                         filled />
            </q-card-section>
            <q-card-section class="column q-pt-none" style="flex: 1;">
                <div v-if="books.length > 0" class="row q-gutter-md text-grey-6 q-mb-sm">
                    <span>Results returned: {{totalItemsReturned}}</span>
                    <span>Total items: {{totalItems}}</span>
                </div>
                <q-dialog ref="descDialog">
                    <q-card>
                        <q-card-section class="row items-center">
                            <span class="title">Description</span>
                            <q-btn class="q-ml-auto" icon="close" flat round v-close-popup />
                        </q-card-section>
                        <q-separator />
                        <q-card-section>
                            {{selectedBook.volumeInfo?.description}}
                        </q-card-section>
                    </q-card>
                </q-dialog>
                <transition-group name="list" tag="div" class="row justify-center q-gutter-y-md" appear>
                    <div class="col-12 col-md-6 col-lg-4" v-for="book in books" :key="book.id">
                        <q-card class="full-height q-mx-sm">
                            <q-card-section class="full-height" horizontal>
                                <q-card-section class="column fit q-pa-none">
                                    <q-card-section class="text-center title">
                                        {{book.volumeInfo?.title}} by
                                        {{mapArray(book.volumeInfo?.authors)}}
                                    </q-card-section>
                                    <q-separator />
                                    <q-card-section>
                                        <q-btn v-if="book.volumeInfo?.description"
                                               padding="0"
                                               @click="showDescDialog(book)"
                                               flat no-caps>
                                            Description:
                                            {{trimDescription(book.volumeInfo?.description)}}
                                        </q-btn>
                                    </q-card-section>
                                    <q-card-section class="row q-mt-auto">
                                        <q-btn v-if="bookExists(book)" color="red" icon="remove" @click="onRemove(book)" round>
                                            <q-tooltip class="bg-red-8">
                                                Remove from media list
                                            </q-tooltip>
                                        </q-btn>
                                        <q-btn v-else color="green" icon="add" @click="emit('import', book)" round>
                                            <q-tooltip class="bg-green-8">
                                                Add to media list
                                            </q-tooltip>
                                        </q-btn>
                                        <q-btn class="q-ml-auto" icon="visibility" @click="books.splice(books.indexOf(book), 1)" round>
                                            <q-tooltip class="bg-primary">
                                                Hide
                                            </q-tooltip>
                                        </q-btn>
                                    </q-card-section>
                                </q-card-section>
                                <q-separator vertical />
                                <q-card-section v-if="book.volumeInfo?.imageLinks?.thumbnail" class="row justify-center items-center fit">
                                    <q-img fit="cover" :src="book.volumeInfo?.imageLinks?.thumbnail" :img-style="{imageRendering: 'high-quality'}" />
                                </q-card-section>
                            </q-card-section>
                        </q-card>
                    </div>
                </transition-group>
                <span v-if="books.length < 1 && !awaitingFetch" class="column q-mt-md text-center text-grey-7">
                    No results...
                    <span>
                        {{computedNoResultsText}}
                    </span>
                </span>
                <div class="flex justify-center items-center q-my-auto">
                    <q-spinner-cube :color="qDark ? 'white' : 'primary'" size="xl" v-show="awaitingFetch && books.length < 1" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.title {
    font-size: 16px;
}
</style>