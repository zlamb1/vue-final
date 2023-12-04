<script setup>
import {useQuasar} from "quasar";
import useDarkTheme from "~/composables/useDarkTheme";
import DynamicPopupEdit from "~/components/popup-edit/DynamicPopupEdit.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";
import ResponseCode from "~/models/ResponseCode";
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import APIEndpoints from "~/models/Endpoints";

definePageMeta({
   middleware: 'auth'
});

const $q = useQuasar();
const user = useUser();
const {qDark} = useDarkTheme();

const displayName = ref(null);
const photoURL = ref(null);
const bio = ref(null);

const showMask = ref(false);

if (user.signedIn) {
    displayName.value = user.public?.displayName;
    photoURL.value = user.public?.photoURL;
    bio.value = user.private?.bio;
}

const saveChanges = async () => {
    const notifyDuration = 1000;
    const notify = (msg, negative) => {
        $q.notify({
            type: negative ? 'negative' : 'positive',
            position: 'top',
            timeout: notifyDuration,
            message: negative ? `Failed to save profile: ${msg}` :
                `Successfully saved profile`,
        });
    }

    const idToken = await useUserToken();
    const response = await useFetch(APIEndpoints.UPDATE_USER, {
        query: {
            idToken: idToken,
            displayName: displayName.value,
            photoURL: photoURL.value,
            bio: bio.value,
        }
    });

    const responseCode = ResponseCode.toResponseCode(response.data.value);
    switch (responseCode) {
        case ResponseCode.SUCCESS:
            notify();
            break;
        case ResponseCode.NO_USER:
            notify('No user was found', true);
            break;
        case ResponseCode.NO_CHANGE:
            notify('No changes', true);
            break;
        default:
        case ResponseCode.UNKNOWN:
            notify('', true);
            break;
    }
}

watch(user, (newUser) => {
    if (user.signedIn) {
        displayName.value = newUser.public?.displayName;
        photoURL.value = newUser.public?.photoURL;
        bio.value = newUser.private?.bio;
    }
});
</script>

<template>
    <div>
        <RouterBackButton />
        <div class="row justify-center items-center">
            <div class="col-8 col-md-6 col-lg-4">
                <q-skeleton v-if="user.loading" type="rect" class="full-width" height="200px" />
                <q-card v-else-if="user.signedIn"
                        class="column items-center q-gutter-y-lg full-width"
                        :flat="qDark" :bordered="qDark">
                    <q-card-section class="text-center q-mt-none q-pa-md">
                        <span class="text-h5 q-ma-none non-selectable">Profile</span>
                    </q-card-section>
                    <q-separator class="full-width q-mt-none" />
                    <q-card-section class="column full-width q-gutter-y-md q-py-none q-mt-none">
                        <div class="row justify-center items-center">
                            <q-avatar class="user-avatar on-left" rounded>
                                <q-img :src="photoURL" @mouseenter="showMask = true" @mouseleave="showMask = false">
                                    <div class="row justify-center items-center mask fit" v-show="showMask" />
                                    <dynamic-popup-edit v-model="photoURL"></dynamic-popup-edit>
                                </q-img>
                            </q-avatar>
                            <q-input label="Display Name"
                                     v-model="displayName"
                                     stack-label filled />
                        </div>
                        <q-editor v-model="bio" placeholder="Profile Bio" />
                    </q-card-section>
                    <q-card-section class="q-mt-none">
                        <q-btn class="text-bold"
                               color="blue-8"
                               @click="saveChanges">Save Changes</q-btn>
                    </q-card-section>
                </q-card>
                <div class="full-width" v-else>
                    <UserErrorCard class="full-width" :height="200" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-avatar {
    --image-size: 65px;
    width: var(--image-size);
    height: var(--image-size);
}
.mask {
    background: rgba(255, 255, 255, 0.15);
    cursor: pointer;
}
</style>