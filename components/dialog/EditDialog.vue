<script setup>
const show = ref(false);

defineProps({
    clearFunc: {
        type: Function,
    },
    btnText: {
        type: String,
        default: 'Save',
    },
    btnColor: {
        type: String,
        default: 'primary',
    },
});

function showDialog() {
    show.value = true;
}

function hideDialog() {
    show.value = false;
}

defineExpose({showDialog, hideDialog});
</script>

<template>
    <q-dialog v-model="show">
        <q-card class="q-px-xl q-py-md">
            <q-card-section>
                <slot></slot>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn label="Cancel"
                       class="text-bold"
                       style="width: 125px;"
                       v-close-popup flat />
                <q-btn :label="btnText"
                       :color="btnColor"
                       class="text-bold"
                       style="width: 125px;"
                       @click="$emit('dialog-submit')" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>