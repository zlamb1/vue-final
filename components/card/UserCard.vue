<script setup>
import UserAvatar from "~/components/avatar/UserAvatar.vue";

const router = useRouter();
const {qDark} = useDarkTheme();

const props = defineProps({
    user: {
        required: true,
    },
});
</script>

<template>
    <q-card class="column" :flat="qDark" :bordered="qDark">
        <q-card-section class="row justify-center">
            <q-btn flat>
                <UserAvatar class="on-left" :display-name="user?.displayName" :photo-url="user?.photoURL" />
                <span class="title">{{user?.displayName}}</span>
            </q-btn>
            <q-btn class="q-ml-auto" icon="more_vert" flat round>
                <slot name="menu"></slot>
            </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section class="row justify-center">
            <q-btn color="primary" @click="router.push({path: '/', query: { id: user?.id }})">Visit Media List</q-btn>
        </q-card-section>
    </q-card>
</template>


<style scoped>
.title {
    font-size: 16px;
}
</style>