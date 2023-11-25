<script setup>
import Book from "~/models/Book";

const {qDark} = useDarkTheme();

const props = defineProps({
    media: {
        type: Book,
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
        :rules="[value => !!value || 'What is the book\'s title?']"
        v-model="mediaClone.title"
        ref="firstInput"
        stack-label>
    </q-input>
    <q-input
        class="q-py-none"
        label="Author"
        :color="computedInputColor"
        :rules="[value => !!value || 'Who wrote the book?']"
        v-model="mediaClone.author"
        stack-label>
    </q-input>
    <q-input
        class="q-py-none"
        type="number"
        label="Pages Read"
        :color="computedInputColor"
        :rules="[value => !!value.toString() || 'How many pages have you read?']"
        v-model.number="mediaClone.pagesRead"
        stack-label>
    </q-input>
    <q-input
        class="q-py-none"
        type="number"
        label="Number of Pages"
        :color="computedInputColor"
        :rules="[value => !!value.toString() || 'What is the page count of the book?']"
        v-model.number="mediaClone.numberOfPages"
        stack-label>
    </q-input>
    <q-input
        class="q-py-none"
        type="number"
        label="Rating"
        suffix="/5"
        :color="computedInputColor"
        :rules="[value => !!value.toString() || 'What do you rate the book?']"
        v-model.number="mediaClone.rating"
        stack-label>
    </q-input>
    <q-select
        class="q-py-none"
        label="Cover Type"
        :color="computedInputColor"
        :options="Book.CoverType.asArray()"
        v-model="mediaClone.coverType"
        stack-label>
    </q-select>
    <q-input
        class="q-py-none"
        label="Cover URL (optional)"
        :color="computedInputColor"
        v-model="mediaClone.imageUrl"
        stack-label>
    </q-input>
</template>