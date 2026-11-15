<script setup lang="ts">
import {
  LayoutDashboard,
  Package,
  Settings,
  FileCode2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Boxes,
  X,
  Cpu,
  Layers,
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUiStore();
const colorMode = useColorMode();
const productsStore = useProductsStore();

const navigationGroups = [
  {
    groupTitle: 'WAREHOUSE & CATALOG',
    items: [
      { label: 'Inventory Telemetry', to: '/', icon: LayoutDashboard },
      { label: 'Product & SKU Catalog', to: '/products', icon: Package, count: computed(() => productsStore.totalProducts || 4) },
    ],
  },
  {
    groupTitle: 'OPERATIONS',
    items: [
      { label: 'Warehouse Rules', to: '/settings', icon: Settings },
      { label: 'Hardware REST API', to: '/api-docs', icon: FileCode2 },
    ],
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
    class="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
    @click="uiStore.closeMobileSidebar"
  />

  <aside
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200/90 dark:border-emerald-950/70 bg-white dark:bg-[#070D14] transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0"
    :class="[
      uiStore.sidebarCollapsed ? 'w-20' : 'w-64',
      uiStore.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Brand Header -->
    <div
      class="flex h-16 items-center border-b border-slate-200/90 dark:border-emerald-950/70 transition-all duration-200"
      :class="uiStore.sidebarCollapsed ? 'justify-center px-2 relative' : 'justify-between px-4'"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-3 min-w-0"
        :title="uiStore.sidebarCollapsed ? 'Syntecxhub SKU Inventory' : undefined"
      >
        <BrandProjectLogo :size="'md'" />
        <div v-if="!uiStore.sidebarCollapsed" class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white block font-mono">
              Syntecxhub
            </span>
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SKU
            </span>
          </div>
          <p class="truncate text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Inventory &amp; Telemetry
          </p>
        </div>
      </NuxtLink>

      <!-- Desktop Toggle Button -->
      <button
        type="button"
        class="hidden lg:inline-flex rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-all cursor-pointer"
        :class="
          uiStore.sidebarCollapsed
            ? 'absolute -right-3 top-5 z-50 h-6 w-6 rounded-full border border-slate-200 dark:border-emerald-900/80 bg-white dark:bg-[#0C151B] shadow-md p-0 items-center justify-center text-slate-400 hover:text-white'
            : 'p-1.5'
        "
        :title="uiStore.sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        @click="uiStore.toggleSidebar"
      >
        <PanelLeftOpen v-if="uiStore.sidebarCollapsed" class="h-3.5 w-3.5" />
        <PanelLeftClose v-else class="h-4 w-4" />
      </button>

      <!-- Mobile Close Button -->
      <button type="button" class="lg:hidden rounded-lg p-1.5 text-slate-400" @click="uiStore.closeMobileSidebar">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Grouped Navigation -->
    <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      <div v-for="group in navigationGroups" :key="group.groupTitle" class="space-y-1">
        <p
          v-if="!uiStore.sidebarCollapsed"
          class="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-300/50 font-mono"
        >
          {{ group.groupTitle }}
        </p>

        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :title="uiStore.sidebarCollapsed ? item.label : undefined"
          class="group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150"
          :class="[
            uiStore.sidebarCollapsed ? 'justify-center w-12 h-10 mx-auto px-0' : 'gap-3 px-3 py-2.5',
            isActive(item.to)
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-300',
          ]"
        >
          <component :is="item.icon" class="h-4 w-4 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed" class="truncate flex-1">{{ item.label }}</span>
          <span
            v-if="!uiStore.sidebarCollapsed && item.count"
            class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded"
            :class="isActive(item.to) ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-emerald-950/80 text-slate-600 dark:text-emerald-300'"
          >
            {{ item.count.value }} SKUs
          </span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Bottom Stock & Warehouse Telemetry Dock -->
    <div class="border-t border-slate-200/90 dark:border-emerald-950/70 p-3 space-y-2 bg-slate-50/50 dark:bg-[#050A10]/50">
      <div v-if="!uiStore.sidebarCollapsed" class="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50 flex items-center gap-2.5">
        <div class="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <div class="min-w-0 flex-1">
          <p class="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 truncate font-mono">AMS-01 PRIMARY VAULT</p>
          <p class="text-[10px] text-emerald-600 dark:text-emerald-400">Inventory Sync Online</p>
        </div>
      </div>

      <button
        type="button"
        class="flex items-center rounded-lg border border-slate-200 dark:border-emerald-950/80 bg-white dark:bg-[#0B141F] font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-400 transition-colors cursor-pointer"
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
          <Moon v-else class="h-4 w-4 text-emerald-600 shrink-0" />
          <span v-if="!uiStore.sidebarCollapsed">{{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
        </span>
      </button>
    </div>
  </aside>
</template>
