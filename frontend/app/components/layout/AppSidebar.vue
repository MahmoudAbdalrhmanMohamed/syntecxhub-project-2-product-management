<script setup lang="ts">
import {
  Boxes,
  Package,
  Settings,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Truck,
  Cpu,
  Radio,
  Warehouse,
  X,
  Gauge,
  SlidersHorizontal,
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUiStore();
const colorMode = useColorMode();
const productsStore = useProductsStore();

const industrialNav = [
  {
    moduleCode: 'MOD-01',
    label: 'Inventory Telemetry',
    to: '/',
    icon: Gauge,
    badge: 'REALTIME',
  },
  {
    moduleCode: 'MOD-02',
    label: 'Hardware & SKU Catalog',
    to: '/products',
    icon: Package,
    count: computed(() => productsStore.totalProducts || 4),
  },
  {
    moduleCode: 'MOD-03',
    label: 'Warehouse & Bin Rules',
    to: '/settings',
    icon: Warehouse,
    badge: 'ZONE-A',
  },
  {
    moduleCode: 'MOD-04',
    label: 'Telemetry API & Docs',
    to: '/api-docs',
    icon: FileCode2,
    badge: 'REST',
  },
];

const isActive = (target: string) => {
  if (target === '/') return route.path === '/';
  return route.path.startsWith(target);
};

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <div
    v-if="uiStore.mobileSidebarOpen"
    class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
    @click="uiStore.closeMobileSidebar"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-emerald-950/80 bg-[#070D12] transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0"
    :class="[
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Industrial Telemetry Brand Header -->
    <div
      class="flex h-16 items-center border-b border-emerald-950/80 bg-[#050A0E] transition-all duration-200"
      :class="uiStore.sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'"
    >
      <NuxtLink
        v-if="!uiStore.sidebarCollapsed"
        to="/"
        class="flex items-center min-w-0 gap-3"
      >
        <BrandProjectLogo :size="'md'" />
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-sm font-bold font-mono tracking-tight text-white block">
              Titan
            </span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              LOGISTICS
            </span>
          </div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p class="truncate text-[10px] font-mono text-slate-400 font-medium">
              CLUSTER: NORTH-EAST // LIVE
            </p>
          </div>
        </div>
      </NuxtLink>

      <!-- Collapsed State Header: Isometric Logo with Quick Rail Expand Toggle -->
      <button
        v-else
        type="button"
        class="group/rail flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-950/80 bg-[#081216] hover:border-emerald-500 hover:bg-emerald-950/70 transition-all cursor-pointer shadow-sm relative"
        title="Expand Sidebar (Ctrl+B)"
        aria-label="Expand Sidebar"
        @click="uiStore.toggleSidebar"
      >
        <BrandProjectLogo :size="'sm'" class="transition-opacity duration-150 group-hover/rail:opacity-0" />
        <PanelLeftOpen class="absolute h-5 w-5 text-emerald-400 opacity-0 group-hover/rail:opacity-100 transition-opacity duration-150" />
      </button>

      <!-- Desktop Collapse Button (Expanded State) -->
      <button
        v-if="!uiStore.sidebarCollapsed"
        type="button"
        class="hidden lg:inline-flex rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-emerald-950/60 transition-all cursor-pointer font-mono"
        title="Collapse Sidebar (Ctrl+B)"
        aria-label="Collapse Sidebar"
        @click="uiStore.toggleSidebar"
      >
        <PanelLeftClose class="h-4 w-4" />
      </button>

      <!-- Mobile Close Button -->
      <button type="button" class="lg:hidden rounded-lg p-1.5 text-slate-400" @click="uiStore.closeMobileSidebar">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Telemetry Status Ribbon (Expanded) -->
    <div
      v-if="!uiStore.sidebarCollapsed"
      class="border-b border-emerald-950/60 bg-emerald-950/20 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-emerald-300/80"
    >
      <span class="flex items-center gap-1.5">
        <Radio class="h-3 w-3 text-emerald-400 animate-pulse" />
        <span>NODE: LOG-HQ-01</span>
      </span>
      <span class="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
        LATENCY 12ms
      </span>
    </div>

    <!-- Navigation List (Industrial Style) -->
    <nav class="flex-1 space-y-2 overflow-y-auto px-3 py-4">
      <div v-if="!uiStore.sidebarCollapsed" class="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
        OPERATIONAL MODULES
      </div>

      <NuxtLink
        v-for="item in industrialNav"
        :key="item.to"
        :to="item.to"
        :title="uiStore.sidebarCollapsed ? item.label : undefined"
        class="group relative flex items-center rounded-xl text-xs sm:text-sm font-medium transition-all duration-150"
        :class="[
          uiStore.sidebarCollapsed ? 'justify-center w-12 h-10 mx-auto px-0' : 'gap-3 px-3 py-2.5',
          isActive(item.to)
            ? 'bg-emerald-600/90 text-white shadow-md shadow-emerald-600/20 border border-emerald-400/40'
            : 'text-slate-300 hover:bg-emerald-950/40 hover:text-white',
        ]"
      >
        <component
          :is="item.icon"
          class="h-4 w-4 shrink-0 transition-colors"
          :class="isActive(item.to) ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-300'"
        />
        
        <div v-if="!uiStore.sidebarCollapsed" class="flex-1 min-w-0">
          <p class="truncate font-mono">{{ item.label }}</p>
          <p class="text-[10px] text-slate-500 font-mono">{{ item.moduleCode }}</p>
        </div>

        <!-- Count badge -->
        <span
          v-if="!uiStore.sidebarCollapsed && item.count"
          class="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
          :class="isActive(item.to) ? 'bg-emerald-800 text-white' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'"
        >
          {{ item.count.value }} SKUs
        </span>

        <!-- Badge -->
        <span
          v-else-if="!uiStore.sidebarCollapsed && item.badge"
          class="text-[9px] font-mono px-1.5 py-0.5 rounded"
          :class="isActive(item.to) ? 'bg-emerald-800 text-white' : 'bg-emerald-950/40 text-emerald-400'"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <!-- Bottom Warehouse Bay Capacity Dock -->
    <div class="border-t border-emerald-950/80 p-3 space-y-2.5 bg-[#050A0E]">
      <!-- Warehouse Bay Load Meters -->
      <div v-if="!uiStore.sidebarCollapsed" class="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 space-y-2 font-mono">
        <div class="flex items-center justify-between text-[11px] font-semibold text-emerald-300">
          <span class="flex items-center gap-1.5">
            <Warehouse class="h-3.5 w-3.5 text-emerald-400" />
            <span>Bay Load Distribution</span>
          </span>
          <span class="text-xs font-bold text-white">63%</span>
        </div>

        <div class="space-y-1.5 text-[10px] text-slate-400">
          <div class="flex items-center justify-between">
            <span>Bay Alpha (Servers)</span>
            <span class="text-emerald-400 font-bold">84%</span>
          </div>
          <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 rounded-full w-[84%]" />
          </div>

          <div class="flex items-center justify-between">
            <span>Bay Bravo (HSM / Security)</span>
            <span class="text-amber-400 font-bold">42%</span>
          </div>
          <div class="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-amber-500 rounded-full w-[42%]" />
          </div>
        </div>
      </div>

      <!-- Rail Expand / Collapse Toggle -->
      <button
        type="button"
        class="flex items-center rounded-xl border border-emerald-950/80 bg-[#0A121A] font-medium font-mono text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer"
        :class="
          uiStore.sidebarCollapsed
            ? 'w-12 h-10 mx-auto justify-center px-0'
            : 'w-full justify-between px-3 py-2 text-xs'
        "
        :title="uiStore.sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'"
        aria-label="Toggle Sidebar Rail"
        @click="uiStore.toggleSidebar"
      >
        <span class="flex items-center gap-2">
          <PanelLeftOpen v-if="uiStore.sidebarCollapsed" class="h-4 w-4 text-emerald-400 shrink-0" />
          <PanelLeftClose v-else class="h-4 w-4 shrink-0 text-slate-400" />
          <span v-if="!uiStore.sidebarCollapsed">Collapse Terminal</span>
        </span>
        <kbd v-if="!uiStore.sidebarCollapsed" class="hidden sm:inline font-mono text-[10px] text-slate-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/60">Ctrl+B</kbd>
      </button>

      <button
        type="button"
        class="flex items-center rounded-xl border border-emerald-950/80 bg-[#0A121A] font-medium font-mono text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer"
        :class="
          uiStore.sidebarCollapsed
            ? 'w-12 h-10 mx-auto justify-center px-0'
            : 'w-full justify-between px-3 py-2 text-xs'
        "
        :title="colorMode.value === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleTheme"
      >
        <span class="flex items-center gap-2">
          <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4 text-amber-400 shrink-0" />
          <Moon v-else class="h-4 w-4 text-emerald-400 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed">{{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
        </span>
      </button>
    </div>
  </aside>
</template>