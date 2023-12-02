<script setup>
import ConfirmationDialog from "~/components/dialog/ConfirmationDialog.vue";
import DeleteList from "~/components/list/DeleteList.vue";
import EditDialog from "~/components/dialog/EditDialog.vue";
import MediaCard from "~/components/card/MediaCard.vue";
import MediaForm from "~/components/form/MediaForm.vue";
import MediaListHeader from "~/components/list/MediaListHeader.vue";
import Book from "~/models/Book";
import {Media, MediaType} from "~/models/Media";
import Movie from "~/models/Movie";
import MediaRow from "~/components/list/MediaRow.vue";
import BookAPIDialog from "~/components/dialog/BookAPIDialog.vue";
import ResponseCode from "~/models/ResponseCode";

const {qDark} = useDarkTheme();

const {mediaCollection} = useMediaCollection();

const newMediaItem = ref(new Media(new Book()));
const editMediaItem = ref({});
const moveMediaItem = ref(null);
const tableTitle = ref('The Media List');

const columns = ref([
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

const visible = ref([ 'title', 'type' ]);
const selected = ref([]);
const filters = ref([]);
const confirmDialog = ref(false);
const fullscreen = ref(false);
const tableFocused = ref(false);

const table = ref(null);
const addDialog = ref(null);
const editDialog = ref(null);
const addMediaForm = ref(null);
const editMediaForm = ref(null);
const bookApiDialog = ref(null);

defineProps({
    tab: {
        type: String,
    },
});

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

const computedISBNBooks = computed(() => {
    const books = [];
    mediaCollection.forEach((mediaItem) => {
        if (mediaItem.type === MediaType.Book) {
            const book = mediaItem.media;
            if (book && book.isbn) {
                books.push(book);
            }
        }
    });
    return books;
});

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

function onClickDeleteBtn() {
    confirmDialog.value?.showDialog();
}

function onAddDialogSubmit(mediaItem) {
    mediaCollection.dbAdd(mediaItem);
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

function onImportBook(item) {
    const book = Book.ConvertFromGoogleBookAPI(item);
    const mediaItem = new Media(book);
    mediaCollection.dbAdd(mediaItem);
}

function onRemoveImport(book) {
    for (let i = 0; i < mediaCollection.length; i++) {
        const mediaItem = mediaCollection[i];
        if (mediaItem.media === book) {
            mediaCollection.splice(i, 1);
            break;
        }
    }
}

function deleteSelected() {
    mediaCollection.delete(selected.value);
    selected.value = [];
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

defineExpose({top});
</script>

<template>
    <EditDialog
        :btn-text="'Add ' + newMediaItem.type"
        btn-color="green"
        @show="addMediaForm.focusForm()"
        @dialog-submit="addMediaForm.submitForm()"
        ref="addDialog">
        <MediaForm :media-item="newMediaItem" @onsubmit="onAddDialogSubmit" ref="addMediaForm" />
    </EditDialog>
    <EditDialog
        btn-text="Save"
        btn-color="blue-8"
        @show="editMediaForm.focusForm()"
        @dialog-submit="editMediaForm.submitForm()"
        ref="editDialog">
        <MediaForm :media-item="editMediaItem" @onsubmit="onEditDialogSubmit" ref="editMediaForm" />
    </EditDialog>
    <ConfirmationDialog
        confirmation-prompt="Confirm that you want to delete the following items"
        btnText="Delete"
        btnColor="red"
        @confirm="deleteSelected"
        ref="confirmDialog">
        <DeleteList :selected="selected" @empty="confirmDialog.closeDialog()" />
    </ConfirmationDialog>
    <BookAPIDialog :books="computedISBNBooks" @import="onImportBook" @remove="onRemoveImport" ref="bookApiDialog" />
    <q-table
        class="q-mx-none"
        :style="qDark && tab === 'table' ? 'border: 1px solid hsla(0,0%,100%,.28)' : null"
        :title="tableTitle"
        :rows="computedList"
        row-key="title"
        :columns="columns"
        :grid="tab === 'grid'"
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
        :flat="qDark"
        ref="table"
        square>
        <template #top>
            <MediaListHeader :table-title="tableTitle"
                             :show-grid-view="tab === 'grid'"
                             :selected="selected"
                             @click-add="onClickAddBtn"
                             @click-import="bookApiDialog.show()"
                             @click-delete="onClickDeleteBtn"
                             @toggle-fullscreen="fullscreen = !fullscreen">
                <q-checkbox class="q-ml-xs" color="grey-8" v-model="computedSelectAll" v-show="tab === 'grid'" />
            </MediaListHeader>
        </template>
        <template #header-selection>
            <q-checkbox color="grey-8" v-model="computedSelectAll" />
        </template>
        <template #body="props">
            <MediaRow @edit="openEditDialog(props.row)" :row="props.row">
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