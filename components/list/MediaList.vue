<script setup>
import ConfirmationDialog from "~/components/dialog/ConfirmationDialog.vue";
import DeleteList from "~/components/list/DeleteList.vue";
import EditDialog from "~/components/dialog/EditDialog.vue";
import FilterList from "~/components/list/FilterList.vue";
import MediaCard from "~/components/card/MediaCard.vue";
import MediaForm from "~/components/form/MediaForm.vue";
import Book from "~/models/Book";
import {Filter} from "~/models/Filter";
import {Media, MediaType} from "~/models/Media";
import Movie from "~/models/Movie";
import MediaCollection from "~/models/MediaCollection";
import MediaRow from "~/components/list/MediaRow.vue";

const $q = useQuasar();

const mediaCollection = reactive(new MediaCollection([
    new Media(new Book('The Housemaid', 'Fredia McFadden', 28, 336, 4, 'Paperback', 'https://m.media-amazon.com/images/I/51+UxIo+YNL.jpg', false)),
    new Media(new Movie('Oppenheimer', 'Christopher Nolan', '2023/07/21', '3:06', 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg')),
    new Media(new Book('48 Laws of Power', 'Robert Green', 16, 480, 4, 'Paperback', 'https://m.media-amazon.com/images/I/31tnyOf+-sL._SY445_SX342_.jpg', false)),
    new Media(new Book('Holly', 'Stephen King', 8, 464, 3, 'Hardcover', 'https://m.media-amazon.com/images/I/51J9mQz4SrL.jpg', false)),
    new Media(new Book('Diary of a Wimpy Kid', 'Jeff Kinney', 3, 221, 4, 'Paperback', 'https://m.media-amazon.com/images/I/51cNlR3+BEL.jpg', false)),
    new Media(new Book('The Sword of Summer: Magnus Chase and the Gods of Asgard', 'Rick Riordan', 5, 531, 4, 'Kindle', 'https://m.media-amazon.com/images/I/615Dt5+caxL.jpg', false)),
    new Media(new Book('The Outsiders', 'S. E. Hilton', 14, 192, 4, 'Paperback', 'https://m.media-amazon.com/images/I/41ZUA+0GI8L.jpg', false)),
    new Media(new Book('Farenheit 451', 'Ray Bradbury', 7, 272, 4, 'Paperback', 'https://m.media-amazon.com/images/I/41VXKfFmVwL.jpg', false)),
    new Media(new Book('The Very Hungry Caterpillar', 'Eric Carle', 23, 32, 4, 'Kindle', 'https://m.media-amazon.com/images/I/51VAbILVUPL.jpg', false)),
    new Media(new Book('Goodnight Moon', 'Margaret Wise Brown', 19, 32, 4, 'Hardcover', 'https://m.media-amazon.com/images/I/61BnppyErjL.jpg', false)),
    new Media(new Book('Happy Birthday to You!', 'Dr. Seuss', 13, 64, 4, 'Hardcover', 'https://m.media-amazon.com/images/I/51xHgwuohnL._SY445_SX342_.jpg', false)),
    new Media(new Book('One Fish Two Fish Red Fish Blue Fish', 'Dr. Seuss', 9, 72, 5, 'Hardcover', 'https://m.media-amazon.com/images/I/51YWnlLkblL._SY445_SX342_.jpg', false)),
    new Media(new Book('The Lost Hero', 'Rick Riordan', 187, 592, 3, 'Hardcover', 'https://m.media-amazon.com/images/I/51Esx9gaGiL.jpg', false)),
    new Media(new Book('The Outsider', 'Stephen King', 203, 576, 4, 'Paperback', 'https://m.media-amazon.com/images/I/61-QjYwjyBL.jpg', false)),
    new Media(new Book('Percy Jackson and the Olympians: The Chalice of the Gods', 'Rick Riordan', 98, 242, 2, 'Hardcover', 'https://m.media-amazon.com/images/I/51pzG0y+ZGL.jpg', false)),
    new Media(new Book('The Blood of Olympus: The Heroes of Olympus, Book 5', 'Rick Riordan', 3, 544, 3, 'Kindle', 'https://m.media-amazon.com/images/I/61UAso1q57L.jpg', false))
]));
let newMediaItem = ref(new Media(new Book()));
let editMediaItem = ref({});
let moveMediaItem = ref(null);
let tableTitle = ref('The Media List');

let columns = ref([
    {
        name: 'media',
        field: 'media'
    },
    {
        name: 'title',
        label: 'Title',
        field: row => row.media.title,
        sortable: true,
        align: 'left',
        required: true,
    },
    {
        name: 'type',
        label: 'Media Type',
        field: 'type',
        sortable: true,
        align: 'left',
        required: true,
    },
]);

let visible = ref([ 'title', 'type' ]);
let selected = ref([]);
let filters = ref([]);
let confirmDialog = ref(false);
let showGridView = ref(false);
let fullscreen = ref(false);
let tableFocused = ref(false);

let table = ref(null);
let addDialog = ref(null);
let editDialog = ref(null);
let addMediaForm = ref(null);
let editMediaForm = ref(null);

const useDarkTheme = inject('useDarkTheme', false);

const computedList = computed(() => {
    for (const filter of filters.value) {
        filter.filteredCount = 0;
    }

    return mediaCollection.filter((mediaItem) => {
        for (const filter of filters.value) {
            if (!filter.matchFilter(mediaItem)) {
                filter.filteredCount++;
                return false;
            }
        }
        return true;
    });
});

const computedSelectAll = computed({
    get() {
        if (selected.value.length === 0) {
            return false;
        } else {
            let found = 0;
            for (const row of table.value.computedRows) {
                if (selected.value.indexOf(row) > -1) {
                    found++;
                }
            }
            switch (found) {
                case 0:
                    return false;
                case table.value.computedRows.length:
                    return true;
                default:
                    return null;
            }
        }
    },
    set() {
        switch (computedSelectAll.value) {
            case true:
            case null:
                for (const row of table.value.computedRows) {
                    const index = selected.value.indexOf(row);
                    if (index > -1) {
                        selected.value.splice(index, 1);
                    }
                }

                break;
            case false:
                for (const row of table.value.computedRows) {
                    if (selected.value.indexOf(row) < 0) {
                        selected.value.push(row);
                    }
                }

                break;
        }
    }
});

const emit = defineEmits(['updateShowGridView']);

function onClickAddBtn(mediaType) {
    switch (mediaType) {
        case MediaType.Book:
            newMediaItem.value = new Media(new Book());
            break;
        case MediaType.Movie:
            newMediaItem.value = new Media(new Movie());
            break;
        default:
            console.warn('Trying to open add dialog with undefined media type!');
            return;
    }

    addDialog.value.showDialog();
}

function onAddDialogSubmit(mediaItem) {
    mediaCollection.push(mediaItem);
    addDialog.value.hideDialog();
}

function openEditDialog(mediaItem) {
    editMediaItem.value = mediaItem
    editDialog.value.showDialog();
}

function onEditDialogSubmit(mediaItem) {
    editDialog.value.hideDialog();
    const index = mediaCollection.indexOf(editMediaItem.value);
    if (index > -1) {
        mediaCollection[index] = mediaItem;
    } else {
        console.warn('Could not find edit book: ', editMediaItem.value);
    }

    editMediaItem.value = null;
}

function onClickDeleteSelected() {
    confirmDialog.value.openDialog();
}

function deleteSelected() {
    mediaCollection.delete(selected.value);
    selected.value = [];
}

function onAddFilter(filterString) {
    filters.value.push(new Filter(filterString));
}

function onRemoveFilter(filter) {
    filters.value.splice(filters.value.indexOf(filter), 1);
}

function setShowGridView(_new) {
    showGridView.value = _new;
}

function onToggleFullscreen() {
    if (fullscreen.value) {
        table.value.$el.focus();
    }
}

function top() {
    return table.value.$el.getBoundingClientRect().top;
}

function getSwapMediaItem(boundingRect, mediaItem) {
    const cards = table.value.$el.querySelectorAll('.media-card');
    const cardWidth = boundingRect.right - boundingRect.left;
    const cardHeight = boundingRect.bottom - boundingRect.top;
    for (const card of cards) {
        const cardBoundingRect = card.getBoundingClientRect();
        if (Math.abs(cardBoundingRect.left - boundingRect.left) < cardWidth / 2
            && Math.abs(cardBoundingRect.top - boundingRect.top) < cardHeight / 2) {
            const vueElement = card.__vue__;
            if (vueElement.getMediaItem() !== mediaItem) {
                return vueElement.getMediaItem();
            }
        }
    }

    return null;
}

function onCardPan(boundingRect, mediaItem) {
    const swapMediaItem = getSwapMediaItem(boundingRect, mediaItem);
    const cards = table.value.$el.querySelectorAll('.media-card');
    let found = false;
    for (const card of cards) {
        const vueElement = card.__vue__;
        if (vueElement.getMediaItem() === swapMediaItem) {
            moveMediaItem.value = swapMediaItem;
            found = true;
            break;
        }
    }

    if (!found) {
        moveMediaItem.value = null;
    }
}

function onCardMove(boundingRect, mediaItem) {
    moveMediaItem.value = null;
    const swapMediaItem = getSwapMediaItem(boundingRect, mediaItem);
    if (swapMediaItem !== null) {
        mediaCollection.swapItems(mediaItem, swapMediaItem)
    }
}

/* WATCH */

watch(showGridView, (_new) => {
   emit('updateShowGridView', _new);
});

defineExpose({setShowGridView, top});

showGridView.value = $q.screen.lt.md;
emit('updateShowGridView', showGridView.value);
</script>

<template>
    <EditDialog
        :btn-text="'Add ' + newMediaItem.type"
        btn-color="green"
        @show="addMediaForm.focusForm()"
        @dialog-submit="addMediaForm.submitForm()"
        ref="addDialog">
        <MediaForm :media="newMediaItem" @onsubmit="onAddDialogSubmit" ref="addMediaForm"></MediaForm>
    </EditDialog>
    <EditDialog
        btn-text="Save"
        btn-color="blue-8"
        @show="editMediaForm.focusForm()"
        @dialog-submit="editMediaForm.submitForm()"
        ref="editDialog">
        <MediaForm :media="editMediaItem" @onsubmit="onEditDialogSubmit" ref="editMediaForm"></MediaForm>
    </EditDialog>
    <ConfirmationDialog
        confirmation-prompt="Confirm that you want to delete the following items"
        btnText="Delete"
        btnColor="red"
        @confirm="deleteSelected"
        ref="confirmDialog">
        <DeleteList :selected="selected" @empty="confirmDialog.closeDialog()"></DeleteList>
    </ConfirmationDialog>
    <q-table
        class="q-mx-none"
        :style="useDarkTheme && !showGridView ? 'border: 1px solid hsla(0,0%,100%,.28)' : null"
        :title="tableTitle"
        :rows="computedList"
        row-key="title"
        :columns="columns"
        :grid="showGridView"
        :visible-columns="visible"
        separator="cell"
        selection="multiple"
        v-model:selected="selected"
        :fullscreen="fullscreen"
        tabindex="0"
        @focusin="tableFocused = true"
        @focusout="tableFocused = false"
        @fullscreen="onToggleFullscreen"
        @keydown.esc="fullscreen = false"
        v-bind="$attrs"
        :flat="useDarkTheme"
        ref="table"
        square>
        <template #top>
            <div class="column full-width q-gutter-y-sm" :class="{'q-pb-sm' : showGridView}">
                <div class="row items-center q-gutter-x-md">
                    <div class="q-table__title text-h5 non-selectable text-bold">
                        {{tableTitle}}
                    </div>
                    <q-checkbox class="q-ml-xs" color="grey-8" v-model="computedSelectAll" v-show="showGridView" />
                    <q-space />
                    <q-btn-dropdown
                        class="state-btn text-caption text-bold"
                        label="Add Item"
                        :color="useDarkTheme ? 'green-8' : 'green-6'"
                        stretch>
                        <q-list v-for="item in MediaType" :key="item">
                            <q-item class="text-white text-caption"
                                    :class="useDarkTheme ? 'bg-green-8' : 'bg-green-6'"
                                    @click="onClickAddBtn(item)"
                                    clickable
                                    v-close-popup>
                                <q-item-section>
                                    <q-item-label>{{item}}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
                    <q-btn
                        class="state-btn text-caption text-bold"
                        color="red"
                        :label="selected.length > 1 ? 'Delete Items' : 'Delete Item'"
                        v-show="selected.length > 0"
                        @click="onClickDeleteSelected"
                        stretch />
                    <q-btn
                        icon="fullscreen"
                        v-show="!showGridView"
                        @click="fullscreen = !fullscreen" />
                </div>
                <FilterList
                    class="q-mx-md"
                    :filters="filters"
                    @add-filter="onAddFilter"
                    @remove-filter="onRemoveFilter"
                    @remove-filters="filters = []"
                    ref="filterList" />
            </div>
        </template>
        <template #header-selection>
            <q-checkbox color="grey-8" v-model="computedSelectAll"></q-checkbox>
        </template>
        <template #body="props">
            <MediaRow :row="props.row">
                <q-checkbox :val="props.row" v-model="selected" color="grey-8" />
            </MediaRow>
        </template>
        <template #item="props">
            <MediaCard
                :selected="selected"
                :media="props.row"
                :highlighted="props.row === moveMediaItem"
                :val="props.row"
                :key="props.row.media.title + props.row.type"
                @edit="openEditDialog(props.row)"
                @pan="onCardPan"
                @move="onCardMove">
            </MediaCard>
        </template>
    </q-table>
</template>

<style scoped>
    .state-btn {
        width: 125px;
    }
</style>