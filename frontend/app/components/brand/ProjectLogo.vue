<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Isometric Nexus Emblem -->
    <div
      class="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-950/40 to-slate-950 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 overflow-hidden"
      :class="[
        size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10',
      ]"
    >
      <svg
        viewBox="0 0 64 64"
        class="h-full w-full p-1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="p2Top" x1="12" y1="10" x2="52" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#34D399" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>
          <linearGradient id="p2Left" x1="12" y1="21" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#059669" />
            <stop offset="100%" stop-color="#064E3B" />
          </linearGradient>
          <linearGradient id="p2Right" x1="32" y1="21" x2="52" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#10B981" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
        </defs>

        <!-- Top Face -->
        <path d="M32 10 L52 21 L32 32 L12 21 Z" fill="url(#p2Top)" stroke="#6EE7B7" stroke-width="1.5" />
        
        <!-- Left Face -->
        <path d="M12 21 L32 32 V54 L12 43 Z" fill="url(#p2Left)" stroke="#34D399" stroke-width="1.5" />
        
        <!-- Right Face -->
        <path d="M32 32 L52 21 V43 L32 54 Z" fill="url(#p2Right)" stroke="#10B981" stroke-width="1.5" />

        <!-- Center Telemetry Micro-Core -->
        <circle cx="32" cy="32" r="3.5" fill="#F59E0B" />
        
        <!-- Telemetry Lines -->
        <line x1="32" y1="18" x2="32" y2="28" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" />
        <line x1="20" y1="39" x2="28" y2="35" stroke="#6EE7B7" stroke-width="2" stroke-linecap="round" />
        <line x1="44" y1="39" x2="36" y2="35" stroke="#6EE7B7" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Brand Typography -->
    <div v-if="showText" class="min-w-0">
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
  </div>
</template>
