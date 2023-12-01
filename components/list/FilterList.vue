<script setup>
import {FilterOperator} from "~/models/Filter";
import {morph} from "quasar";

const {qDark} = useDarkTheme();

const themeColor = ref('blue');
const listExpanded = ref(false);

const menuList = ref(null);
const expandedList = ref(null);

const props = defineProps({
    filters: {
        type: Array,
        required: true,
    }
});

const computedColorValue = computed(() => {
    return qDark.value ? '-8' : '-5';
});

const emit = defineEmits(['add-filter', 'remove-filter', 'remove-filters']);

function onTouchHold() {

}

function fieldRule(value) {
    if (value.charAt(0) === '{') {
        const colonIndex = value.indexOf(':');
        const field = value.substring(1, colonIndex);
        if (field === '') {
            return "Insert filter field before ':'"
        } //else if (!this.emptyObject.hasOwnProperty(field)) {
        //return `No field exists with name: '${field}'`
        //}
    }

    return true;
}

function operatorRule(value) {
    if (value.charAt(0) === '{') {
        const colonIndex = value.indexOf(':');
        const operatorString = value.substring(colonIndex + 1, colonIndex + 3);
        const operator = FilterOperator.resolveOperator(operatorString);
        if (operator === null) {
            return `Could not resolve operator: '${operatorString.substring(0, 1)}'`
        }
    }

    return true;
}

function onAddFilter(filter) {
    emit('add-filter', filter);
}

function onRemoveFilter(filter) {
    // debounce for ripple animation
    setTimeout(() => {
        emit('remove-filter', filter)
    }, 250);
}
</script>

<template>
    <div class="row items-center q-gutter-x-sm">
        <transition name="collapse" mode="out-in">
            <q-btn v-if="!listExpanded"
                   class="q-ma-none q-pa-sm"
                   :color="themeColor + computedColorValue"
                   icon="filter_list"
                   size="md"
                   v-touch-hold:1000.mouse="onTouchHold"
                   ref="menuList"
                   flat>
                <span class="on-right">Filter Menu</span>
                <q-menu class="bg-blue-8"
                        max-height="30vh"
                        transition-show="jump-down"
                        transition-hide="jump-up">
                    <div class="row justify-center items-center q-pa-md">
                        <q-input bg-color="white"
                                 color="accent"
                                 label="Add Filter"
                                 @change="onAddFilter"
                                 filled standout stack-label dense>
                        </q-input>
                        <q-btn class="on-right q-pa-sm" icon="open_in_full" color="white" size="sm" @click="listExpanded = true" flat />
                    </div>
                    <q-separator v-show="filters.length > 0" color="white" />
                    <q-list>
                        <q-item v-for="filter of filters"
                                @click="onRemoveFilter(filter)"
                                clickable v-ripple:red>
                            <q-item-section :class="listExpanded ? 'text-black' : 'text-white'">
                                <q-item-label>{{filter.toString()}}</q-item-label>
                                <q-item-label v-if="filter.filteredCount > 0"
                                              class="filter-caption"
                                              caption>
                                    Filtered {{filter.filteredCount.toString()}} results
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-btn>
            <div v-else class="row">
                <q-btn icon="filter_list" :color="themeColor + computedColorValue" @click="listExpanded = false" flat>
                    <q-tooltip class="bg-accent">
                        Click to collapse
                    </q-tooltip>
                </q-btn>
                <q-list class="row">
                    <q-item v-for="filter of filters"
                            @click="console.log('click')"
                            clickable v-ripple:red>
                        <q-item-section :class="listExpanded ? 'text-' + themeColor + computedColorValue : 'text-white'">
                            <q-item-label>{{filter.toString()}}</q-item-label>
                            <q-item-label v-if="filter.filteredCount > 0"
                                          class="filter-caption"
                                          caption>
                                Filtered {{filter.filteredCount.toString()}} results
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.filter-caption {
    color: rgba(255, 255, 255, 0.9)
}
.disappear-text {
    transform-origin: left;
    transition: transform 0.2s ease;
}
.q-btn:hover .disappear-text {
    transform: scaleX(0);
}
</style>