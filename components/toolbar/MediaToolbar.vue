<script setup>
const {qDark} = useDarkTheme();

const favoriteIcon = ref('favorite');
const totalHeartEmits = ref(10);
const heartEmits = ref(0);
const activeTimeouts = ref([]);

const favoriteContainer = ref(null);

const props = defineProps({
    showExpand: {
        type: Boolean,
        default: true,
    },
    expand: {
        type: Boolean,
        default: false,
    },
    media: {
        type: Object,
        required: true,
    },
});

const computedExpandColor = computed(() => {
    return qDark.value ? 'white' : 'primary';
});

const computedFavorite = computed(() => {
    return props.media.favorite;
});

const computedHeartColor = computed(() => {
    return computedFavorite.value ? 'red' : 'grey-6';
});

const emit = defineEmits(['expand', 'edit', 'favorite']);

function onEdit() {
    emit('edit');
}

function onFavorite() {
    props.media.favorite = !props.media.favorite;
    emit('favorite');
}

function onHeartAnimationEnd(event) {
    event.target.style = 'display: none;';
}

watch(computedFavorite, async (_new) => {
    for (const timeout of activeTimeouts.value) {
        clearTimeout(timeout);
    }

    activeTimeouts.value = [];

    if (heartEmits.value > 0) {
        heartEmits.value = 0;
    }

    if (_new) {
        for (let i = 0; i < totalHeartEmits.value; i++) {
            activeTimeouts.value.push(setTimeout(() => {
                if (!computedFavorite.value) {
                    return;
                }

                heartEmits.value++;
                setTimeout(() => {
                    const heart = favoriteContainer.value.querySelectorAll('.heart-emit')[i];
                    const theta = -50 + (Math.random() * 150 - 75);
                    heart.style.setProperty('--translation', theta + '%');
                    heart.style.setProperty('animation-name', 'swing');
                }, 10);
            }, i * 200));
        }
    } else {
        favoriteIcon.value = 'heart_broken'
        setTimeout(() => {
            favoriteIcon.value = 'favorite';
        }, 1000);
    }
});
</script>

<template>
    <q-toolbar class="q-px-none" style="overflow: visible;">
        <slot name="prepend"></slot>
        <q-btn
            class="on-left"
            size="sm"
            :color="computedExpandColor"
            :icon="expand ? 'remove' : 'add'"
            @click.stop="$emit('expand')"
            v-if="showExpand"
            round flat />
        <q-btn
            class="on-left"
            color="blue"
            size="sm"
            icon="edit"
            @click.stop="onEdit"
            round flat />
        <div class="relative-position" style="overflow: visible;" ref="favoriteContainer">
            <q-btn
                :color="computedHeartColor"
                size="sm"
                class="favorite-checkbox"
                :class="$slots.append ? 'on-left' : null"
                :icon="favoriteIcon"
                @click.stop="onFavorite"
                round flat />
            <q-icon
                class="heart-emit absolute-center"
                name="favorite"
                v-for="i in heartEmits"
                :key="i"
                @click.stop
                @animationend="onHeartAnimationEnd">
            </q-icon>
        </div>
        <slot name="append"></slot>
    </q-toolbar>
</template>

<style scoped>
.heart-emit {
    color: #e82020;

    --translation: -50%;
    animation-timing-function: linear;
    animation-duration: 0.5s;
}
</style>