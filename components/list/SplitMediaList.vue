<script setup>
import MediaCollection from "~/models/MediaCollection";
import MediaFactory from "~/models/factory/MediaFactory";

const props = defineProps({
    mediaCollection: {
        type: Array,
        default: reactive(MediaCollection([])),
    }
});

const selected = ref(props.mediaCollection?.length > 0 ? props.mediaCollection[0] : null);
</script>

<template>
    <q-card class="row container">
        <div class="col-2 left full-height">
            <q-list class="full-height" separator>
                <q-item v-for="mediaItem in mediaCollection"
                        active-class="bg-primary text-white"
                        :active="mediaItem === selected"
                        @click="selected = mediaItem" clickable v-ripple>
                    <q-item-label class="row items-center">{{mediaItem?.media?.title}}</q-item-label>
                </q-item>
            </q-list>
        </div>
        <div v-if="selected" class="col-10 row justify-center items-center">
            <transition name="fade" mode="out-in" appear>
                <component :is="MediaFactory.CreateInfo(selected.type)"
                           :media="selected.media" />
            </transition>
        </div>
    </q-card>
</template>

<style scoped>
.container {
    height: 500px;
}
.left {
    border-right: 1px solid rgba(0, 0, 0, 0.28);
    overflow-y: auto;
}
</style>