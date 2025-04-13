<script setup>
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { nextTick, onMounted, ref, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
    logStats: {
        type: Array,
        required: true
    }
});

const chartData = ref({});
const chartOptions = ref({});

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
    let colorHex = color.startsWith('#') ? color.slice(1) : color;
    const r = parseInt(colorHex.slice(0, 2), 16);
    const g = parseInt(colorHex.slice(2, 4), 16);
    const b = parseInt(colorHex.slice(4, 6), 16);

    const newR = Math.min(255, Math.max(0, Math.floor(r * (1 + factor))));
    const newG = Math.min(255, Math.max(0, Math.floor(g * (1 + factor))));
    const newB = Math.min(255, Math.max(0, Math.floor(b * (1 + factor))));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function generateChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    let textColor = documentStyle.getPropertyValue('--text-color') || '#333333';

    chartData.value = {
        labels: props.logStats.map((stat) => serviceNameMap[stat.serviceName] || stat.serviceName),
        datasets: [
            {
                data: props.logStats.map((stat) => stat.count),
                backgroundColor: props.logStats.map((stat) => serviceColors[stat.serviceName] || '#9E9E9E'),
                hoverBackgroundColor: props.logStats.map((stat) => adjustColorBrightness(serviceColors[stat.serviceName] || '#9E9E9E', -0.2))
            }
        ]
    };

    chartOptions.value = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    };
}

onMounted(() => {
    nextTick(() => {
        generateChart();
    });
});

watch(() => props.logStats, generateChart, { deep: true });
</script>

<template>
    <div class="card flex flex-col items-center">
        <div class="font-semibold text-xl mb-4">Services Overview</div>
        <div class="w-[340px] h-[390px]">
            <Doughnut v-if="chartData && chartData.labels?.length" :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>
