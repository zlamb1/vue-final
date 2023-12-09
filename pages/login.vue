<script setup>
import {EmailAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword} from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";
import APIEndpoints from "~/models/Endpoints";

const router = useRouter();
const auth = useFirebaseAuth();
const {authUI} = useFirebaseAuthUI();
const user = useUser(undefined);

const email = ref('');
const password = ref('');
const passwordVisible = ref(false);
const visibilityBtn = ref(null);

async function onToggleVisibility() {
    await visibilityBtn.value?.$el?.animate([{transform: 'scale(0)'}], {duration: 100}).finished;
    visibilityBtn.value?.$el?.style.setProperty('transform', 'scale(0)');
    passwordVisible.value = !passwordVisible.value;
    await visibilityBtn.value?.$el?.animate([{transform: 'scale(1)'}], {duration: 100}).finished;
    visibilityBtn.value?.$el?.style.setProperty('transform', null);
}


const {notifyNegative} = useNotify();
async function onLogin() {
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then(async () => {
            await router.push('/');
        })
        .catch((error) => {
            const errorMessage = error.message;
            if (errorMessage.includes('auth/invalid-email') || errorMessage.includes('auth/missing-password')) {
                notifyNegative('Invalid login credentials');
            } else {
                notifyNegative('Unknown error');
            }
        });
}

onMounted(() => {
    authUI?.start('#firebaseui-div', {
        signInOptions: [
            EmailAuthProvider.PROVIDER_ID,
            GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authResult) => {
                if (authResult?.additionalUserInfo.isNewUser) {
                    // tell server to initialize user
                    new Promise(async () => {
                        const idToken = await useUserToken();
                        await useFetch(APIEndpoints.INITIALIZE_USER, {
                            query: {idToken}
                        });
                        await router.push('/');
                    });
                } else {
                    router.push('/');
                }
                return false;
            },
        },
    });
});
</script>

<template>
    <div>
        <RouterBackButton />
        <div class="row justify-center">
            <div class="column q-gutter-y-md col-8 col-lg-6 col-xl-4">
                <q-card v-show="!user?.public">
                    <q-card-section class="text-center">
                        <span class="title non-selectable">Log In</span>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="column q-gutter-y-md">
                        <q-input v-model="email" label="Email" filled />
                        <q-input v-model="password" label="Password" :type="passwordVisible ? 'text' : 'password'" filled>
                            <template #append>
                                <q-btn :icon="passwordVisible ? 'visibility' : 'visibility_off'"
                                       @click="onToggleVisibility"
                                       ref="visibilityBtn"
                                       round flat />
                            </template>
                        </q-input>
                    </q-card-section>
                    <q-card-actions class="flex justify-center q-pb-lg">
                        <q-btn color="primary" @click="onLogin">Log In</q-btn>
                    </q-card-actions>
                </q-card>
                <q-card v-show="!user?.public">
                    <q-card-section class="text-center">
                        <span class="title non-selectable">Create Account</span>
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <div id="firebaseui-div" />
                    </q-card-section>
                </q-card>
                <q-skeleton v-if="user?.loading" width="200px" height="50px" type="rect" />
                <div v-else-if="!!user?.public" class="row justify-center">
                    <UserErrorCard class="fit-content"
                                   message="You are already logged in!" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.title {
    font-size: 20px;
}
</style>