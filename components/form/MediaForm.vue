<script setup>
import _ from "lodash";
import {Media} from "~/models/Media";
import MediaFactory from "~/models/factory/MediaFactory";

const props = defineProps({
    mediaItem: {
        type: Media,
        required: true,
    }
});

const mediaClone = ref(_.cloneDeep(props.mediaItem?.media));

const form = ref(null);
const formInputs = ref(null);

const emit = defineEmits(['onsubmit']);

function focusForm() {
    formInputs.value?.focusFirstInput();
}
async function submitForm() {
    if (await form.value.validate()) {
        emit('onsubmit', new Media(mediaClone.value));
    }
}

watch(props.mediaItem, (newMediaItem) => {
    mediaClone.value = _.cloneDeep(newMediaItem?.media);
});

defineExpose({focusForm, submitForm});
</script>

<template>
    <q-form
        class="column q-gutter-y-md"
        @submit.prevent="submitForm"
        @keypress.enter.prevent.stop="submitForm" ref="form">
        <component
            :is="MediaFactory.CreateForm(mediaItem.type)"
            :media="mediaClone"
            ref="formInputs">
        </component>
    </q-form>
</template>