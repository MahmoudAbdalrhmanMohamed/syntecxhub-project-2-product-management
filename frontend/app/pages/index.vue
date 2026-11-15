<script setup lang="ts">
import { Package, DollarSign, AlertTriangle, RefreshCw, ArrowUpRight } from 'lucide-vue-next';

useSeoMeta({
  title: 'Product Inventory Analytics — Project 2',
  description: 'Executive overview of SKU inventory, stock valuation, and category distribution.',
});

const dashboardStore = useDashboardStore();
const { formatCurrency } = useFormatters();

await useAsyncData('project2-dashboard', async () => {
  await dashboardStore.fetchDashboardData();
  return true;
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Project 2: Product &amp; SKU Inventory Overview
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time SKU counts, stock alerts, and category valuation metrics from NestJS.
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <button type="button" class="btn-secondary" @click="dashboardStore.fetchDashboardData()">
          <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
          Refresh
        </button>
        <NuxtLink to="/products" class="btn-primary">
          Open Product Catalog
          <ArrowUpRight class="h-4 w-4" />
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Catalog SKUs</span>
          <Package class="h-4 w-4 text-sky-500" />
        </div>
        <p class="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
          {{ dashboardStore.stats?.summary.totalProducts ?? 0 }}
        </p>
      </div>
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Inventory Valuation</span>
          <DollarSign class="h-4 w-4 text-emerald-500" />
        </div>
        <p class="mt-3 text-2xl font-bold font-mono text-emerald-500">
          {{ formatCurrency(dashboardStore.stats?.summary.totalInventoryValue) }}
        </p>
      </div>
      <div class="surface-card p-5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Low / Out of Stock</span>
          <AlertTriangle class="h-4 w-4 text-amber-500" />
        </div>
        <p class="mt-3 text-2xl font-bold text-amber-500">
          {{ (dashboardStore.stats?.summary.lowStockProducts ?? 0) + (dashboardStore.stats?.summary.outOfStockProducts ?? 0) }}
        </p>
      </div>
    </div>

    <div class="surface-card p-5">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
        Recently Added Products
      </h3>
      <div class="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
        <div
          v-for="p in dashboardStore.stats?.recent.products || []"
          :key="p._id"
          class="flex items-center justify-between py-3"
        >
          <div>
            <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ p.name }}</p>
            <p class="text-[11px] font-mono text-slate-500">{{ p.sku }} • {{ p.category }} • {{ p.stockQuantity }} units</p>
          </div>
          <span class="font-mono text-xs font-bold text-slate-900 dark:text-white">
            {{ formatCurrency(p.price) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
