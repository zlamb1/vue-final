<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const route = useRoute();
const {qDark} = useDarkTheme();

const computedUID = computed(() => {
   return route?.query?.id;
});

const user = useUser(computedUID);

const chart = ref(null);

const getMonthName = (date) => {
    return date.toLocaleString('default', {month: 'long'});
}

const months = computed(() => {
    const foundMonths = [];
    for (const mod in user?.list?.modifications) {
        const date = new Date(Number.parseInt(mod));
        if (date.getFullYear() === new Date().getFullYear() && foundMonths.indexOf(getMonthName(date)) < 0) {
            foundMonths.push(getMonthName(date));
        }
    }
    return foundMonths;
});

const additions = computed(() => {
    const foundMonths = months.value;
    const data = [];
    for (const month in foundMonths) {
        data.push(0);
    }
    for (const mod in user?.list?.modifications) {
        const date = new Date(Number.parseInt(mod));
        if (date.getFullYear() === new Date().getFullYear() && user?.list?.modifications[mod] === 'add') {
            data[foundMonths.indexOf(getMonthName(date))]++;
        }
    }
    return data;
});

const updates = computed(() => {
    const foundMonths = months.value;
    const data = [];
    for (const month in foundMonths) {
        data.push(0);
    }
    for (const mod in user?.list?.modifications) {
        const date = new Date(Number.parseInt(mod));
        if (date.getFullYear() === new Date().getFullYear() && user?.list?.modifications[mod] === 'update') {
            data[foundMonths.indexOf(getMonthName(date))]++;
        }
    }
    return data;
});

const deletions = computed(() => {
    const foundMonths = months.value;
    const data = [];
    for (const month in foundMonths) {
        data.push(0);
    }
    for (const mod in user?.list?.modifications) {
        const date = new Date(Number.parseInt(mod));
        if (date.getFullYear() === new Date().getFullYear() && user?.list?.modifications[mod] === 'remove') {
            data[foundMonths.indexOf(getMonthName(date))]++;
        }
    }
    return data;
});

const maxDataPoint = computed(() => {
    let max = 1;
    const additionsMax = additions.value?.sort((a, b) => b - a)[0];
    if (additionsMax > max) {
        max = additionsMax;
    }
    const updatesMax = updates.value?.sort((a, b) => b - a)[0];
    if (updatesMax > max) {
        max = updatesMax;
    }
    const deletionsMax = deletions.value?.sort((a, b) => b - a)[0];
    if (deletionsMax > max) {
        max = deletionsMax;
    }
    return max;
});

const nearestPowerOfTen = (num) => {
    return Math.pow(10, Math.floor(Math.log10(num)));
}

const setChartTheme = () => {
    if (chart.value?.chart) {
        const gridColor = qDark.value ? '#fff' : '#e5e5e5';
        const textColor = qDark.value ? '#fff' : '#000';
        chart.value.chart.options.scales.y.grid.color = gridColor;
        chart.value.chart.options.scales.x.grid.color = gridColor;
        chart.value.chart.options.scales.y.ticks.color = textColor;
        chart.value.chart.options.scales.x.ticks.color = textColor;
        ChartJS.defaults.color = textColor;
        chart.value.chart.update();
    }
}

onMounted(() => {
    setTimeout(() => {
        setChartTheme();
    }, 25);
})

watch(qDark, () => {
    setChartTheme();
});

onBeforeRouteUpdate(() => {
    setTimeout(() => {
        setChartTheme();
    }, 25);
});
</script>

<template>
    <div class="column items-center">
        <span class="text-bold non-selectable">
            Media List Modifications ({{new Date().getFullYear()}})
        </span>
        <div class="row justify-center full-width">
            <div class="col-12 col-md-8 col-lg-6 row justify-center" style="height: 400px;">
                <Bar class="chart"
                     :options="{
                         responsive: true,
                         maintainAspectRatio: false,
                         scaleFontColor: '#ff0000',
                         scales: {
                             y: {
                                ticks: {
                                     stepSize: nearestPowerOfTen(maxDataPoint),
                                },
                             },
                         },
                     }"
                     :data="{labels: months, datasets: [
                         {
                             label: 'Additions',
                             data: additions,
                             backgroundColor: '#33cc33',
                         },
                         {
                             label: 'Updates',
                             data: updates,
                             backgroundColor: 'rgba(61,175,252,0.65)',
                         },
                         {
                             label: 'Deletions',
                             data: deletions,
                             backgroundColor: '#c53f3f',
                         }
                     ]}"
                     ref="chart" />
            </div>
        </div>
    </div>
</template>

<style scoped>
span {
    font-size: 20px;
}
.chart {
    border-radius: 5px;
}
</style>