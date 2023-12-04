<script setup>
import {collection, doc} from "firebase/firestore";
import UserAvatar from "~/components/avatar/UserAvatar.vue";

const router = useRouter();
const {qDark} = useDarkTheme();

const props = defineProps({
    userId: {
        type: String,
        required: true,
    }
});

const db = useFirestore();
const user = useDocument(doc(collection(db, 'users'), props.userId));
</script>

<template>
    <q-card :flat="qDark" :bordered="qDark">
        <q-card-section class="row justify-center">
            <q-btn flat>
                <UserAvatar class="on-left" :display-name="user?.displayName" :photo-url="user?.photoURL" />
                <span class="title">{{user?.displayName}}</span>
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