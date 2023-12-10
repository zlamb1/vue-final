<script setup>
import DOMPurify from "dompurify";
import DynamicPopupEdit from "~/components/popup-edit/DynamicPopupEdit.vue";
import UserErrorCard from "~/components/card/UserErrorCard.vue";
import ResponseCode from "~/models/ResponseCode";
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import APIEndpoints from "~/models/Endpoints";
import UserAvatar from "~/components/avatar/UserAvatar.vue";

definePageMeta({
   middleware: 'auth'
});

const route = useRoute();

const computedUID = computed(() => {
    return route?.query?.id;
});

const isPersonalProfile = computed(() => {
    return !Boolean(computedUID.value);
});

const $q = useQuasar();
const user = useUser(computedUID);
const {qDark} = useDarkTheme();

const displayName = ref('');
const photoURL = ref(null);
const bio = ref('');

const sanitizedBio = computed(() => {
    return DOMPurify.sanitize(bio.value, { USE_PROFILES: { html: true } });
});

if (user?.public) {
    displayName.value = user.public?.displayName;
    photoURL.value = user.public?.photoURL;
}

if (user?.private) {
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
            bio: bio.value ? bio.value : '',
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

watch(user, () => {
    if (user?.public) {
        displayName.value = user?.public?.displayName;
        photoURL.value = user?.public?.photoURL;
    }
    if (user?.private) {
        bio.value = user?.private?.bio;
    }
});
</script>

<template>
    <div>
        <RouterBackButton />
        <div class="row justify-center items-center">
            <div class="col-8 col-md-6 col-lg-4">
                <q-skeleton v-if="user?.loading" type="rect" class="full-width" height="200px" />
                <q-card v-else-if="user?.public"
                        class="column items-center q-gutter-y-lg full-width"
                        :flat="qDark" :bordered="qDark">
                    <q-card-section class="row justify-center items-center q-mt-none q-pa-md">
                        <UserAvatar :display-name="user?.public?.displayName"
                                    :photo-url="user?.public?.photoURL"
                                    :hover-color="isPersonalProfile ? 'rgba(110, 228, 255, 0.2)' : undefined"
                                    :class="isPersonalProfile ? 'cursor-pointer' : null"
                                    class="on-left"
                                    size="54px">
                            <dynamic-popup-edit :disable="!isPersonalProfile" v-model="photoURL" />
                        </UserAvatar>
                        <q-input v-if="isPersonalProfile"
                                 label="Display Name"
                                 v-model="displayName"
                                 stack-label filled />
                        <span class="title non-selectable" v-else>{{displayName}}</span>
                    </q-card-section>
                    <q-separator class="full-width q-mt-none" />
                    <q-card-section class="column full-width q-gutter-y-md q-pt-none q-mt-none">
                        <q-editor v-if="isPersonalProfile" v-model="bio" placeholder="Profile Bio" />
                        <div v-else>
                            <q-expansion-item style="font-size: 16px"
                                              label="Profile Bio"
                                              class="shadow-1 overflow-hidden"
                                              header-class="bg-accent text-white"
                                              expand-icon-class="text-white"
                                              icon="perm_identity"
                                              :default-opened="true"
                                              dense-toggle
                                              expand-separator>
                                <q-card v-if="sanitizedBio" class="bio q-pa-md">
                                    <div v-html="sanitizedBio" />
                                </q-card>
                                <q-card v-else class="bio q-pa-md">This user has no bio.</q-card>
                            </q-expansion-item>
                        </div>
                    </q-card-section>
                    <q-card-section v-if="isPersonalProfile" class="q-mt-none">
                        <q-btn class="text-bold"
                               color="blue-8"
                               @click="saveChanges">
                            Save Changes
                        </q-btn>
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
.title {
    font-size: 20px;
}
.bio {
    font-size: 16px;
}
</style>