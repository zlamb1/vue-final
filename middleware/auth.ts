import {getCurrentUser} from "vuefire";

export default defineNuxtRouteMiddleware(async (to) => {
    // skip on server
    if (process.server) return;
    const user = await getCurrentUser();
    if (!user) {
        return navigateTo({path: '/login', query: {redirect: to.fullPath}})
    }
});