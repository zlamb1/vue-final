<script setup>
import FilterList from "~/components/list/FilterList.vue";
import {MediaType} from "~/models/Media";
import {Filter} from "~/models/Filter";
import AddMediaButton from "~/components/button/AddMediaButton.vue";

const dropdownBtn = ref(null);
const filters = ref([]);

defineProps({
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

const emit = defineEmits(['click-add', 'click-delete', 'toggle-fullscreen']);

function onAddFilter(filterString) {
    filters.value.push(new Filter(filterString));
}

function onRemoveFilter(filter) {
    filters.value.splice(filters.value.indexOf(filter), 1);
}

function onClickItem(item) {
    emit('click-add', item);
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
            <add-media-button v-if="allowEdits" @click="onClickItem" />
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
        <FilterList
            :filters="filters"
            @add-filter="onAddFilter"
            @remove-filter="onRemoveFilter"
            @remove-filters="filters = []"
            ref="filterList" />
    </div>
</template>