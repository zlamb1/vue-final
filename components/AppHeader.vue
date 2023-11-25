<script setup>
import {useUser, signOutUser} from "~/composables/useUser";
import useDarkTheme from "~/composables/useDarkTheme";

const router = useRouter();
const user = useUser();
const {qDark} = useDarkTheme();

const computedColor = computed(() => {
    return qDark.value ? 'white' : 'primary';
});
</script>

<template>
    <q-header class="row transparent">
        <q-toolbar>
            <q-avatar icon="menu_book" size="64px" :text-color="computedColor"></q-avatar>
            <q-btn :text-color="computedColor"
                   class="text-bold"
                   label="The Library"
                   to="/"
                   size="24px"
                   no-caps flat stretch />
            <div class="row items-center q-gutter-x-md q-ml-auto">
                <slot></slot>
                <div v-if="user.loading || user.signedIn" class="row items-center">
                    <q-btn class="user-btn row items-center"
                           :color="computedColor"
                           size="md"
                           flat no-caps>
                        <q-skeleton v-if="user.loading" style="min-width: 100px;" type="text"></q-skeleton>
                        <span v-else class="display-name text-bold">
                            {{user.data?.displayName}}
                        </span>
                        <q-skeleton v-if="user.loading" class="on-right" type="QAvatar" />
                        <q-avatar v-else-if="user.data?.photoURL" class="on-right" size="lg">
                            <q-img :src="user.data?.photoURL" />
                        </q-avatar>
                        <q-avatar v-else class="on-right" size="xl" icon="account_circle" />
                        <q-menu class="overflow-auto" fit>
                            <q-list class="text-white text-bold">
                                <q-item class="bg-accent row justify-between"
                                        to="/profile"
                                        clickable
                                        v-close-popup>
                                    <q-item-section>Profile</q-item-section>
                                    <q-item-section avatar>
                                        <q-icon class="icon" size="sm" name="person" />
                                    </q-item-section>
                                </q-item>
                                <q-item class="bg-accent row justify-between"
                                        to="/lists"
                                        clickable
                                        v-close-popup>
                                    <q-item-section>Browse Lists</q-item-section>
                                    <q-item-section avatar>
                                        <q-icon class="icon" size="sm" name="list" />
                                    </q-item-section>
                                </q-item>
                                <q-item class="bg-accent row justify-between"
                                        to="/settings"
                                        clickable
                                        v-close-popup>
                                    <q-item-section>Settings</q-item-section>
                                    <q-item-section avatar>
                                        <q-icon class="icon" size="sm" name="settings" />
                                    </q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item class="bg-accent"
                                        @click="signOutUser"
                                        clickable
                                        v-close-popup>
                                    <q-item-section>Log Out</q-item-section>
                                    <q-item-section avatar>
                                        <q-icon class="icon" size="sm" name="logout" />
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>
                <q-btn v-else class="text-bold" color="primary" to="/login">
                    LOG IN
                </q-btn>
            </div>
        </q-toolbar>
        <q-img class="full-width" height="300px" src="./library.jpg"></q-img>
    </q-header>
</template>

<style scoped>
    .display-name {
        font-variant-caps: small-caps;
        font-size: 1rem;
    }
    .q-item.q-router-link--active {
        color: white !important;
        text-decoration: underline;
    }
    .q-item__section {
        transition: transform 0.3s ease-in-out;
    }
    .q-item:hover .q-item__section {
        transform: scale(1.1);
    }
</style>