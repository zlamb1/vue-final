<script setup>
const hovering = ref(false);

const props = defineProps({
    displayName: {
        type: String,
    },
    photoUrl: {
        type: String,
    },
    hoverColor: {
        type: String,
    },
});

const computedStyle = computed(() => {
    return hovering.value ? `background: ${props.hoverColor} !important` : null;
});
</script>

<template>
    <q-avatar v-bind="$attrs" size="md" color="primary" text-color="white" @mouseover="hovering = true" @mouseleave="hovering = false" rounded>
        <div class="fit absolute rounded-borders" :style="computedStyle" />
        <q-img v-if="photoUrl"
               :src="photoUrl"
               referrerpolicy="no-referrer">
        </q-img>
        <span v-else class="non-selectable">{{displayName?.substring(0,1)}}</span>
        <slot></slot>
    </q-avatar>
</template>