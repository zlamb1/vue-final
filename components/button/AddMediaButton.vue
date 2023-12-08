<script setup>
import {MediaType} from "~/models/Media";

const {qDark} = useDarkTheme();

const emit = defineEmits(['click']);
</script>

<template>
    <q-btn-dropdown class="text-caption text-bold"
                    label="Add Item"
                    :color="qDark ? 'green-8' : 'green-6'"
                    ref="dropdownBtn"
                    stretch>
        <q-list>
            <q-item class="text-white text-caption"
                    :class="qDark ? 'bg-green-8' : 'bg-green-6'"
                    @click="emit('click', 'import')"
                    clickable v-close-popup>
                <q-item-section>
                    <q-item-label>Import</q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-white text-caption"
                    :class="qDark ? 'bg-green-8' : 'bg-green-6'"
                    v-for="item in MediaType" :key="item"
                    @click="emit('click', item)"
                    clickable v-close-popup>
                <q-item-section>
                    <q-item-label>{{item}}</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </q-btn-dropdown>
</template>