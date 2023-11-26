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

const profilePrivate = ref(false);
const mediaListPrivate = ref(true);
const deleteInputText = ref('');
const deleteConfirmed = ref(false);

const text = computed(() => {
    return user.data?.displayName;
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
async function onCheckProfilePrivate(newValue) {
    const idToken = await useUserToken();
    const {data} = await useFetch(APIEndpoints.UPDATE_USER, {
       query: {idToken, profilePrivate: newValue}
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
        profilePrivate.value = Boolean(JSON.parse(newUser.data?.profilePrivate));
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
                    <q-list>
                        <q-item tag="label" v-ripple>
                            <q-item-section avatar>
                                <q-checkbox v-model="profilePrivate" @update:model-value="onCheckProfilePrivate" color="accent" label="Make Profile Private" />
                            </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                            <q-item-section avatar>
                                <q-checkbox v-model="mediaListPrivate" color="accent" label="Make Media List Private" />
                            </q-item-section>
                        </q-item>
                    </q-list>
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