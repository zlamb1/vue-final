<script setup>
import useDarkTheme from "~/composables/useDarkTheme";
import {FilterOperator} from "~/models/Filter";

const {qDark} = useDarkTheme();

const themeColor = ref('blue');
const showFilterList = ref(true);
const newFilter = ref('');

const container = ref(null);
const showToggle = ref(null);
const filterButtons = ref(null);
const addButton = ref(null);
const popupEdit = ref(null);

const props = defineProps({
    filters: {
        type: Array,
        required: true,
    }
});

const computedColor = computed(() => {
    return qDark.value ? 'white' : 'primary';
});

const computedColorValue = computed(() => {
    return qDark.value ? '-8' : '-5';
});

const emit = defineEmits(['add-filter', 'remove-filter', 'remove-filters']);

async function onToggleShow() {
    const boundingClientRect = showToggle.value?.$el.getBoundingClientRect();
    const animDuration = 100;
    const show = showFilterList.value;
    const anims = [];

    if (!show) {
        showFilterList.value = true;
        await nextTick();
    }

    const getKeyframes = (b1, b2) => {
        const translate = b2.left - b1.left;
        if (show) {
            return [{transform: `translateX(-${translate}px)`}];
        } else {
            return [{transform: `translateX(-${translate}px)`}, {transform: 'translateX(0)'}];
        }
    }

    if (filterButtons.value) {
        for (const filterButton of filterButtons.value) {
            const anim = filterButton.$el.animate(
                getKeyframes(boundingClientRect, filterButton.$el.getBoundingClientRect()),
                {duration: animDuration});
            anim.pause();
            anims.push(anim);
        }
    }

    const anim = addButton.value?.$el.animate(
        getKeyframes(boundingClientRect, addButton.value?.$el.getBoundingClientRect()),
        {duration: animDuration});
    anim.pause();
    anims.push(anim)

    for (let i = 0; i < anims.length; i++) {
        anims[i].play();
        if (show && i === anims.length - 1) {
            anims[i].finished.then(() => {
                showFilterList.value = false;
            });
        }
    }
}

function onTouchHold() {
    showToggle.value.$el.classList.add('animate__animated', 'animate__headShake');
    if (filterButtons.value) {
        for (let i = 0; i < filterButtons.value.length; i++) {
            onRemoveFilter(filterButtons.value[i].$el, props.filters[i]);
        }
    }
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

function validateFilter(value) {
    if (value === '' || value === null || value === undefined) {
        return false;
    }

    if (value.charAt(0) === '{' && value.charAt(value.length - 1) !== '}') {
        return false;
    }

    if (value.charAt(0) === '{' && !value.includes(':')) {
        return false;
    }

    return fieldRule(value) && operatorRule(value);
}

function onAddFilter(filter) {
    popupEdit.value.hide();
    newFilter.value = '';
    emit('add-filter', filter);
}

function onRemoveFilter(filterElement, filterObject) {
    filterElement.classList.add('animate__fadeOutDown');
    filterElement.addEventListener('animationend', () => {
        emit('remove-filter', filterObject);
    });
}

onMounted(() => {
    showToggle.value.$el.addEventListener('animationend', () => {
        showToggle.value.$el.classList.remove('animate__animated', 'animate__headShake')
    });
});
</script>

<template>
    <div class="row items-center q-gutter-x-sm" ref="container">
        <q-btn
            :color="themeColor + computedColorValue"
            icon="filter_list"
            size="sm"
            :outline="!showFilterList"
            @click="onToggleShow"
            v-touch-hold:1000.mouse="onTouchHold"
            ref="showToggle"
            rounded>
            <q-tooltip class="text-center" :class="'bg-' + themeColor + '-8'">
                {{showFilterList ? 'Hide filter list' : 'Show filter list'}}
                <br />
                Click and hold for a second to clear filters
            </q-tooltip>
        </q-btn>
        <q-btn
            class="animate__animated animate__fadeInDown"
            style="--animate-duration: 0.1s;"
            size="sm"
            icon-right="close"
            :color="themeColor + computedColorValue"
            :label="filter.toString()"
            @click="(event) => onRemoveFilter(event.currentTarget, filter)"
            v-for="filter of filters"
            :key="filter.toString()"
            v-show="showFilterList"
            ref="filterButtons"
            rounded no-caps>
            <q-tooltip class="text-center" :class="'bg-' + themeColor + computedColorValue">
                Filters {{filter.filteredCount}} results
            </q-tooltip>
        </q-btn>
        <q-btn
            :color="themeColor + computedColorValue"
            size="sm"
            icon="add"
            v-show="showFilterList"
            ref="addButton"
            rounded>
            <q-popup-edit
                label-set="Add Filter"
                :cover="false"
                self="center end"
                :offset="[10, 0]"
                v-model="newFilter"
                v-slot="scope"
                :validate="validateFilter"
                :color="computedColor"
                @update:model-value="onAddFilter"
                ref="popupEdit"
                buttons>
                <q-expansion-item
                    icon="info"
                    :header-class="'text-' + themeColor"
                    class="q-my-sm"
                    style="width: 300px;"
                    dense-toggle>
                    <div class="row no-wrap text-weight-light non-selectable">
                        <div class="column full-width text-no-wrap">
                            <span>Format:</span>
                            <span>Operators:</span>
                            <span>Example 1:</span>
                            <span>Example 2</span>
                        </div>
                        <div class="column full-width text-no-wrap">
                            <span>{[field]:[operator][terms]} (optional)</span>
                            <span>=, &lt;, &gt;, &lt;=, &gt;=</span>
                            <span>{title:=The Housemaid}</span>
                            <span>{rating:>=3}</span>
                        </div>
                    </div>
                </q-expansion-item>
                <q-input
                    label="Filter"
                    :color="computedColor"
                    :rules="[
                      value => !!value || 'Filter cannot be empty',
                      value => !(value.charAt(0) === '{' && value.charAt(value.length - 1) !== '}') || 'Filter missing closing symbol \'}\'',
                      value => !(value.charAt(0) === '{' && !value.includes(':')) || 'Filter is missing \':\' separator',
                      fieldRule, operatorRule
                  ]"
                    v-model="scope.value"
                    @keydown.enter="$refs.popupEdit.set()"
                    autofocus dense stack-label>
                </q-input>
            </q-popup-edit>
        </q-btn>
    </div>
</template>