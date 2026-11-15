<script setup lang="ts">
import {
  Package,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  Boxes,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-vue-next';

useSeoMeta({
  title: 'Inventory Telemetry — SKU Nexus Project 2',
  description: 'Industrial hardware and cloud SKU inventory, stock valuation, and warehouse telemetry.',
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
    <!-- Industrial Hardware Header Banner -->
    <div class="relative overflow-hidden rounded-2xl border border-emerald-200/80 dark:border-emerald-950/80 bg-gradient-to-r from-emerald-950/40 via-teal-900/20 to-transparent p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold">
            <Cpu class="h-3.5 w-3.5 text-emerald-500" />
            <span>WAREHOUSE AMS-01 // STOCK TELEMETRY</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
            Product &amp; SKU Inventory Overview
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Live catalog valuation, hardware appliances, zero-trust cryptographic HSMs, and enterprise cloud licenses managed across primary warehouse nodes.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button type="button" class="btn-secondary" @click="dashboardStore.fetchDashboardData()">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
            Sync Stock
          </button>
          <NuxtLink to="/products" class="btn-primary">
            <span>Open Catalog</span>
            <ArrowUpRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Inventory KPIs -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Catalog SKUs</span>
          <div class="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Boxes class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
          {{ dashboardStore.stats?.summary.totalProducts ?? 0 }}
        </p>
        <p class="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
          <Sparkles class="h-3 w-3" /> Active Infrastructure SKUs
        </p>
      </div>

      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Inventory Valuation</span>
          <div class="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <DollarSign class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
          {{ formatCurrency(dashboardStore.stats?.summary.totalInventoryValue) }}
        </p>
        <p class="mt-1 text-xs text-emerald-600/80 font-mono">
          Capital Assets Invested
        </p>
      </div>

      <div class="surface-card p-5 group">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Low Stock Reorder Alerts</span>
          <div class="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold font-mono text-amber-500 tracking-tight">
          {{ dashboardStore.stats?.summary.lowStockCount ?? 0 }}
        </p>
        <p class="mt-1 text-xs text-amber-500/80 font-mono">
          Below Minimum Buffer
        </p>
      </div>
    </div>

    <!-- Category Breakdown Matrix -->
    <div class="surface-card p-6">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-emerald-950/70 pb-4">
        <div class="flex items-center gap-2.5">
          <div class="h-2 w-2 rounded-full bg-emerald-500" />
          <h3 class="text-sm font-bold font-mono text-slate-900 dark:text-white uppercase tracking-wider">
            Inventory Valuation by Equipment Category
          </h3>
        </div>
        <span class="text-xs font-mono text-emerald-500">Live Breakdown</span>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="cat in dashboardStore.stats?.categories || []"
          :key="cat._id"
          class="rounded-xl border border-slate-200/80 dark:border-emerald-950/80 bg-slate-50/60 dark:bg-[#070D14] p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              {{ cat._id }}
            </span>
            <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {{ cat.count }} Items
            </span>
          </div>

          <div class="space-y-1">
            <p class="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              {{ formatCurrency(cat.totalValue) }}
            </p>
            <p class="text-[11px] text-slate-500 font-mono">
              Units in stock: <span class="font-bold text-slate-700 dark:text-slate-300">{{ cat.totalStock }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
