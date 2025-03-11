<script setup>
defineProps({
    count: {
        type: Number,
        required: true
    }
});
</script>

<template>
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <span class="block text-muted-color text-xl mb-4">Exchange Rate</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-2xl">{{ count }}</div>
                </div>
                <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-wallet text-blue-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ count }}</span>
            <span class="text-muted-color"> calls this week</span>
        </div>
    </div>
</template>
