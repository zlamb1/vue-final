<script setup>
import Movie from "~/models/Movie";
import ArrayInput from "~/components/input/ArrayInput.vue";

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

const firstInput = ref(null);

const computedInputColor = computed(() => {
    return qDark.value && props.overrideDark ? 'white' : props.inputColor;
});

defineEmits(['submit']);

function focusFirstInput() {
    firstInput.value.focus();
}

defineExpose({focusFirstInput});
</script>

<template>
    <q-input
        class="q-py-none"
        label="Title"
        :color="computedInputColor"
        :rules="[value => !!value || 'What is the movie\'s title?']"
        v-model="media.title"
        ref="firstInput"
        stack-label>
    </q-input>
    <array-input class="q-mt-xl" label="Director" :allow-zero-inputs="true" v-model="media.directors" />
    <q-date
        class="q-my-lg"
        title="Release Date"
        v-model="media.releaseDate">
    </q-date>
    <q-input
        class="q-py-none"
        label="Runtime"
        :color="computedInputColor"
        :rules="[value => !!value || 'What was the movie\'s runtime?']"
        v-model="media.runTime"
        stack-label>
    </q-input>
</template>