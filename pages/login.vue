<script setup>
import {EmailAuthProvider, GoogleAuthProvider} from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";
import APIEndpoints from "~/models/Endpoints";

const router = useRouter();
const {authUI} = useFirebaseAuthUI();
const user = useUser();

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
        <div class="row justify-center items-center">
            <div id="firebaseui-div" v-show="!user.signedIn && !user.loading" ></div>
            <q-skeleton v-if="user.loading" width="200px" height="50px" type="rect" />
            <UserErrorCard v-else-if="user.signedIn"
                           class="fit-content"
                           message="You are already logged in!" />
        </div>
    </div>
</template>