import {onAuthStateChanged} from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    // skip on server
    if (process.server) return;
    const auth = useFirebaseAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo({path: '/login', query: {redirect: to.fullPath}})
        }
    });
});