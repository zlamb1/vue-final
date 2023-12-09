<script setup>
import MediaToolbar from "~/components/toolbar/MediaToolbar.vue";
import {Media} from "~/models/Media";
import MediaFactory from "~/models/factory/MediaFactory";

const {qDark} = useDarkTheme();

let initialX = ref(0);
let initialY = ref(0);

let container = ref(null);
let wrapper = ref(null);

const props = defineProps({
    selected: {
        type: Array,
        required: true,
    },
    media: {
        type: Media,
        required: true,
    },
    highlighted: {
        type: Boolean,
        default: false,
    },
    val: {
        type: Object,
    },
    allowEdits: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update', 'open-edit', 'move', 'pan']);

const computedSelected = computed(() => {
    return props.selected.includes(props.val);
});

const computedClasses = computed(() => {
    return [
        {'q-table__grid-item--selected' : props.selected.includes(props.val)},
        props.allowEdits ? 'cursor-pointer' : 'cursor-not-allowed',
    ]
});

const computedBorder = computed(() => {
    return qDark.value ? 'border: 1px solid rgba(255, 255, 255, 0.28)' : null;
})

function onClick() {
    if (props.allowEdits) {
        if (props.selected.includes(props.val)) {
            props.selected.splice(props.selected.indexOf(props.val), 1);
        } else {
            props.selected.push(props.val);
        }
    }
}

function getContainer() {
    return container.value;
}

function getMediaItem() {
    return props.media;
}

function onPan(event) {
    const cardBoundingRect = container.value.getBoundingClientRect();
    const cardWidth = cardBoundingRect.right - cardBoundingRect.left;
    const cardHeight = cardBoundingRect.bottom - cardBoundingRect.top;

    if (event.isFirst) {
        initialX.value = cardBoundingRect.left;
        initialY.value = cardBoundingRect.top;
        container.value.style.setProperty('z-index', '9999');
    }

    const parentBoundingRect = wrapper.value.parentElement.getBoundingClientRect();

    const translateX = Math.min(Math.max(
            event.position.left - initialX.value - (cardWidth / 2),
            -(initialX.value - parentBoundingRect.left)),
        parentBoundingRect.right - initialX.value - cardWidth * 0.75)

    const translateY = Math.min(Math.max(
            event.position.top - initialY.value - (cardHeight / 2),
            -(initialY.value - parentBoundingRect.top)),
        parentBoundingRect.bottom - initialY.value - cardHeight * 0.75);

    container.value.classList.toggle('notransition', true);
    container.value.style.setProperty('transform', `translate(${translateX}px, ${translateY}px`);
    // trigger reflow
    container.value.offsetHeight;
    // enable transitions
    container.value.classList.toggle('notransition', false);

    if (event.isFinal) {
        emit('move', container.value.getBoundingClientRect(), props.media);
        initialX.value = 0;
        initialY.value = 0;

        container.value.animate({
                zIndex: [ '9999', '9999' ],
                transform: [ `translate(${translateX}px, ${translateY}px)`, 'translate(0px)' ],
            },
            {
                duration: 300,
                easing: 'ease-in-out',
            });

        container.value.style.setProperty('transform', null);
        container.value.style.setProperty('z-index', null);
    } else {
        emit('pan', container.value.getBoundingClientRect(), props.media);
    }
}

defineExpose({getContainer, getMediaItem});

onMounted(() => {
    // getCurrentInstance is deprecated and an internal api call
    // could be subject to removal or change at a later date
    wrapper.value.__vue__ = getCurrentInstance().exposed;
});
</script>

<template>
    <div
        class="media-card q-pa-sm q-table__grid-item"
        @click="onClick"
        ref="wrapper">
        <div
            class="relative-position full-height"
            :class="computedClasses"
            style="transition: transform 0.5s ease-in-out; will-change: transform;"
            ref="container">
            <div
                class="absolute-left fit"
                style="background: rgba(0,196,255,0.4); z-index: 199; pointer-events: none;"
                v-show="highlighted">
            </div>
            <q-card
                class="column full-height"
                :style="computedBorder"
                :flat="qDark">
                <q-card-section class="full-width q-px-xs q-pt-xs q-pb-none">
                    <q-img
                        class="rounded-borders"
                        fit="cover"
                        :src="media.media.imageUrl"
                        placeholder-src="~/assets/placeholder_cover.png"
                        :ratio="9/10"
                        eager no-transition>
                    </q-img>
                </q-card-section>
                <q-card-section class="column justify-center items-center">
                    <span class="text-bold">{{media.media.title}}</span>
                    <div>
                        <MediaToolbar v-if="allowEdits"
                                      :show-expand="false"
                                      :media="media.media"
                                      @pointerdown.stop
                                      @mousedown.stop
                                      @edit="$emit('open-edit')"
                                      @favorite="$emit('update')">
                            <template #prepend>
                                <q-btn class="on-left"
                                       icon="pan_tool"
                                       size="sm"
                                       :color="qDark ? 'white' : 'primary'"
                                       v-touch-pan.mouse.prevent="onPan"
                                       flat round>
                                </q-btn>
                            </template>
                        </MediaToolbar>
                    </div>
                </q-card-section>
                <q-separator inset></q-separator>
                <component :is="MediaFactory.CreateView(media.type)"
                           :media="media.media"
                           :disable="!allowEdits"
                           @update="emit('update', media)" />
            </q-card>
        </div>
    </div>
</template>

<style scoped>
    .media-card {
        width: 20%;
    }

    @media (max-width: 1200px) {
        .media-card {
            width: calc(100% / 3);
        }
    }

    @media (max-width: 768px) {
        .media-card {
            width: 50%;
        }
    }

    @media (max-width: 500px) {
        .media-card {
            width: 100%;
        }
    }
</style>