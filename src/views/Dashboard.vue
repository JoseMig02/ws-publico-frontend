<script setup>
import { fetchLogStats } from '@/api/dashboardAPI';
import ChartServices from '@/components/dashboard/ChartServices.vue';
import CreditHistory from '@/components/dashboard/CreditHistory.vue';
import CrudClients from '@/components/dashboard/CrudClients.vue';
import ExchangeRate from '@/components/dashboard/ExchangeRate.vue';
import FinancialRate from '@/components/dashboard/FinancialRate.vue';
import InflasionRate from '@/components/dashboard/InflasionRate.vue';
import LogsHistory from '@/components/dashboard/LogsHistory.vue';
import { onMounted, ref } from 'vue';

const logStats = ref([]);

const loadLogStats = async () => {
    try {
        const stats = await fetchLogStats();
        logStats.value = stats;
    } catch (err) {
        console.error(err);
    }
};

const getStatByServiceName = (serviceName) => {
    const stat = logStats.value.find((item) => item.serviceName === serviceName);
    return stat ? stat.count : 0;
};

onMounted(() => {
    loadLogStats();
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <InflasionRate :count="getStatByServiceName('inflation-rate')" />
        <FinancialRate :count="getStatByServiceName('financial-health')" />
        <ExchangeRate :count="getStatByServiceName('exchange-rate')" />
        <CreditHistory :count="getStatByServiceName('credit-history')" />

        <div class="col-span-12 xl:col-span-12">
            <LogsHistory />
        </div>
        <div class="col-span-12">
            <ChartServices :logStats="logStats" />
        </div>
        <div class="col-span-12">
            <CrudClients />
        </div>
    </div>
</template>
