<script setup>
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
</script>

<template>
    <div>
        <q-card class="full-height">
            <q-card-section class="row full-height" horizontal>
                <q-card-section class="col-6 column">
                    <q-card-section class="text-center">
                        {{item?.trackName}} by {{item?.artistName}}
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <span v-if="item?.collectionName">
                            Album Name: {{item?.collectionName}}
                        </span>
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
                <q-separator v-if="item?.artworkUrl100" vertical />
                <q-card-section v-if="item?.artworkUrl100" class="row justify-center items-center fit">
                    <q-img width="100%" fit="cover" :src="item?.artworkUrl100" :img-style="{imageRendering: 'high-quality'}" />
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
</template>