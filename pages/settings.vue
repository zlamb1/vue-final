<script setup>
import RouterBackButton from "~/components/button/RouterBackButton.vue";
import ResponseCode from "~/models/ResponseCode";

const $q = useQuasar();
const router = useRouter();
const user = useUser();

const onDeleteUser = async () => {
    const {data} = await deleteUser();
    const responseCode = ResponseCode.toResponseCode(data);
    if (responseCode === ResponseCode.SUCCESS) {
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
                                <q-checkbox color="accent" label="Make Profile Public" />
                            </q-item-section>
                        </q-item>
                        <q-item tag="label" v-ripple>
                            <q-item-section avatar>
                                <q-checkbox color="accent" label="Make Media List Public" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                    <div class="row q-gutter-x-md">
                        <q-input :shadow-text="user.data?.displayName"
                                 label="Confirm Deletion"
                                 color="accent"
                                 filled></q-input>
                        <q-btn color="red" @click="onDeleteUser" outline>Delete Account</q-btn>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>