<script setup>
import {mapArray} from "~/models/Book";

defineProps({
    song: {
        type: Object,
        required: true,
    }
});
</script>

<template>
    <div>
        <q-card class="full-height">
            <q-card-section class="full-height" horizontal>
                <q-card-section class="column">
                    <q-card-section class="text-center">
                        {{song?.trackName}} by {{song?.artistName}}
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <span v-if="song?.collectionName">
                            Album Name: {{song?.collectionName}}
                        </span>
                    </q-card-section>
                    <q-card-section class="row q-mt-auto">
                        <q-btn color="red" icon="remove" round>
                            <q-tooltip class="bg-red-8">
                                Remove from media list
                            </q-tooltip>
                        </q-btn>
                        <q-btn color="green" icon="add" round>
                            <q-tooltip class="bg-green-8">
                                Add to media list
                            </q-tooltip>
                        </q-btn>
                        <q-btn class="q-ml-auto" icon="visibility" round>
                            <q-tooltip class="bg-primary">
                                Hide
                            </q-tooltip>
                        </q-btn>
                    </q-card-section>
                </q-card-section>
                <q-separator v-if="song?.artworkUrl100" vertical />
                <q-card-section v-if="song?.artworkUrl100" class="row justify-center items-center fit">
                    <q-img fit="cover" :src="song?.artworkUrl100" :img-style="{imageRendering: 'high-quality'}" />
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
</template>