<script setup>
import SongView from "~/components/view/SongView.vue";
import Song from '~/models/Song'

defineProps({
    media: {
        type: Song,
        required: true,
    },
    disable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update']);
</script>

<template>
    <div class="row justify-center items-center q-gutter-x-md">
        <q-img v-if="media.imageUrl"
               class="rounded-borders q-ma-md"
               placeholder-src="~/assets/placeholder_cover.png"
               :src="media.imageUrl"
               :ratio="3/4" />
        <SongView :media="media" :disable="disable" @update="emit('update')" />
    </div>
</template>

<style scoped>
.q-img {
    width: 250px;
}
</style>