<script setup>
const props = defineProps({
    displayName: {
        type: String,
    },
    photoUrl: {
        type: String,
    },
});

const error = ref(false);

watch(() => props.photoUrl, () => {
   error.value = false;
});
</script>

<template>
    <q-avatar v-bind="$attrs" size="md" :color="photoUrl && !error ? 'transparent' : 'primary'" text-color="white" rounded>
        <q-img v-if="photoUrl && !error"
               referrerpolicy="no-referrer"
               :src="photoUrl"
               @load="error = false"
               @error="error = true">
        </q-img>
        <span v-else class="non-selectable">{{displayName?.substring(0,1)}}</span>
        <slot></slot>
    </q-avatar>
</template>