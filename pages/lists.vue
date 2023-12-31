<script setup>
import {collection, doc, onSnapshot} from "firebase/firestore";
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import UserCard from "~/components/card/UserCard.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";

const {qDark} = useDarkTheme();

const db = useFirestore();
const publicDocRef = doc(collection(db, 'lists'), 'public');

const users = reactive([]);
const hidden = ref([]);

const search = ref('');

const computedUsers = computed(() => {
    return users
        .filter(user => user?.data?.displayName?.toLowerCase().includes(search.value.toLowerCase()))
        .filter(user => !hidden.value.includes(user));
});

onSnapshot(publicDocRef, (_doc) => {
    users.length = 0;
    const ids = _doc.data()?.users;
    if (ids) {
        for (const key in ids) {
            const {user} = usePublicUser(ids[key]);
            users.push(user);
        }
    }
});
</script>

<template>
    <div>
        <RouterBackButton />
        <div class="column items-center">
            <span class="title non-selectable" :class="qDark ? 'text-white' : 'text-primary'">View Other Media Lists</span>
            <div class="row justify-center q-my-md full-width" v-if="users.length > 0">
                <q-input class="col-3" placeholder="Search by Display Name" v-model="search" filled>
                    <template #append>
                        <q-btn v-show="search" icon="cancel" @click="search = ''" flat round />
                        <q-btn icon="search" flat round />
                    </template>
                </q-input>
            </div>
        </div>
        <div class="row justify-center">
            <q-btn v-if="hidden.length > 0" @click="hidden.length = 0">
                <span class="non-selectable">Click to show {{hidden.length}} hidden users</span>
            </q-btn>
        </div>
        <transition-group name="list" mode="out-in" tag="div" class="row justify-center" appear>
            <div v-for="user in computedUsers" :key="user.id" v-if="users.length > 0" class="col-12 col-md-6 col-lg-4 col-xl-3">
                <UserCard class="q-ma-sm" :user="user?.data" :private="user.isPrivate" :filter="search">
                    <template #menu>
                        <q-menu>
                            <q-list>
                                <q-item class="row items-center" @click="hidden.push(user)" clickable v-ripple>
                                    <q-item-label class="non-selectable">Hide this user</q-item-label>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </template>
                </UserCard>
            </div>
            <UserErrorCard v-else class="q-mt-md" message="No public media lists available!" />
        </transition-group>
    </div>
</template>

<style scoped>
.title {
    font-size: 20px;
}
</style>