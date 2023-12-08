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

const emit = defineEmits(['update:model-value'])

const updating = ref(false);
const knobModel = ref(props.book?.completionPercentage);

const computedTrackColor = computed(() => {
    return qDark.value && !props.overrideDark ? 'grey-4' : props.trackColor;
});

const computedHeaderColor = computed(() => {
    return qDark.value && !props.overrideDark ? 'white' : props.headerColor;
});

const computedCenterColor = computed(() => {
    return qDark.value && !props.overrideDark ? 'white' : props.centerColor;
});

function onUpdate() {
    if (!updating.value) {
        updating.value = true;
    }
}

const closeDebounce = 250;
function onSave() {
    setTimeout(() => {
        updating.value = false;
    }, closeDebounce);
    props.book.completionPercentage = knobModel.value;
    emit('update:model-value', knobModel.value);
}

function onCancel() {
    setTimeout(() => {
        updating.value = false;
    }, closeDebounce);
    knobModel.value = props.book?.completionPercentage;
}

watch(() => props.book, () => {
    knobModel.value = props.book?.completionPercentage;
});
</script>

<template>
    <div class="column items-center q-gutter-y-sm relative-position">
        <q-card v-show="updating" class="absolute-bottom" :flat="qDark" :bordered="qDark" style="z-index: 99; bottom: -25%;">
            <q-card-section class="row justify-center">
                <q-btn class="col-5 q-mr-md" @click="onCancel">Cancel</q-btn>
                <q-btn class="col-5" :color="color" @click="onSave">Save</q-btn>
            </q-card-section>
        </q-card>
        <span class="non-selectable" :class="'text-' + computedHeaderColor" v-show="header">
         Completion Percentage:
        </span>
        <q-knob
            :min="0"
            :max="100"
            :step="100 / book.pageCount"
            :size="size"
            :thickness="thickness"
            :color="color"
            :track-color="computedTrackColor"
            :disable="disable"
            v-model="knobModel"
            v-touch-hold.mouse="() => book.completionPercentage = 100"
            @update:model-value="onUpdate"
            show-value>
            <span :class="'text-' + computedCenterColor" :style="'font-size:' + fontSize">
                {{knobModel?.toFixed(1) + '%'}}
            </span>
            <q-tooltip>
                Click and holds for 2 seconds to set to 100%
            </q-tooltip>
        </q-knob>
    </div>
</template>