<script setup>
import PopupType from "~/models/PopupType";

const {qDark} = useDarkTheme();

defineProps({
    type: {
        type: String,
        default: PopupType.Text,
    },
    options: {
        type: Array,
        default: () => [],
    },
});

const computedColor = computed(() => {
    return qDark.value ? 'white' : 'primary';
});
</script>

<template>
    <q-popup-edit :buttons="type === PopupType.Select || type === PopupType.Date"
                  :color="computedColor" v-slot="scope">
        <div v-if="type === PopupType.Number">
            <q-input
                type="number"
                :color="computedColor"
                v-model.number="scope.value"
                @keyup.enter="scope.set"
                dense autofocus counter>
            </q-input>
        </div>
        <div v-else-if="type === PopupType.Select">
            <q-select
                v-model="scope.value"
                :color="computedColor"
                @keyup.enter="scope.set"
                :options="options"
                dense autofocus counter>
            </q-select>
        </div>
        <div class="row justify-center" v-else-if="type === PopupType.Date">
            <q-date v-model="scope.value" minimal></q-date>
        </div>
        <div v-else>
            <q-input
                v-model="scope.value"
                :color="computedColor"
                @keyup.enter="scope.set"
                dense autofocus counter>
            </q-input>
        </div>
    </q-popup-edit>
</template>