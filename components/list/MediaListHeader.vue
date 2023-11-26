<script setup>
import FilterList from "~/components/list/FilterList.vue";
import {MediaType} from "~/models/Media";
import {Filter} from "~/models/Filter";

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
    dropdownBtn.value?.hide();
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
            <q-btn-dropdown
                class="state-btn text-caption text-bold"
                label="Add Item"
                :color="useDarkTheme ? 'green-8' : 'green-6'"
                ref="dropdownBtn"
                stretch>
                <q-list>
                    <q-item class="text-white text-caption"
                            :class="useDarkTheme ? 'bg-green-8' : 'bg-green-6'"
                            clickable v-close-popup>
                        <q-item-section>
                            <q-item-label>Import</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="text-white text-caption"
                            :class="useDarkTheme ? 'bg-green-8' : 'bg-green-6'"
                            v-for="item in MediaType" :key="item"
                            @click="onClickItem(item)"
                            clickable >
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
                @click="emit('click-delete')"
                stretch />
            <q-btn
                icon="fullscreen"
                v-show="!showGridView"
                @click="emit('toggle-fullscreen')" />
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