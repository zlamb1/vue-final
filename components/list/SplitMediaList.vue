<script setup>
import EditDialog from "~/components/dialog/EditDialog.vue";
import MediaToolbar from "~/components/toolbar/MediaToolbar.vue";
import MediaForm from "~/components/form/MediaForm.vue";
import MediaCollection from "~/models/MediaCollection";
import MediaFactory from "~/models/factory/MediaFactory";
import BookAPIDialog from "~/components/dialog/APIDialog.vue";
import {Media, MediaType} from "~/models/Media";
import AddMediaButton from "~/components/button/AddMediaButton.vue";
import Book from "~/models/Book";
import ConfirmationDialog from "~/components/dialog/ConfirmationDialog.vue";
import APIDialog from "~/components/dialog/APIDialog.vue";

const $q = useQuasar();

const props = defineProps({
    mediaCollection: {
        type: Array,
        default: reactive(MediaCollection([])),
    },
    allowEdits: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['add-media', 'update-media', 'remove-media']);

const morphGroupModel = ref('menu');

const editDialog = ref(null);
const editForm = ref(null);
const addDialog = ref(null);
const addForm = ref(null);
const confirmDialog = ref(null);
const apiDialog = ref(null);
const listScrollArea = ref(null);

const addItem = ref(MediaFactory.CreateInstance());
const search = ref('');
const selectedIndex = ref(0);

const selected = computed(() => {
    if (props.mediaCollection?.length > selectedIndex.value) {
        return props.mediaCollection[selectedIndex.value];
    }
});

const computedList = computed(() => {
   return props.mediaCollection.filter((mediaItem) => mediaItem?.media?.title?.includes(search.value));
});

const computedScrollUp = computed(() => {
    return listScrollArea.value?.getScrollPercentage().top >= 0.95;
});

const computedShowContent = computed(() => {
    return !(morphGroupModel.value === 'menu' && $q.screen.lt.md);
});

const showScrollBtn = computed(() => {
    const scroll = listScrollArea.value?.getScroll();
    return scroll?.verticalSize !== scroll?.verticalContainerSize;
});

const nextMorphStep = {
    menu: 'btn',
    btn: 'menu',
}

function onOpenEdit() {
    editDialog.value?.open();
}

function onSubmitEdit() {
    editForm.value?.submitForm();
}

function onSubmitAdd() {
    addForm.value?.submitForm();
}

function onClickAddMedia(type) {
    if (type === 'import') {
        apiDialog.value?.show();
    } else {
        addItem.value = MediaFactory.CreateInstance(type);
        addDialog.value?.open();
    }
}

function onClickScrollBtn() {
    const percentage = computedScrollUp.value ? 0 : 1;
    listScrollArea.value?.setScrollPercentage('vertical', percentage, 250);
}

function nextMorph() {
    morphGroupModel.value = nextMorphStep[morphGroupModel.value]
}

function trimTitle(title) {
    const trimAmounts = {
        ['xs']: 20,
        ['sm']: 30,
        ['md']: 30,
        ['lg']: 75,
        ['xl']: 100,
    }
    let str = title.substring(0, trimAmounts[$q.screen.name]);
    if (title.length > trimAmounts[$q.screen.name]) {
        str += '...';
    }
    return str;
}

onBeforeRouteUpdate(() => {
    selectedIndex.value = 0;
});
</script>

<template>
    <q-card class="row no-wrap container">
        <edit-dialog @dialog-submit="onSubmitEdit" ref="editDialog">
            <media-form :media-item="selected" @onsubmit="(mediaItem) => emit('update-media', mediaItem)" ref="editForm" />
        </edit-dialog>
        <edit-dialog @dialog-submit="onSubmitAdd" ref="addDialog">
            <media-form :media-item="addItem" @onsubmit="(mediaItem) => emit('add-media', mediaItem)" ref="addForm" />
        </edit-dialog>
        <confirmation-dialog confirmation-prompt="Confirm you would like to delete this media." @confirm="emit('remove-media', selected)" ref="confirmDialog">
            <q-list class="q-my-md" bordered>
                <q-item class="row items-center" v-close-popup v-ripple clickable>
                    <q-item-label>{{selected?.media?.title}}</q-item-label>
                </q-item>
            </q-list>
        </confirmation-dialog>
        <APIDialog :existing-items="mediaCollection"
                   @import="(item) => emit('add-media', item)"
                   @remove="(item) => emit('remove-media', item)"
                   ref="apiDialog" />
        <div v-morph:menu:group:200.tween.resize="morphGroupModel"
             class="col-12 col-md-3 col-lg-2 left">
            <q-scroll-area style="height: 100%;" ref="listScrollArea">
                <q-list class="relative-position" separator>
                    <q-item class="row">
                        <q-input type="search" v-model="search" label="Search by Title" dense outlined>
                            <template #append>
                                <q-btn v-show="Boolean(search)" icon="close" size="md" @click="search = ''" flat round />
                                <q-btn icon="search" flat round />
                            </template>
                        </q-input>
                        <q-btn class="on-right fit-content q-ml-auto" icon="menu" @click="nextMorph" flat round />
                    </q-item>
                    <transition-group name="list" appear>
                        <q-item v-for="(mediaItem, index) in computedList"
                                active-class="bg-primary text-white"
                                :active="index === selectedIndex"
                                :key="mediaItem?.media?.uuid"
                                @click="selectedIndex = index" clickable v-ripple>
                            <q-item-label class="row items-center">
                                <span class="non-selectable">{{trimTitle(mediaItem?.media?.title)}}</span>
                            </q-item-label>
                        </q-item>
                    </transition-group>
                    <q-item v-if="allowEdits">
                        <add-media-button class="full-width" @click="onClickAddMedia" />
                    </q-item>
                    <div style="position: fixed; right: 10px; bottom: 10px;">
                        <q-btn v-show="showScrollBtn"
                               color="primary"
                               size="sm"
                               :icon="computedScrollUp ? 'arrow_drop_up' : 'arrow_drop_down'"
                               @click="onClickScrollBtn"
                               round push />
                    </div>
                </q-list>
            </q-scroll-area>
        </div>
        <q-separator v-show="morphGroupModel === 'menu'" vertical />
        <div v-show="computedShowContent" class="col">
            <div class="column justify-between full-height" :key="selected?.media?.uuid">
                <div class="row q-ma-sm">
                    <div v-morph:btn:group:200.tween.resize="morphGroupModel">
                        <q-btn class="fit-content" icon="menu" @click="nextMorph" flat round />
                    </div>
                    <div v-if="selected" class="q-ml-auto">
                        <MediaToolbar v-if="allowEdits"
                                      :show-expand="false"
                                      :media="selected.media"
                                      @edit="onOpenEdit"
                                      @favorite="emit('update-media', selected)">
                            <template #prepend>
                                <q-btn class="on-left" icon="delete" color="grey-8" size="sm" @click="confirmDialog?.open()" flat round />
                            </template>
                        </MediaToolbar>
                    </div>
                </div>
                <div class="row justify-center full-width q-px-md">
                    <transition class="col-12 col-sm-10 col-md-8 col-lg-6 row justify-center" name="fade" mode="out-in" appear>
                        <div v-if="selected" :key="selected?.media?.uuid" class="row justify-center items-center">
                            <q-card class="q-pa-lg" style="background: rgba(0, 0, 0, 0.01)" flat bordered>
                                <component :is="MediaFactory.CreateInfo(selected.type)"
                                           :media="selected.media"
                                           :disable="!allowEdits"
                                           @update="emit('update-media', selected)" />
                            </q-card>
                        </div>
                        <div v-else class="row justify-center">
                            <q-card class="row justify-center items-center q-pa-md q-col-gutter-x-md full-width" style="height: 300px;" flat bordered>
                                <q-skeleton class="col-12 col-sm-6 col-lg-4" style="height: 100%;" />
                                <div class="col-0 col-lg-4 column items-center justify-between" style="height: 100%;">
                                    <q-skeleton class="q-mb-md" type="QRange" width="100%" style="max-width: 200px" />
                                    <q-skeleton type="circle" width="100%" style="flex: 1; max-width: 200px" />
                                </div>
                                <div class="col-0 col-sm column" style="height: 100%;">
                                    <q-skeleton type="text" :width="(100 - (Math.random() * 33)) + '%'" v-for="i in 12" height="22px" />
                                </div>
                            </q-card>
                        </div>
                    </transition>
                </div>
                <div class="row q-ma-sm">
                    <q-btn icon="arrow_back"
                           :disable="selectedIndex <= 0"
                           @click="selectedIndex--"
                           flat />
                    <q-btn class="q-ml-auto"
                           icon="arrow_forward"
                           :disable="selectedIndex >= props.mediaCollection?.length - 1"
                           @click="selectedIndex++"
                           flat />
                </div>
            </div>
        </div>
    </q-card>
</template>

<style scoped>
.container {
    min-height: 500px;
}
.left {
    overflow-x: hidden;
    overflow-y: auto;
}
</style>