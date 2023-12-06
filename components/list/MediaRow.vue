<script setup>
import DynamicPopupEdit from "~/components/popup-edit/DynamicPopupEdit.vue";
import MediaToolbar from "~/components/toolbar/MediaToolbar.vue";
import MediaFactory from "~/models/factory/MediaFactory";
import {Media} from "~/models/Media";

const {qDark} = useDarkTheme();

const props = defineProps({
    row: {
        type: Media,
        required: true,
    },
    allowEdits: {
        type: Boolean,
        default: true,
    }
});

const emit = defineEmits(['update:modelValue', 'update', 'open-edit']);
</script>

<template>
    <q-tr v-bind="$attrs">
        <q-td v-if="allowEdits">
            <slot></slot>
        </q-td>
        <q-td>
            <div class="row items-center">
                <div class="cursor-pointer" style="flex: 1 1 0;">
                    <span class="non-selectable">{{ row.media.title }}</span>
                    <DynamicPopupEdit v-model="row.media.title" :disable="!allowEdits" @save="emit('update')" />
                </div>
                <div class="q-ml-auto">
                    <MediaToolbar
                        :expand="row.expand"
                        :media="row.media"
                        :allow-edits="allowEdits"
                        @edit="emit('open-edit')"
                        @expand="row.expand = !row.expand">
                    </MediaToolbar>
                </div>
            </div>
        </q-td>
        <q-td>
            {{ row.type }}
            <q-icon :name="MediaFactory.CreateIcon(row.type)"
                    class="float-right"
                    :color="qDark ? 'white' : 'accent'"
                    size="sm"/>
        </q-td>
    </q-tr>
    <q-tr style="height: 0;">
        <q-td class="expand-td" colspan="100%">
            <q-slide-transition :duration="500">
                <div v-show="row.expand"
                     style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);">
                    <component :is="MediaFactory.CreateInfo(row.type)"
                               :media="row.media"
                               :disable="!allowEdits"
                               @update="emit('update', row)" />
                </div>
            </q-slide-transition>
        </q-td>
    </q-tr>
</template>

<style scoped>
.expand-td {
    height: 0;
    padding: 0;
    border: none;
}
</style>