<script setup>
const show = ref(false);

defineProps({
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

function showDialog() {
    show.value = true;
}

function closeDialog() {
    show.value = false;
}

function onClickConfirm() {
    emit('confirm');
}

defineExpose({showDialog, closeDialog});
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
                       color="primary"
                       class="text-bold btn-action"
                       @click="closeDialog"
                       flat />
                <q-btn :label="btnText"
                       :color="btnColor"
                       class="text-bold btn-action"
                       @click="onClickConfirm" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.btn-action {
    width: 125px;
}
</style>