<script setup>
import MovieView from "~/components/view/MovieView.vue";
import Movie from '~/models/Movie'

defineProps({
    media: {
        type: Movie,
        required: true,
    },
    disable: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="row justify-center items-center q-gutter-x-md">
        <q-img v-if="media.imageUrl"
               class="rounded-borders q-ma-md"
               placeholder-src="~/assets/placeholder_cover.png"
               :src="media.imageUrl"
               :ratio="3/4" />
        <q-separator inset vertical />
        <MovieView :media="media" :disable="disable" />
    </div>
</template>

<style scoped>
.q-img {
    width: 250px;
}
</style>