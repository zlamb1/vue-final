import {useCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to) => {
    // skip on server
    if (process.server) return;
    const user = useCurrentUser();
    if (!user.value) {
        return navigateTo({path: '/login', query: {redirect: to.fullPath}})
    }
});