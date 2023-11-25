<script setup>
import useDarkTheme from "~/composables/useDarkTheme";
import Movie from "~/models/Movie";

const {qDark} = useDarkTheme();

const props = defineProps({
    media: {
        type: Movie,
        required: true,
    },
    inputColor: {
        type: String,
        default: 'primary',
    },
    overrideDark: {
        type: Boolean,
        default: false,
    },
});

const mediaClone = ref(props.media.clone());
const firstInput = ref(null);

const computedInputColor = computed(() => {
    return qDark.value && props.overrideDark ? 'white' : props.inputColor;
});

defineEmits(['submit']);

function focusFirstInput() {
    firstInput.value.focus();
}

function getMediaClone() {
    return mediaClone.value;
}

watch(props.media, async (_new) => {
    mediaClone.value = _new.clone();
});

defineExpose({focusFirstInput, getMediaClone});
</script>

<template>
    <q-input
        class="q-py-none"
        label="Title"
        :color="computedInputColor"
        :rules="[value => !!value || 'What is the movie\'s title?']"
        v-model="mediaClone.title"
        ref="firstInput"
        stack-label>
    </q-input>
    <q-input
        class="q-py-none"
        label="Director"
        :color="computedInputColor"
        :rules="[value => !!value || 'Who directed the movie?']"
        v-model="mediaClone.director"
        stack-label>
    </q-input>
    <q-date
        class="q-my-lg"
        title="Release Date"
        v-model="mediaClone.releaseDate">
    </q-date>
    <q-input
        class="q-py-none"
        label="Runtime"
        :color="computedInputColor"
        :rules="[value => !!value || 'What was the movie\'s runtime?']"
        v-model="mediaClone.runTime"
        stack-label>
    </q-input>
</template>