<script setup>
import MediaCollection from "~/models/MediaCollection";
import MediaFactory from "~/models/factory/MediaFactory";

const $q = useQuasar();

const props = defineProps({
    mediaCollection: {
        type: Array,
        default: reactive(MediaCollection([])),
    }
});

const selected = ref(props.mediaCollection?.length > 0 ? props.mediaCollection[0] : null);

function trimTitle(title) {
    const trimAmounts = {
        ['xs']: 10,
        ['sm']: 15,
        ['md']: 20,
        ['lg']: 50,
        ['xl']: 100,
    }
    let str = title.substring(0, trimAmounts[$q.screen.name]);
    if (title.length > trimAmounts[$q.screen.name]) {
        str += '...';
    }
    return str;
}
</script>

<template>
    <q-card class="row container no-wrap">
        <div class="col-4 col-md-3 col-lg-2 left">
            <q-list class="" style="height: 500px" separator>
                <q-item v-for="mediaItem in mediaCollection"
                        active-class="bg-primary text-white"
                        :active="mediaItem === selected"
                        @click="selected = mediaItem" clickable v-ripple>
                    <q-item-label class="row items-center">
                        <span>{{trimTitle(mediaItem?.media?.title)}}</span>
                    </q-item-label>
                </q-item>
            </q-list>
        </div>
        <div v-if="selected" class="col-8 col-md-9 col-lg-10 row justify-center items-center">
            <transition name="fade" mode="out-in" appear>
                <component :is="MediaFactory.CreateInfo(selected.type)"
                           :media="selected.media" />
            </transition>
        </div>
    </q-card>
</template>

<style scoped>
.container {
    min-height: 500px;
}
.left {
    border-right: 1px solid rgba(0, 0, 0, 0.28);
    overflow-y: auto;
}
</style>