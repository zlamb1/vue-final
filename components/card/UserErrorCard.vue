<script setup>
const props = defineProps({
    height: {
        type: Number,
        default: NaN,
    },
    color: {
        type: String,
        default: 'red',
    },
    textColor: {
        type: String,
        default: 'white',
    },
    message: {
        type: String,
        default: 'You must be logged in to view this content! ',
    }
});
</script>

<template>
    <q-card :style="isNaN(height) ? null : `height: ${height}px`" :class="'bg-' + color">
        <q-card-section class="text-bold non-selectable full-height" :class="'text-' + textColor">
            <div class="row justify-center items-center full-height">
                {{message}}
            </div>
        </q-card-section>
    </q-card>
</template>