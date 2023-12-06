<script setup>
import BookKnob from "~/components/knob/BookKnob.vue";
import BookView from "~/components/view/BookView.vue";
import Book from '~/models/Book'

defineProps({
    media: {
        type: Book,
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
               placeholder-src="./src/assets/placeholder_cover.png"
               :src="media.imageUrl"
               :ratio="3/4" />
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
                    :disable="disable"
                    @update:model-value="emit('update')"
                    no-reset />
            </div>
            <div v-if="media.pagesRead && media.pageCount">
                <BookKnob :book="media" :disable="disable" @update:model-value="emit('update')" />
            </div>
        </div>
        <BookView :media="media" :disable="disable" @update="emit('update')" />
    </div>
</template>

<style scoped>
    .q-img {
        width: 250px;
    }
</style>