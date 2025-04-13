<script setup>
import { fetchLogs } from '@/api/dashboardAPI';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';
const toast = useToast();

const logsData = ref([]);
const fromDate = ref(null);
const toDate = ref(null);

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    id: { value: null, matchMode: 'contains' },
    serviceName: { value: null, matchMode: 'contains' },
    ipAddress: { value: null, matchMode: 'contains' },
    createdAt: { value: null, matchMode: 'contains' }
});

const validateDates = () => {
    if (fromDate.value && toDate.value) {
        const from = new Date(fromDate.value);
        const to = new Date(toDate.value);
        toast.removeAllGroups();

        if (from > to) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'La fecha de inicio no puede ser mayor que la fecha de fin.',
                life: 2000
            });
            return false;
        }
    }
    return true;
};
const resetDates = () => {
    fromDate.value = null;
    toDate.value = null;
    page.value = 1;
    loadLogs();
};
const formmatterDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours());
    return newDate;
};
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const loadLogs = async () => {
    if (!validateDates()) return;
    try {
        const params = {
            page: page.value,
            limit: limit.value
        };

        if (fromDate.value) {
            params.from = formatDate(fromDate.value);
        }

        if (toDate.value) {
            params.to = formatDate(toDate.value);
        }
        const { logs, totalRecords } = await fetchLogs(params);
        total.value = totalRecords || 0;
        logsData.value = logs.map((log) => ({
            ...log,
            createdAt: formmatterDate(log.createdAt)
        }));
    } catch (err) {
        console.error(err);
    }
};
const onPageChange = (event) => {
    page.value = event.page + 1;
    limit.value = event.rows;
    loadLogs();
};

const disableButtom = computed(() => !fromDate.value || !toDate.value);
onMounted(() => {
    loadLogs();
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Log History</div>
        <div class="flex mb-4">
            <div class="mr-4">
                <span>From: </span>
                <DatePicker id="datepicker-12h" v-model="fromDate" showIcon showTime hourFormat="12" />
            </div>
            <div>
                <span>To: </span>
                <DatePicker id="datepicker-12h" v-model="toDate" showIcon showTime hourFormat="12" />
            </div>
            <Button label="Filter" icon="pi pi-filter" class="ml-4" @click="loadLogs" :disabled="disableButtom" />
            <Button label="Reload" @click="resetDates" class="ml-2" severity="secondary" />
        </div>
        <DataTable :value="logsData" :paginator="true" :rows="limit" :first="(page - 1) * limit" :totalRecords="total" :rowsPerPageOptions="[10, 20, 50]" :lazy="true" @page="onPageChange" responsiveLayout="scroll" v-model:filters="filters">
            <template #header>
                <div class="flex justify-end">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <Column field="id" header="ID" :sortable="true" style="width: 20%" :filter="true" :filterMatchMode="'contains'"></Column>
            <Column field="serviceName" header="Service Name" :sortable="true" style="width: 30%" :filter="true" :filterMatchMode="'contains'"></Column>
            <Column field="ipAddress" header="IP Address" :sortable="true" style="width: 30%" :filter="true" :filterMatchMode="'contains'"></Column>
            <Column field="createdAt" header="Date of Call" :sortable="true" style="width: 40%" :filter="true" :filterMatchMode="'contains'">
                <template #body="slotProps">
                    {{ slotProps.data.createdAt.toLocaleString() }}
                </template>
            </Column>
        </DataTable>
        <Toast />
    </div>
</template>
