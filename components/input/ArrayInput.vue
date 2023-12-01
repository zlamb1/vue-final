<script setup lang="ts">
const props = defineProps({
    modelValue: {
        type: Array,
        required: true,
    },
    color: {
        type: String,
        default: 'primary',
    },
    label: {
        type: String,
        default: 'Item',
    },
    allowZeroInputs: {
        type: Boolean,
        default: false,
    },
    maxHeight: {
        type: String,
        default: undefined,
    },
});

const container = ref(null);

const error = ref('');
const verticalOverflow = ref(false);

const emit = defineEmits(['update:modelValue', 'empty']);

function onUpdate() {
    nextTick().then(() => {
        checkOverflow();
    })
    emit('update:modelValue', props.modelValue);
}

function onAdd() {
    props.modelValue?.push('');
    onUpdate();
    resetError();
}

function onRemove(index) {
    const length = Object.keys(props.modelValue).length;
    if (length < 2 && !props.allowZeroInputs) {
        error.value = 'You must have at least one!';
        return;
    }
    props.modelValue?.splice(index, 1);
    onUpdate();
    checkEmpty();
}

function checkEmpty() {
    if (props.modelValue && Object.keys(props.modelValue).length === 0) {
        emit('empty');
    }
}

function resetError() {
    error.value = '';
}

function checkOverflow() {
    const $el = container.value;
    verticalOverflow.value = $el?.clientHeight < $el?.scrollHeight;
}

onMounted(() => {
    checkEmpty();
})
</script>

<template>
<div class="container column q-gutter-y-md no-wrap" :style="{maxHeight: maxHeight}" style="overflow-y: auto" ref="container">
    <div class="text-red-8" v-show="error">
        {{error}}
    </div>
    <div v-for="(_, index) in modelValue" class="row items-center q-gutter-x-md no-wrap">
        <q-input :color="color"
                 :label="`${label} ${index + 1}`"
                 :error="Boolean(error)"
                 hide-bottom-space
                 v-model="modelValue[index]"
                 @update:model-value="onUpdate"
                 filled stack-label />
        <div class="q-ml-auto">
            <q-btn :class="verticalOverflow ? 'q-mx-md' : null" style="aspect-ratio: 1;" color="red" icon="remove" @click="onRemove(index)" outline />
        </div>
    </div>
    <q-btn icon="add" color="green" @click="onAdd">
        <span class="on-right">Add {{label}}</span>
    </q-btn>
</div>
</template>

<style scoped>
.container {
    max-height: 40vh;
}
</style>