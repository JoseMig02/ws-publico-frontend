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
                    <span class="block text-muted-color text-xl mb-4">Financial Health</span>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-2xl">{{ count }}</div>
                </div>
                <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                    <i class="pi pi-briefcase text-green-500 !text-xl"></i>
                </div>
            </div>
            <span class="text-primary font-medium">{{ count }} </span>
            <span class="text-muted-color"> calls this week</span>
        </div>
    </div>
</template>
