<script setup>
import { useLayout } from '@/layout/composables/layout';
import { nextTick, onMounted, ref, watch } from 'vue';

const { getPrimary, getSurface, isDarkTheme } = useLayout();
const pieData = ref(null);
const pieOptions = ref(null);

const props = defineProps({
    logStats: {
        type: Array,
        required: true
    }
});

onMounted(async () => {
    await nextTick();
    setTimeout(() => {
        setColorOptions();
    }, 100);
});

function setColorOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    if (!textColor) {
        console.warn('CSS variable --text-color not available yet.');
        return;
    }

    pieData.value = {
        labels: props.logStats.map((stat) => serviceNameMap[stat.serviceName] || stat.serviceName),
        datasets: [
            {
                data: props.logStats.map((stat) => stat.count),
                backgroundColor: props.logStats.map((stat) => serviceColors[stat.serviceName] || '#9E9E9E'),
                hoverBackgroundColor: props.logStats.map((stat) => adjustColorBrightness(serviceColors[stat.serviceName] || '#9E9E9E', -0.2))
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
}
const serviceNameMap = {
    client: 'Client',
    'exchange-rate': 'Exchange Rate',
    'inflation-rate': 'Inflation Rate',
    'financial-health': 'Financial Health',
    'credit-history': 'Credit History'
};

const serviceColors = {
    client: '#4CAF50',
    'exchange-rate': '#2196F3',
    'inflation-rate': '#FF9800',
    'financial-health': '#9C27B0',
    'credit-history': '#F44336'
};

function adjustColorBrightness(color, factor) {
    let colorHex = color;
    if (colorHex.startsWith('#')) {
        colorHex = colorHex.slice(1);
    }
    const r = parseInt(colorHex.slice(0, 2), 16);
    const g = parseInt(colorHex.slice(2, 4), 16);
    const b = parseInt(colorHex.slice(4, 6), 16);

    const newR = Math.min(255, Math.max(0, Math.floor(r * (1 + factor))));
    const newG = Math.min(255, Math.max(0, Math.floor(g * (1 + factor))));
    const newB = Math.min(255, Math.max(0, Math.floor(b * (1 + factor))));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

watch(
    [getPrimary, getSurface, isDarkTheme],
    () => {
        setColorOptions();
    },
    { immediate: true, deep: true }
);
</script>

<template>
    <Fluid class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-12">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">Services Overview</div>
                <Chart type="doughnut" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
    </Fluid>
</template>
