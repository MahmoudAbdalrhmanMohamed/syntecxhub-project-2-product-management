<template>
  <div class="flex flex-col min-h-screen bg-[#F0F4F8] dark:bg-[#070D14] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
    <!-- Top Live Warehouse Telemetry Ribbon -->
    <div class="h-8 border-b border-emerald-200 dark:border-emerald-950/90 bg-emerald-50/80 dark:bg-[#04080D] px-4 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-400 select-none overflow-x-auto whitespace-nowrap z-50">
      <div class="flex items-center gap-4">
        <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          LIVE TELEMETRY
        </span>
        <span class="text-slate-300 dark:text-emerald-950">│</span>
        <span>CLUSTER: <strong class="text-slate-800 dark:text-slate-200">AMS-01 PRIMARY VAULT</strong></span>
        <span class="text-slate-300 dark:text-emerald-950">│</span>
        <span>LATENCY: <strong class="text-emerald-600 dark:text-emerald-400">14ms</strong></span>
        <span class="text-slate-300 dark:text-emerald-950">│</span>
        <span>STATUS: <strong class="text-slate-800 dark:text-slate-200">12 NODES ONLINE</strong></span>
      </div>
      <div class="flex items-center gap-4 hidden sm:flex">
        <span>VALUATION: <strong class="text-emerald-600 dark:text-emerald-400">$1,428,950</strong></span>
        <span class="text-slate-300 dark:text-emerald-950">│</span>
        <span>HEALTH: <strong class="text-emerald-600 dark:text-emerald-300">98.4% NOMINAL</strong></span>
      </div>
    </div>

    <!-- Main Workspace with Sidebar and Content -->
    <div class="flex flex-1 min-h-[calc(100vh-2rem)]">
      <LayoutAppSidebar />

      <div class="flex min-w-0 flex-1 flex-col">
        <LayoutAppTopbar />

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1680px] w-full mx-auto">
          <slot />
        </main>
      </div>
    </div>

    <UiToastContainer />
    <UiConfirmDialog />
  </div>
</template>
