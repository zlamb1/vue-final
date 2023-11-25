<script setup>
const router = useRouter();
const {qDark} = useDarkTheme();

const props = defineProps({
    color: {
        default: 'primary',
    },
    flat: {
        default: true,
    },
    round: {
        default: true,
    },
});

const computedColor = computed(() => {
    return qDark.value ? 'white' : props.color;
});
</script>

<template>
    <q-btn icon="arrow_back" :color="computedColor" @click="router.back()" :flat="flat" :round="round" />
</template>