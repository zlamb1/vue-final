<script setup>
import Book from "~/models/Book";

const {qDark} = useDarkTheme();

const props = defineProps({
    book: {
        type: Book,
        required: true,
    },
    header: {
        type: Boolean,
        default: true,
    },
    color: {
        type: String,
        default: 'primary',
    },
    trackColor: {
        type: String,
        default: 'grey-3',
    },
    headerColor: {
        type: String,
        default: 'black',
    },
    centerColor: {
        type: String,
        default: 'black',
    },
    thickness: {
        type: Number,
        default: 0.3,
    },
    size: {
        type: String,
        default: '200px',
    },
    fontSize: {
        type: String,
        default: '30px',
    },
    overrideDark: {
        type: Boolean,
        default: false,
    },
    disable: {
        type: Boolean,
        default: false,
    }
});

const computedTrackColor = computed(() => {
    return qDark.value && !props.overrideDark ? 'grey-4' : props.trackColor;
});

const computedHeaderColor = computed(() => {
    return qDark.value && !props.overrideDark ? 'white' : props.headerColor;
});

const computedCenterColor = computed(() => {
    return qDark.value && !props.overrideDark ? 'white' : props.centerColor;
});

defineEmits(['update:model-value'])
</script>

<template>
    <div class="column items-center q-gutter-y-sm">
        <span class="non-selectable" :class="'text-' + computedHeaderColor" v-show="header">
         Completion Percentage:
        </span>
        <q-tooltip>
            Click and holds for 2 seconds to set to 100%
        </q-tooltip>
        <q-knob
            :min="0"
            :max="100"
            :step="100 / book.pageCount"
            :size="size"
            :thickness="thickness"
            :color="color"
            :track-color="computedTrackColor"
            :disable="disable"
            v-model="book.completionPercentage"
            v-touch-hold.mouse="() => book.completionPercentage = 100"
            @update:model-value="(value) => $emit('update:model-value', value)"
            show-value>
            <span :class="'text-' + computedCenterColor" :style="'font-size:' + fontSize">
                {{book.completionPercentage.toFixed(1) + '%'}}
            </span>
        </q-knob>
    </div>
</template>