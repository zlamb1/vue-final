<script setup>
import ArrayInput from "~/components/input/ArrayInput.vue";
import Song from "~/models/Song";

const {qDark} = useDarkTheme();

const props = defineProps({
    media: {
        type: Song,
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
        :rules="[value => !!value || 'What is the song\'s title?']"
        v-model="media.title"
        ref="firstInput"
        stack-label />
    <q-input class="q-py-none"
             label="Artists"
             :color="computedInputColor"
             :rules="[value => !!value || 'Who made the song?']"
             v-model="media.artists"
             stack-label />
    <q-input class="q-py-none"
             label="Album"
             :color="computedInputColor"
             :rules="[value => !!value || 'What album was the song on?']"
             v-model="media.album"
             stack-label />
    <q-date
        class="q-my-lg"
        title="Release Date"
        v-model="media.releaseDate">
    </q-date>
</template>