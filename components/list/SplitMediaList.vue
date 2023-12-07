<script setup>
import MediaCollection from "~/models/MediaCollection";
import MediaFactory from "~/models/factory/MediaFactory";
import MediaToolbar from "~/components/toolbar/MediaToolbar.vue";

const $q = useQuasar();

const props = defineProps({
    mediaCollection: {
        type: Array,
        default: reactive(MediaCollection([])),
    }
});

const morphGroupModel = ref('menu');

const search = ref('');
const selected = ref(props.mediaCollection?.length > 0 ? props.mediaCollection[0] : null);

const computedList = computed(() => {
   return props.mediaCollection.filter((mediaItem) => mediaItem?.media?.title?.includes(search.value));
});

const nextMorphStep = {
    menu: 'btn',
    btn: 'menu',
}

function nextMorph() {
    morphGroupModel.value = nextMorphStep[morphGroupModel.value]
}

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
    <q-card class="row no-wrap container">
        <div v-morph:menu:group:150.tween.resize="morphGroupModel"
             class="col-4 col-md-3 col-lg-2 left" ref="menu">
            <q-list style="height: 500px;" separator>
                <q-item>
                    <q-input type="search" v-model="search" label="Search by Title" dense outlined>
                        <template #append>
                            <q-btn v-show="Boolean(search)" icon="close" size="md" @click="search = ''" flat round />
                            <q-btn icon="search" flat round />
                        </template>
                    </q-input>
                    <q-btn class="on-right fit-content" icon="menu" @click="nextMorph" flat round />
                </q-item>
                <transition-group name="list" appear>
                    <q-item v-for="mediaItem in computedList"
                            active-class="bg-primary text-white"
                            :active="mediaItem === selected"
                            :key="mediaItem?.media?.uuid"
                            @click="selected = mediaItem" clickable v-ripple>
                        <q-item-label class="row items-center">
                            <span>{{trimTitle(mediaItem?.media?.title)}}</span>
                        </q-item-label>
                    </q-item>
                </transition-group>
            </q-list>
        </div>
        <div v-morph:btn:group:150.tween.resize="morphGroupModel" class="q-ma-sm">
            <q-btn class="fit-content" icon="menu" @click="nextMorph" flat round />
        </div>
        <div v-if="selected" class="col" ref="content">
            <transition name="fade" mode="out-in" appear>
                <div class="column" :key="selected.media?.uuid">
                    <div class="row q-ml-auto on-left">
                        <MediaToolbar class="q-ml-auto" :show-expand="false" :media="selected.media" />
                    </div>
                    <div class="row justify-center items-center">
                        <component :is="MediaFactory.CreateInfo(selected.type)"
                                   :media="selected.media" />
                    </div>
                </div>
            </transition>
        </div>
    </q-card>
</template>

<style scoped>
.container {
    min-height: 500px;
}
.left {
    overflow-x: hidden;
    overflow-y: auto;
}
</style>