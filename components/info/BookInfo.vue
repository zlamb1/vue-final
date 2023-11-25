<script setup>
import BookKnob from "~/components/knob/BookKnob.vue";
import BookView from "~/components/view/BookView.vue";
import Book from '~/models/Book'

defineProps({
    media: {
        type: Book,
        required: true,
    }
});
</script>

<template>
    <div class="row justify-center items-center q-gutter-x-md">
        <q-img v-if="media.imageUrl"
               class="rounded-borders q-ma-md"
               placeholder-src="./src/assets/placeholder_cover.png"
               :src="media.imageUrl"
               :ratio="3/4" />
        <q-separator inset vertical></q-separator>
        <div class="column items-center q-gutter-y-md">
            <div v-if="media.rating" class="column items-center">
                <span>Rating:</span>
                <q-rating
                    v-model="media.rating"
                    max="5"
                    size="2.5em"
                    color="yellow"
                    icon="o_star"
                    icon-selected="star"
                    icon-half="star_half"
                    no-reset>
                </q-rating>
            </div>
            <div v-if="media.pagesRead && media.numberOfPages">
                <BookKnob :book="media"></BookKnob>
            </div>
        </div>
        <q-separator inset vertical></q-separator>
        <BookView :media="media"></BookView>
    </div>
</template>

<style scoped>
    .q-img {
        width: 250px;
    }
</style>