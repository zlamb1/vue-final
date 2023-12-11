<script setup>
import AddMediaButton from "~/components/button/AddMediaButton.vue";

const props = defineProps({
    tableTitle: {
        type: String,
        default: '',
    },
    showGridView: {
        type: Boolean,
        default: false,
    },
    selected: {
        type: Array,
    },
    allowEdits: {
        type: Boolean,
        default: true,
    },
});

const search = ref('');

const emit = defineEmits(['add', 'delete', 'search', 'fullscreen']);

function onSearch() {
    emit('search', search.value);
}
</script>

<template>
    <div class="column full-width q-gutter-y-sm" :class="{'q-pb-sm' : showGridView}">
        <div class="row items-center q-gutter-x-md">
            <div class="q-table__title text-h5 non-selectable text-bold">
                {{tableTitle}}
            </div>
            <slot></slot>
            <q-space />
            <add-media-button v-if="allowEdits" @click="emit('add', item);" />
            <q-btn v-if="allowEdits"
                   class="state-btn text-caption text-bold"
                   color="red"
                   :label="selected.length > 1 ? 'Delete Items' : 'Delete Item'"
                   v-show="selected.length > 0"
                   @click="emit('click-delete')"
                   stretch />
            <q-btn
                icon="fullscreen"
                v-show="!showGridView"
                @click="emit('toggle-fullscreen')" />
        </div>
        <div>
            <q-input v-model="search"
                     class="fit-content"
                     label="Search by Title"
                     type="search"
                     @update:model-value="onSearch"
                     filled dense>
                <template #append>
                    <q-btn icon="search" @click="onSearch" flat />
                </template>
            </q-input>
        </div>
    </div>
</template>