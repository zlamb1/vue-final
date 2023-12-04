<script setup>
import {collection, doc, onSnapshot} from "firebase/firestore";
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import UserCard from "~/components/card/UserCard.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";

const db = useFirestore();
const publicDocRef = doc(collection(db, 'lists'), 'public');

const users = reactive([]);

onSnapshot(publicDocRef, (_doc) => {
    users.length = 0;
    const list = _doc.data()?.users;
    if (list) {
        for (const key in list) {
            users.push(list[key]);
        }
    }
});

</script>

<template>
    <div>
        <RouterBackButton />
        <div class="row">
            <div v-if="users.length > 0" v-for="userId in users" class="col-12 col-md-6 col-lg-4 col-xl-3">
                <UserCard class="q-ma-sm" :user-id="userId" />
            </div>
            <UserErrorCard v-else message="No public media lists available!" />
        </div>
    </div>
</template>