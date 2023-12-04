<script setup>
defineProps({
    displayName: {
        type: String,
    },
    photoUrl: {
        type: String,
    }
});
</script>

<template>
    <q-avatar size="md" color="primary" text-color="white" rounded>
        <q-img v-if="photoUrl"
               :src="photoUrl"
               referrerpolicy="no-referrer" />
        <span v-else>{{displayName?.substring(0,1)}}</span>
    </q-avatar>
</template>