<script setup>
import useDarkTheme from "~/composables/useDarkTheme";

const {qDark} = useDarkTheme();

const padding = ref(3);
const translateX = ref('0%');
const container = ref(null);
const sliderContainer = ref(null);

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    leftIcon: {
        type: String,
        default: '',
    },
    rightIcon: {
        type: String,
        default: '',
    },
    rightIconColor: {
        type: String,
        default: 'black',
    },
    leftIconColor: {
        type: String,
        default: 'black',
    },
    color: {
        type: String,
        default: 'white',
    },
    activeColor: {
        type: String,
        default: 'primary',
    },
    size: {
        type: String,
        default: 'xs',
    },
    transitionSpeed: {
        type: Number,
        default: 0.3,
    },
    flat :{
        type: Boolean,
        default: false,
    },
});

const computedColor = computed(() => {
    return qDark.value ? 'grey-6' : props.color;
});

const computedActiveColor = computed(() => {
    return qDark.value ? 'dark' : props.activeColor;
});

const computedSliderColor = computed(() => {
    return props.modelValue ? props.rightIconColor : props.leftIconColor;
});

const computedSliderStyle = computed(() => {
    return `
        transition: transform ${props.transitionSpeed}s ease-in-out;
        transform: translateX(${translateX.value});
    `;
});

const computedBoxShadow = computed(() => {
    return props.flat ? null :
        'box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), ' +
        '0 3px 1px -2px rgba(0,0,0,.12);';
});

const emit = defineEmits(['update:modelValue']);

function updateTranslateByValue(translate, notransition) {
    if (notransition)
        sliderContainer.value.classList.toggle('notransition', true);
    translateX.value = translate;
    // trigger reflow
    sliderContainer.value.offsetHeight;
    sliderContainer.value.classList.toggle('notransition', false);
}

function updateTranslate(modelValue) {
    updateTranslateByValue((modelValue ? 100 : 0) + '%');
}

function onToggle(modelValue) {
    emit('update:modelValue', modelValue);
    updateTranslate(modelValue);
}

function onPan(event) {
    const containerRect = container.value.getBoundingClientRect();
    const containerWidth = containerRect.right - containerRect.left;
    const sliderRect = sliderContainer.value.getBoundingClientRect();
    const sliderWidth = sliderRect.right - sliderRect.left;
    const translate = Math.max(Math.min(
        event.position.left - containerRect.left - (sliderWidth / 2),
        containerWidth / 2 - padding.value), 0);

    if (event.isFinal) {
        const newModelValue = event.position.left > containerRect.right - (containerWidth / 2);
        if (newModelValue !== props.modelValue) {
            onToggle(newModelValue);
        } else {
            updateTranslate(props.modelValue);
        }
    } else {
        updateTranslateByValue(translate + 'px', true);
    }
}

onMounted(() => {
    updateTranslate(props.modelValue);
});
</script>

<template>
    <div
        :class="'bg-' + computedColor"
        class="relative-position fit-content"
        style="border-radius: 40px;"
        :style="'padding: ' + padding + 'px;' + computedBoxShadow"
        ref="container">
        <div
            class="slider-container absolute"
            style="z-index: 1;"
            :style="computedSliderStyle"
            ref="sliderContainer">
            <q-btn
                :icon="modelValue ? rightIcon : leftIcon"
                :color="computedActiveColor"
                :text-color="computedSliderColor"
                :size="size"
                @click="onToggle(!modelValue)"
                v-touch-pan.prevent.mouse="onPan"
                v-ripple.early
                unelevated>
            </q-btn>
        </div>
        <q-btn
            style="margin-right: 1px;"
            :icon="leftIcon"
            :text-color="leftIconColor"
            :size="size"
            @click="onToggle(!modelValue)"
            v-ripple.early
            unelevated>
        </q-btn>
        <q-btn
            :icon="rightIcon"
            :text-color="rightIconColor"
            :size="size"
            @click="onToggle(!modelValue)"
            v-ripple.early
            unelevated>
        </q-btn>
    </div>
</template>

<style scoped>
    .slider-container {
        will-change: transform;
        view-transition-name: slider;
    }
    .q-btn {
        border-radius: 40px;
    }
</style>