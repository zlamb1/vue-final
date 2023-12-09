<script setup>
import {mapArray} from "~/models/Book";

defineProps({
    item: {
        type: Object,
        required: true,
    },
    removable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['add', 'remove', 'hide']);

const descDialog = ref(null);

const selectedItem = ref(null);

function trimDescription(desc) {
    const maxLength = 150;
    let str = desc;
    if (str.length > maxLength) {
        return str.substr(0, maxLength) + '...';
    } else {
        return str;
    }
}

function showDescDialog(item) {
    selectedItem.value = item;
    descDialog.value?.show();
}
</script>

<template>
    <div>
        <q-dialog ref="descDialog">
            <q-card>
                <q-card-section class="row items-center">
                    <span class="title">Description</span>
                    <q-btn class="q-ml-auto" icon="close" flat round v-close-popup />
                </q-card-section>
                <q-separator />
                <q-card-section>
                    {{selectedItem.volumeInfo?.description}}
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-card class="full-height">
            <q-card-section class="full-height" horizontal>
                <q-card-section class="column fit q-pa-none">
                    <q-card-section class="text-center title">
                        {{item?.volumeInfo?.title}} by
                        {{mapArray(item?.volumeInfo?.authors)}}
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <q-btn v-if="item?.volumeInfo?.description"
                               padding="0"
                               @click="showDescDialog(item)"
                               flat no-caps>
                            Description:
                            {{trimDescription(item.volumeInfo?.description)}}
                        </q-btn>
                    </q-card-section>
                    <q-card-section class="row q-mt-auto">
                        <q-btn v-if="!removable" color="green" icon="add" @click="emit('add', item)" round>
                            <q-tooltip class="bg-green-8">
                                Add to media list
                            </q-tooltip>
                        </q-btn>
                        <q-btn v-else color="red" icon="remove" @click="emit('remove', item)" round>
                            <q-tooltip class="bg-red-8">
                                Remove from media list
                            </q-tooltip>
                        </q-btn>
                        <q-btn class="q-ml-auto" icon="visibility" @click="emit('hide', item)" round>
                            <q-tooltip class="bg-primary">
                                Hide
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
                </q-card-section>
                <q-separator vertical />
                <q-card-section v-if="item.volumeInfo?.imageLinks?.thumbnail" class="row justify-center items-center fit">
                    <q-img fit="cover" :src="item.volumeInfo?.imageLinks?.thumbnail" :img-style="{imageRendering: 'high-quality'}" />
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
</template>