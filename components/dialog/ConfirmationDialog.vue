<script setup>
const {qDark} = useDarkTheme();

const props = defineProps({
    showId: {
        type: String,
    },
    confirmationPrompt: {
        type: String,
        default: 'Confirm the following:'
    },
    btnText: {
        type: String,
        default: 'Confirm',
    },
    btnColor: {
        type: String,
        default: 'primary',
    },
});

const emit = defineEmits(['confirm']);

const show = ref(false);

function open() {
    show.value = true;
}

function hide() {
    show.value = false;
}

function onConfirm() {
    emit('confirm');
}

defineExpose({open, hide});
</script>

<template>
    <q-dialog v-model="show" persistent>
        <q-card>
            <q-card-section class="q-pb-none">
                <q-avatar class="on-left" icon="delete" color="red" text-color="white" />
                <span class="q-ml-sm">{{confirmationPrompt}}</span>
            </q-card-section>
            <q-card-section class="q-py-none">
                <slot></slot>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancel"
                       class="text-bold btn-action"
                       :color="qDark ? 'white' : 'primary'"
                       flat v-close-popup />
                <q-btn class="text-bold btn-action"
                       :label="btnText"
                       :color="qDark ? 'white' : btnColor"
                       :text-color="qDark ? 'primary' : 'white'"
                       @click="onConfirm"
                       v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.btn-action {
    width: 125px;
}
</style>