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
  Warehouse,
  Truck,
  Gauge,
  Activity,
  CheckCircle2,
} from 'lucide-vue-next';

useSeoMeta({
  title: 'Inventory Telemetry — Titan Logistics',
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
    <!-- Industrial Operations Command Ribbon -->
    <div class="relative overflow-hidden rounded-2xl border border-emerald-950/80 bg-gradient-to-r from-[#071311] via-[#0A1A18] to-[#060D12] p-6 sm:p-7 shadow-lg shadow-emerald-950/30">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <Cpu class="h-3.5 w-3.5 text-emerald-400" />
              <span>TITAN LOGISTICS // HARDWARE FLEET TELEMETRY</span>
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              WAREHOUSE CLUSTER 04 // ACTIVE
            </span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Industrial Hardware &amp; SKU Inventory
          </h2>
          <p class="text-xs sm:text-sm text-slate-300 max-w-2xl font-mono leading-relaxed">
            Live catalog valuation, hardware appliances, cryptographic HSM modules, and enterprise licenses tracked across global logistics nodes.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button type="button" class="btn-secondary text-xs sm:text-sm font-mono" @click="dashboardStore.fetchDashboardData()">
            <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': dashboardStore.loading }" />
            <span>Sync Telemetry</span>
          </button>
          <NuxtLink to="/products" class="btn-primary text-xs sm:text-sm font-mono">
            <Package class="h-4 w-4" />
            <span>Open SKU Catalog</span>
            <ArrowUpRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Inventory Telemetry Gauges (3 Columns Industrial Layout) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <!-- Total Catalog SKUs -->
      <div class="surface-card rounded-xl border border-emerald-950/80 bg-[#091118] p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all font-mono">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Tracked Hardware SKUs</span>
          <div class="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Boxes class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-white tracking-tight">
          {{ dashboardStore.stats?.summary.totalProducts ?? 0 }} <span class="text-xs font-normal text-slate-400">SKUs</span>
        </p>
        <div class="mt-2 flex items-center justify-between text-xs text-emerald-400">
          <span class="flex items-center gap-1"><Sparkles class="h-3 w-3" /> Fully Tagged</span>
          <span class="text-slate-500">BAYS: ALL</span>
        </div>
      </div>

      <!-- Inventory Valuation -->
      <div class="surface-card rounded-xl border border-emerald-950/80 bg-[#091118] p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all font-mono">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Capital Asset Valuation</span>
          <div class="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-emerald-400 tracking-tight">
          {{ formatCurrency(dashboardStore.stats?.summary.totalInventoryValue) }}
        </p>
        <div class="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Enterprise Index</span>
          <span class="text-emerald-400">USD CURRENCY</span>
        </div>
      </div>

      <!-- Reorder Alerts -->
      <div class="surface-card rounded-xl border border-amber-950/80 bg-[#091118] p-5 relative overflow-hidden group hover:border-amber-500/50 transition-all font-mono">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Stock Reorder Alerts</span>
          <div class="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-3 text-3xl font-extrabold text-amber-400 tracking-tight">
          {{ dashboardStore.stats?.summary.lowStockProducts ?? 0 }}
        </p>
        <div class="mt-2 flex items-center justify-between text-xs text-amber-400/80">
          <span>Threshold &lt; 5 units</span>
          <span class="text-slate-500">DEFICIT 0</span>
        </div>
      </div>
    </div>

    <!-- Main Operational Split: Hardware SKU Telemetry Ledger & Logistics Stream -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left 2 Cols: Hardware Categories & Category Distribution -->
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-xl border border-emerald-950/80 bg-[#081017] p-5 sm:p-6 shadow-sm font-mono">
          <div class="flex items-center justify-between pb-4 border-b border-emerald-950/80">
            <div>
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <Layers class="h-4 w-4 text-emerald-400" />
                <span>Hardware Category Breakdown</span>
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                Distribution of appliance stock and warehouse bin volume.
              </p>
            </div>
            <span class="text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-900/50">
              AUDITED
            </span>
          </div>

          <!-- Category Bars Grid -->
          <div class="mt-5 space-y-4">
            <div
              v-for="cat in (dashboardStore.stats?.distributions?.productsByCategory ?? [])"
              :key="cat.category"
              class="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/30 hover:border-emerald-500/40 transition-colors"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-200 uppercase tracking-wider">{{ cat.category }}</span>
                <span class="font-bold text-emerald-400">
                  {{ cat.count }} SKU(s) • {{ formatCurrency(cat.totalValue) }}
                </span>
              </div>
              <div class="mt-2.5 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  :style="{ width: `${Math.min(100, (cat.count / (dashboardStore.stats?.summary.totalProducts || 1)) * 100)}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Warehouse Operational Directives -->
        <div class="rounded-xl border border-emerald-950/80 bg-[#081017] p-5 sm:p-6 shadow-sm font-mono">
          <div class="flex items-center justify-between pb-4 border-b border-emerald-950/80">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <Warehouse class="h-4 w-4 text-teal-400" />
              <span>Logistics Operational Protocols</span>
            </h3>
            <span class="text-xs text-emerald-400">ACTIVE</span>
          </div>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-emerald-950/15 border border-emerald-900/40">
              <p class="font-bold text-slate-200">Zero-Trust HSM Protocol</p>
              <p class="text-[11px] text-slate-400 mt-1">Dual-operator verification required for physical extraction from Bay Alpha.</p>
            </div>
            <div class="p-3 rounded-lg bg-emerald-950/15 border border-emerald-900/40">
              <p class="font-bold text-slate-200">Automated Restock Threshold</p>
              <p class="text-[11px] text-slate-400 mt-1">Suppliers dispatched automatically when inventory reaches 3 units.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Industrial Logistics Telemetry Log -->
      <div class="rounded-xl border border-emerald-950/80 bg-[#081017] p-5 sm:p-6 shadow-sm flex flex-col font-mono">
        <div class="flex items-center justify-between pb-4 border-b border-emerald-950/80">
          <div>
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <Truck class="h-4 w-4 text-emerald-400" />
              <span>Dispatch &amp; Stock Ledger</span>
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">Live inventory movements.</p>
          </div>
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div class="mt-4 flex-1 space-y-3.5 overflow-y-auto custom-scrollbar pr-1.5 max-h-[500px]">
          <div
            v-for="(item, idx) in (dashboardStore.activity ?? [])"
            :key="idx"
            class="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs space-y-1.5"
          >
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-emerald-400 font-bold uppercase">
                {{ item.type || 'STOCK_EVENT' }}
              </span>
              <span class="text-[10px] text-slate-500">
                {{ item.timestamp || 'RECENT' }}
              </span>
            </div>
            <p class="font-semibold text-slate-200 truncate">
              {{ item.title }}
            </p>
            <div class="flex items-center justify-between text-[10px] text-slate-400">
              <span>{{ item.description }}</span>
              <span class="text-emerald-400 font-bold">LOGGED</span>
            </div>
          </div>

          <div
            v-if="!dashboardStore.activity?.length"
            class="text-center py-12 text-slate-500 text-xs"
          >
            No active dispatch operations in current buffer.
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-emerald-950/80 flex items-center justify-between text-xs">
          <NuxtLink to="/products" class="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            <span>Inspect Product Grid</span>
            <ArrowUpRight class="h-3 w-3" />
          </NuxtLink>
          <span class="text-[10px] text-slate-500">TERMINAL NOMINAL</span>
        </div>
      </div>
    </div>
  </div>
</template>