<script setup>
import MediaFactory from "~/models/factory/MediaFactory";

const active = ref(true);

const props = defineProps({
    selected: {
        type: Array,
        required: true,
    },
    height: {
        type: String,
        default: '300px',
    },
});

const emit = defineEmits(['empty']);

function onRemoveItem(mediaItem) {
    setTimeout(() => {
        props.selected.splice(props.selected.indexOf(mediaItem), 1);
        if (props.selected.length < 1) {
            emit('empty');
        }
    }, 200);
}
</script>

<template>
    <q-list class="q-my-md" bordered>
        <q-scroll-area :style="'height: ' + height">
            <q-item v-for="mediaItem in selected"
                    :key="mediaItem.type + mediaItem.media.title"
                    :active="active"
                    active-class="text-red"
                    @click="onRemoveItem(mediaItem)"
                    v-ripple.early clickable>
                <q-item-section avatar>
                    <q-avatar text-color="primary"
                              :icon="MediaFactory.CreateIcon(mediaItem.type)"
                              rounded />
                </q-item-section>
                <div class="row full-width items-center">
                    <span class="non-selectable text-primary">{{mediaItem.media.title}}</span>
                </div>
            </q-item>
        </q-scroll-area>
    </q-list>
</template>

<style scoped>

</style>