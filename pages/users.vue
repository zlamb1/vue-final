<script setup>
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import DynamicPopupEdit from "~/components/popup-edit/DynamicPopupEdit.vue";
import UserAvatar from "~/components/avatar/UserAvatar.vue";
import APIEndpoints from "~/models/Endpoints";
import ResponseCode from "~/models/ResponseCode";

const router = useRouter();

const loading = ref(false);
const users = ref([]);
const user = useUser(undefined, () => {
    // timeout to prevent Vue from throwing errors:
    // https://github.com/nuxt/nuxt/issues/13350
    setTimeout(() => {
        if (!user?.private?.roles?.admin) {
            router.push('/');
        }
    }, 500);

    requestUserData();
});

const bioDialog = ref(null);
const selectedUser = ref(null);

const columns = [
    {
        name: 'displayName',
        field: 'displayName',
        label: 'Display Name',
        align: 'left',
        sortable: true,
    },
    {
        name: 'photoURL',
        field: 'photoURL',
        label: 'Photo URL',
        align: 'left',
        sortable: true,
    },
    {
        name: 'roles',
        field: 'roles',
        label: 'Roles',
        align: 'left',
    },
    {
        name: 'bio',
        field: 'bio',
        label: 'Bio',
        align: 'left'
    }
]

const requestUserData = async (done) => {
    loading.value = true;
    const idToken = await useUserToken();
    const response = await useFetch(APIEndpoints.GET_USERS, {
        query: {idToken: idToken}
    });
    const data = response?.data?.value;
    if (data && Array.isArray(data)) {
        users.value = data;
    } else {
        users.value.length = 0;
    }
    loading.value = false;
    if (done) {
        done();
    }
}

const {notifyPositive, notifyNegative} = useNotify();

const updateUserData = async (user) => {
    const idToken = await useUserToken();
    const response = await useFetch(APIEndpoints.UPDATE_USER, {
        query: {idToken: idToken, displayName: user.displayName, photoURL: user.photoURL, bio: user.bio, targetUser: user.uid}
    });
    const data = response?.data?.value;
    if (data === ResponseCode.SUCCESS) {
        notifyPositive('Successfully updated user');
    } else if (data === ResponseCode.NO_PERMS) {
        notifyNegative('Error occurred: insufficient permissions!');
    } else {
        notifyNegative('Error occurred');
    }

    // refresh user data
    await requestUserData();
}

const mapObject = (object) => {
    let str = '';
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
        const roleName = keys[i];
        str += roleName[0].toUpperCase() + roleName.substring(1);
        if (i === keys.length - 2) {
            str += ' and ';
        } else if (i < keys.length - 2) {
            str += ', ';
        }
    }
    return str;
}

const onOpenDialog = (user) => {
    selectedUser.value = user;
    bioDialog.value?.show();
}
</script>

<template>
    <div>
        <RouterBackButton />
        <q-dialog ref="bioDialog">
            <q-card>
                <q-card-section class="row items-center">
                    <UserAvatar class="on-left" :display-name="selectedUser?.displayName" :photo-url="selectedUser?.photoURL" />
                    <span v-if="selectedUser?.displayName" class="non-selectable" style="font-size: 18px">{{selectedUser?.displayName}}</span>
                    <q-btn class="q-ml-auto" icon="close" flat round v-close-popup />
                </q-card-section>
                <q-separator />
                <q-card-section>
                    <q-editor v-model="selectedUser.bio" />
                </q-card-section>
                <q-card-actions class="float-right">
                    <q-btn style="width: 100px" icon="cancel" label="Cancel" flat v-close-popup />
                    <q-btn style="width: 100px"  icon="edit" label="Save" color="blue-8" @click="updateUserData(selectedUser)" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <div class="column justify-center items-center">
            <div class="col-8">
                <q-pull-to-refresh @refresh="requestUserData">
                    <q-table separator="cell" :rows="users" :columns="columns" :loading="loading">
                        <template #body-cell="scope">
                            <q-td>
                                <span>
                                    {{scope.row[scope.col.field]}}
                                    <DynamicPopupEdit v-model="scope.row[scope.col.field]" @save="updateUserData(scope.row)" />
                               </span>
                            </q-td>
                        </template>
                        <template #body-cell-roles="scope">
                            <q-td>
                                <span>{{mapObject(scope.row?.roles)}}</span>
                            </q-td>
                        </template>
                        <template #body-cell-bio="scope">
                            <q-td>
                                <q-btn color="primary" @click="onOpenDialog(scope.row)">Click to view</q-btn>
                            </q-td>
                        </template>
                        <template #loading>
                            <q-inner-loading :showing="loading">
                                <q-spinner-hourglass size="lg" color="primary" v-show="loading" />
                            </q-inner-loading>
                        </template>
                        <template #bottom="scope">
                            <div class="row full-width justify-between">
                                <q-icon color="primary" name="info" size="md">
                                    <q-tooltip class="bg-primary text-white">
                                        Pull down from the top of the table to refresh data
                                    </q-tooltip>
                                </q-icon>
                                <q-pagination v-model="scope.pagination.page" :max="Math.min(3, scope.pagesNumber)" direction-links boundary-links />
                            </div>
                        </template>
                    </q-table>
                </q-pull-to-refresh>
            </div>
        </div>
    </div>
</template>