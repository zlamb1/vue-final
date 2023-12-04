<script setup>
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import ResponseCode from "~/models/ResponseCode";
import APIEndpoints from "~/models/Endpoints";
import useNotify from "~/composables/useNotify";

definePageMeta({
    middleware: 'auth',
});

const $q = useQuasar();
const router = useRouter();
const user = useUser();
const {qDark} = useDarkTheme();

const profileVisibility = ref(user.private?.visibility);
const listVisibility = ref(user.list?.visibility);
const deleteInputText = ref('');
const deleteConfirmed = ref(false);

const text = computed(() => {
    return user.public?.displayName;
});

const shadowText = computed(() => {
    if (text.value?.indexOf(deleteInputText.value) === 0) {
        return text.value.substr(deleteInputText.value.length);
    }
    if (deleteInputText.value) {
        return '';
    }
    return text.value;
});

const {notifyPositive, notifyNegative} = useNotify();
async function updateProfileVisibility() {
    const idToken = await useUserToken();
    const {data} = await useFetch(APIEndpoints.UPDATE_USER, {
       query: {idToken, profileVisibility: profileVisibility.value}
    });
    const responseCode = ResponseCode.toResponseCode(data.value);
    if (responseCode === ResponseCode.SUCCESS) {
        notifyPositive();
    } else {
        notifyNegative();
    }
}

async function updateListVisibility() {
    const idToken = await useUserToken();
    const {data} = await useFetch(APIEndpoints.UPDATE_USER, {
        query: {idToken, listVisibility: listVisibility.value}
    });
    const responseCode = ResponseCode.toResponseCode(data.value);
    if (responseCode === ResponseCode.SUCCESS) {
        notifyPositive();
    } else {
        notifyNegative();
    }
}

function modelValueUpdate(newValue) {
    deleteConfirmed.value = newValue === text.value;
}

function onKeydown(e) {
    // they pressed tab
    if (e.keyCode === 9) {
        deleteInputText.value = text.value;
        modelValueUpdate(deleteInputText.value);
        e.preventDefault();
        e.stopPropagation();
    }
}

async function onDeleteUser() {
    const {data} = await deleteUser();
    const responseCode = ResponseCode.toResponseCode(data.value);
    if (responseCode === ResponseCode.SUCCESS) {
        const auth = useFirebaseAuth();
        // reload user to force logout
        await auth.currentUser.reload().catch(() => {});
        await router.push('/');
    } else {
        $q.notify({
            type: 'negative',
            position: 'top',
            timeout: 1000,
            message: 'Failed to delete user account'
        })
    }
}

watch(user, (newUser) => {
    if (newUser.signedIn) {
        profileVisibility.value = newUser.private?.visibility;
        listVisibility.value = newUser.list?.visibility;
    }
});
</script>

<template>
    <div>
        <RouterBackButton />
        <div class="flex justify-center items-center">
            <q-card>
                <q-card-section class="text-center">
                    <span class="text-h5">Settings</span>
                </q-card-section>
                <q-separator />
                <q-card-section class="column q-gutter-md">
                    <q-list class="column text-center q-gutter-y-md">
                        <span style="font-size: 16px;">Profile Visibility</span>
                        <q-tabs :class="qDark ? 'text-white' : 'text-primary'" v-model="profileVisibility" @update:model-value="updateProfileVisibility">
                            <q-tab name="private" icon="lock" label="Private" />
                            <q-tab name="public" icon="public" label="Public" />
                        </q-tabs>
                        <q-separator />
                        <span style="font-size: 16px;">Media List Visibility</span>
                        <q-tabs :class="qDark ? 'text-white' : 'text-primary'" v-model="listVisibility" @update:model-value="updateListVisibility">
                            <q-tab name="private" icon="lock" label="Private" />
                            <q-tab name="public" icon="public" label="Public" />
                        </q-tabs>
                    </q-list>
                    <q-separator />
                    <div class="row q-gutter-x-md delete-section">
                        <q-input :shadow-text="shadowText"
                                 @update:model-value="modelValueUpdate"
                                 @keydown="onKeydown"
                                 label="Confirm Deletion"
                                 :color="qDark ? 'white' : 'accent'"
                                 v-model="deleteInputText"
                                 outlined stack-label />
                        <q-btn color="red"
                               class="text-bold"
                               @click="onDeleteUser"
                               :outline="!deleteConfirmed"
                               :disable="!deleteConfirmed">
                            Delete Account
                        </q-btn>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>