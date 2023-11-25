<script setup>
import {Media} from "~/models/Media";
import MediaFactory from "~/models/factory/MediaFactory";

defineProps({
    media: {
        type: Media,
        required: true,
    }
});

const form = ref(null);
const formInputs = ref(null);

const emit = defineEmits(['onsubmit']);

function focusForm() {
    formInputs.value.focusFirstInput();
}

async function submitForm() {
    if (await form.value.validate()) {
        emit('onsubmit', new Media(formInputs.value.getMediaClone()));
    }
}

defineExpose({focusForm, submitForm});
</script>

<template>
    <q-form
        class="column q-gutter-y-md"
        @submit.prevent="submitForm"
        @keypress.enter.prevent.stop="submitForm" ref="form">
        <component
            :is="MediaFactory.CreateForm(media.type)"
            :media="media.media"
            ref="formInputs">
        </component>
    </q-form>
</template>