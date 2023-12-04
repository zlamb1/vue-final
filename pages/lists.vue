<script setup>
import {collection, doc, onSnapshot} from "firebase/firestore";

const {qDark} = useDarkTheme();

const db = useFirestore();
const publicDocRef = doc(collection(db, 'lists'), 'public');

const users = reactive([]);

onSnapshot(publicDocRef, (_doc) => {
    users.length = 0;
    const list = _doc.data().users;
    if (list) {
        for (const key in list) {
            const userDocRef = doc(collection(db, 'users'), key);
            const userDoc = useDocument(userDocRef);
            userDoc.promise.value.then(() => {
                users.push(userDoc);
            });
        }
    }
});

</script>

<template>
    <div class="row justify-center">
        <q-card class="col-12 col-md-6 col-lg-4 col-xl-3" v-for="user in users" :flat="qDark" :bordered="qDark">
            <q-card-section class="row justify-center">
                <q-btn flat>
                    <q-avatar class="on-left" rounded>
                        <q-img :src="user.value?.photoURL" />
                    </q-avatar>
                    <span class="title">{{user.value?.displayName}}</span>
                </q-btn>
            </q-card-section>
            <q-separator />
            <q-card-section class="row justify-center">
                <q-btn color="primary">Visit Media List</q-btn>
            </q-card-section>
        </q-card>
    </div>
</template>

<style scoped>
.title {
    font-size: 16px;
}
</style>