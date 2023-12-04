<script>
import {useQuasar} from "quasar";
import DynamicPopupEdit from "~/components/popup-edit/DynamicPopupEdit.vue";
import PopupType from "~/models/PopupType";

export default {
    name: "MediaView",
    components: {DynamicPopupEdit},
    setup() {
        return {
            $q: useQuasar()
        }
    },
    data() {
        return {
            PopupType,
            /* Override while extending. */
            cols: {},
        }
    },
    props: {
        media: {
            /* Override while extending */
            type: Object,
            required: true,
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        renderCol(col) {
            if (this.cols[col].type === PopupType.Array) {
                return this.media[col].length > 0;
            }
            return Boolean(this.media[col]);
        }
    },
}
</script>

<template>
    <q-card-section class="q-pa-md">
        <div class="cursor-text" v-for="col in Object.keys(cols)" :key="cols[col].label" @click.stop>
            <div v-if="renderCol(col)">
                <span class="q-table__grid-item-title non-selectable q-mr-xs">
                    {{cols[col].label}}
                </span>
                <span class="q-table__grid-item-value non-selectable" v-if="cols[col].type === PopupType.Date">
                    {{new Date(media[col]).toLocaleString('en-US', cols[col].dateFormat ?? {})}}
                </span>
                <span class="q-table__grid-item-value non-selectable" v-else-if="cols[col].formatter">
                    {{cols[col].formatter(media[col])}}
                </span>
                <span class="q-table__grid-item-value non-selectable" v-else>
                    {{media[col]}}
                </span>
                <DynamicPopupEdit v-model="media[col]" :type="cols[col].type" :options="cols[col].options ?? null" :disable="disable" />
            </div>
        </div>
    </q-card-section>
</template>

<style scoped>
    .q-table__grid-item-title, .q-table__grid-item-value {
        font-size: 14px;
    }
</style>