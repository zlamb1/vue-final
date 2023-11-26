import {useCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to) => {
    // skip on server
    if (process.server) return;
    setTimeout(() => {
        // allow firebase auth to potentially sign-in user before redirecting
        const user = useCurrentUser();
        if (!user.value) {
            return navigateTo({path: '/login', query: {redirect: to.fullPath}})
        }
    }, 1000);
});