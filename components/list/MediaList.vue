<script setup>
import ConfirmationDialog from "~/components/dialog/ConfirmationDialog.vue";
import DeleteList from "~/components/list/DeleteList.vue";
import EditDialog from "~/components/dialog/EditDialog.vue";
import MediaCard from "~/components/card/MediaCard.vue";
import MediaForm from "~/components/form/MediaForm.vue";
import MediaListHeader from "~/components/list/MediaListHeader.vue";
import MediaRow from "~/components/list/MediaRow.vue";
import BookAPIDialog from "~/components/dialog/APIDialog.vue";
import Book from "~/models/Book";
import {Media, MediaType} from "~/models/Media";
import MediaFactory from "~/models/factory/MediaFactory";
import MediaCollection from "~/models/MediaCollection";
import APIDialog from "~/components/dialog/APIDialog.vue";

const {qDark} = useDarkTheme();

const newMediaItem = ref(new Media(new Book()));
const editMediaItem = ref({});
const moveMediaItem = ref(null);
const tableTitle = ref('Media List');
const expanded = ref({});

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

const search = ref(null);
const visible = ref([ 'title', 'type' ]);
const selected = ref([]);
const confirmDialog = ref(false);
const fullscreen = ref(false);

const table = ref(null);
const addDialog = ref(null);
const editDialog = ref(null);
const addMediaForm = ref(null);
const editMediaForm = ref(null);
const apiDialog = ref(null);

const props = defineProps({
    mediaCollection: {
        type: Array,
        default: reactive(new MediaCollection([])),
    },
    tab: {
        type: String,
    },
    allowEdits: {
        type: Boolean,
        default: true,
    }
});

const emit = defineEmits(['add-media', 'update-media', 'remove-media']);

const computedList = computed(() => {
    if (search.value) {
        return props.mediaCollection?.filter((mediaItem) => mediaItem?.media?.title?.includes(search.value));
    } else {
        return props.mediaCollection;
    }
});

const computedSelectAll = computed({
    get() {
        if (selected.value.length === 0) {
            return false;
        } else {
            let found = 0;
            for (const row of table.value?.computedRows) {
                if (selected.value.indexOf(row) > -1) {
                    found++;
                }
            }
            switch (found) {
                case 0:
                    return false;
                case table.value?.computedRows.length:
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
                for (const row of table.value?.computedRows) {
                    const index = selected.value.indexOf(row);
                    if (index > -1) {
                        selected.value.splice(index, 1);
                    }
                }

                break;
            case false:
                for (const row of table.value?.computedRows) {
                    if (selected.value.indexOf(row) < 0) {
                        selected.value.push(row);
                    }
                }

                break;
        }
    }
});

function onClickAddBtn(type) {
    if (type === 'import') {
        apiDialog.value?.show();
        return;
    }
    newMediaItem.value = MediaFactory.CreateInstance(type);
    addDialog.value?.open();
}

function onClickDeleteBtn() {
    confirmDialog.value?.open();
}

function onAddDialogSubmit(mediaItem) {
    emit('add-media', mediaItem);
    addDialog.value?.hide();
}

function openEditDialog(mediaItem) {
    editMediaItem.value = mediaItem
    editDialog.value?.open();
}

function onEditDialogSubmit(mediaItem) {
    emit('update-media', mediaItem);
}

async function deleteSelected() {
    const selectedCopy = [...selected.value];
    for (const media of selectedCopy) {
        emit('remove-media', media);
    }
    selected.value = [];
}

function onToggleFullscreen() {
    if (fullscreen.value) {
        table.value?.$el?.focus();
    }
}

function top() {
    return table.value?.$el?.getBoundingClientRect().top;
}

function getSwapMediaItem(boundingRect, mediaItem) {
    const cards = table.value?.$el?.querySelectorAll('.media-card');
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
    const cards = table.value?.$el?.querySelectorAll('.media-card');
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
        props.mediaCollection?.swapItems(mediaItem, swapMediaItem)
    }
}

defineExpose({top});
</script>

<template>
    <EditDialog
        :btn-text="'Add ' + newMediaItem.type"
        btn-color="green"
        @show="addMediaForm?.focusForm()"
        @dialog-submit="addMediaForm?.submitForm()"
        ref="addDialog">
        <MediaForm :media-item="newMediaItem" @onsubmit="onAddDialogSubmit" ref="addMediaForm" />
    </EditDialog>
    <EditDialog
        btn-text="Save"
        btn-color="blue-8"
        @show="editMediaForm?.focusForm()"
        @dialog-submit="editMediaForm?.submitForm()"
        ref="editDialog">
        <MediaForm :media-item="editMediaItem" @onsubmit="onEditDialogSubmit" ref="editMediaForm" />
    </EditDialog>
    <ConfirmationDialog
        confirmation-prompt="Confirm that you want to delete the following items."
        btnText="Delete"
        btnColor="red"
        @confirm="deleteSelected"
        ref="confirmDialog">
        <DeleteList :selected="selected" @empty="confirmDialog.closeDialog()" />
    </ConfirmationDialog>
    <APIDialog :existing-items="mediaCollection"
               @import="(item) => emit('add-media', item)"
               @remove="(item) => emit('remove-media', item)"
               ref="apiDialog" />
    <q-table
        class="q-mx-none"
        row-key="title"
        separator="cell"
        tabindex="0"
        v-model:selected="selected"
        v-bind="$attrs"
        :style="qDark && tab === 'table' ? 'border: 1px solid hsla(0,0%,100%,.28)' : null"
        :title="tableTitle"
        :rows="computedList"
        :columns="columns"
        :grid="tab === 'grid'"
        :visible-columns="visible"
        :selection="allowEdits ? 'multiple' : 'none'"
        :fullscreen="fullscreen"
        :flat="qDark"
        @fullscreen="onToggleFullscreen"
        @keydown.esc="fullscreen = false"
        ref="table"
        square>
        <template #top>
            <MediaListHeader :table-title="tableTitle"
                             :show-grid-view="tab === 'grid'"
                             :selected="selected"
                             :allow-edits="allowEdits"
                             @add="onClickAddBtn"
                             @delete="onClickDeleteBtn"
                             @search="(newSearch) => search = newSearch"
                             @fullscreen="fullscreen = !fullscreen">
                <q-checkbox v-if="allowEdits && tab === 'grid'" class="q-ml-xs" color="grey-8" v-model="computedSelectAll" :disable="mediaCollection.length < 1" />
            </MediaListHeader>
        </template>
        <template #header-selection>
            <q-checkbox v-if="allowEdits" color="grey-8" v-model="computedSelectAll" />
        </template>
        <template #body="props">
            <MediaRow :class="'row-' + props.row.media.uuid"
                      :row="props.row"
                      :key="props.row.media.uuid"
                      :allow-edits="allowEdits"
                      :expanded="Boolean(expanded[props.row.media.uuid])"
                      @update="emit('update-media', props.row)"
                      @open-edit="openEditDialog(props.row)"
                      @expand="expanded[props.row.media.uuid] = !Boolean(expanded[props.row.media.uuid])">
                <q-checkbox v-if="allowEdits" :val="props.row" v-model="selected" color="grey-8" />
            </MediaRow>
        </template>
        <template #item="props">
            <MediaCard
                :selected="selected"
                :media="props.row"
                :highlighted="props.row === moveMediaItem"
                :val="props.row"
                :key="props.row.media.title + props.row.type"
                :allow-edits="allowEdits"
                @update="emit('update-media', props.row)"
                @open-edit="openEditDialog(props.row)"
                @pan="onCardPan"
                @move="onCardMove">
            </MediaCard>
        </template>
    </q-table>
</template>