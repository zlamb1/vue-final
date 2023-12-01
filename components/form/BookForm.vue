<script setup>
import Book from "~/models/Book";
import ArrayInput from "~/components/input/ArrayInput.vue";

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
        :rules="[value => !!value || 'What is the book\'s title?']"
        v-model="media.title"
        ref="firstInput"
        stack-label>
    </q-input>
    <array-input label="Author" :allow-zero-inputs="true" v-model="media.authors" max-height="200px" />
    <q-input
        class="q-py-none"
        type="number"
        label="Pages Read"
        :color="computedInputColor"
        :rules="[value => !!value.toString() || 'How many pages have you read?']"
        v-model.number="media.pagesRead"
        stack-label>
    </q-input>
    <q-input
        class="q-py-none"
        type="number"
        label="Number of Pages"
        :color="computedInputColor"
        :rules="[value => !!value.toString() || 'What is the page count of the book?']"
        v-model.number="media.numberOfPages"
        stack-label>
    </q-input>
    <q-input
        class="q-py-none"
        type="number"
        label="Rating"
        suffix="/5"
        :color="computedInputColor"
        :rules="[value => !!value.toString() || 'What do you rate the book?']"
        v-model.number="media.rating"
        stack-label>
    </q-input>
    <q-select
        class="q-py-none"
        label="Cover Type"
        :color="computedInputColor"
        :options="Book.CoverType.asArray()"
        v-model="media.coverType"
        stack-label>
    </q-select>
    <q-input
        class="q-py-none"
        label="Cover URL (optional)"
        :color="computedInputColor"
        v-model="media.imageUrl"
        stack-label>
    </q-input>
</template>