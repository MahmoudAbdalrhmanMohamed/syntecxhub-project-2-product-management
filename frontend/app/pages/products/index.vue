<script setup lang="ts">
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  X,
  Tag,
  Boxes,
  DollarSign,
} from 'lucide-vue-next';
import { useDebounceFn } from '@vueuse/core';
import type { ProductFormPayload, ProductRecord } from '#shared/types/api';
import { productFormSchema } from '#shared/validation/schemas';

useSeoMeta({
  title: 'Product Inventory',
  description: 'Manage enterprise hardware and software SKUs, pricing, categories, and stock quantities.',
});

const productsStore = useProductsStore();
const toast = useToast();
const confirmDialog = useConfirm();
const { formatCurrency, formatDate, formatDateTime } = useFormatters();
const { resolveAssetUrl, extractApiErrorMessage } = useApiClient();

await useAsyncData('products-catalog', async () => {
  await Promise.all([
    productsStore.fetchCategories(),
    productsStore.fetchProducts(),
  ]);
  return true;
});

const debouncedSearch = useDebounceFn(() => {
  productsStore.filters.page = 1;
  productsStore.fetchProducts();
}, 300);

const handleFilterChange = () => {
  productsStore.filters.page = 1;
  productsStore.fetchProducts();
};

const handlePageChange = (page: number) => {
  productsStore.filters.page = page;
  productsStore.fetchProducts();
};

// Create / Edit Product Modal
const isModalOpen = ref(false);
const editingProduct = ref<ProductRecord | null>(null);
const formErrors = ref<Record<string, string>>({});
const serverError = ref<string | null>(null);

const formState = reactive<ProductFormPayload>({
  name: '',
  sku: '',
  price: 499,
  description: '',
  category: 'Network Hardware',
  image: 'http://localhost:4000/uploads/product-gateway-x1.svg',
  stockQuantity: 25,
  status: 'in_stock',
});

const presetImages = [
  { label: 'Edge Gateway X1', url: 'http://localhost:4000/uploads/product-gateway-x1.svg' },
  { label: 'NexusCore Switch 48G', url: 'http://localhost:4000/uploads/product-rack-switch-48.svg' },
  { label: 'VaultGuard HSM', url: 'http://localhost:4000/uploads/product-zero-trust-hsm.svg' },
  { label: 'DevForge Workstation', url: 'http://localhost:4000/uploads/product-workstation-z9.svg' },
  { label: 'PulseSense IoT Hub', url: 'http://localhost:4000/uploads/product-iot-telemetry-hub.svg' },
  { label: 'CloudMesh License', url: 'http://localhost:4000/uploads/product-cloud-mesh-license.svg' },
  { label: 'HyperFlash NVMe SAN', url: 'http://localhost:4000/uploads/product-nvme-san-array.svg' },
];

const openCreateModal = () => {
  editingProduct.value = null;
  formErrors.value = {};
  serverError.value = null;
  formState.name = '';
  formState.sku = `SYN-PRD-${Math.floor(1000 + Math.random() * 9000)}`;
  formState.price = 1250;
  formState.description = '';
  formState.category = productsStore.categories[0] || 'Network Hardware';
  formState.image = 'http://localhost:4000/uploads/product-gateway-x1.svg';
  formState.stockQuantity = 20;
  formState.status = 'in_stock';
  isModalOpen.value = true;
};

const openEditModal = (product: ProductRecord) => {
  editingProduct.value = product;
  formErrors.value = {};
  serverError.value = null;
  formState.name = product.name;
  formState.sku = product.sku;
  formState.price = product.price;
  formState.description = product.description;
  formState.category = product.category;
  formState.image = product.image;
  formState.stockQuantity = product.stockQuantity;
  formState.status = product.status;
  isModalOpen.value = true;
};

const handleSaveProduct = async () => {
  formErrors.value = {};
  serverError.value = null;

  const parsed = productFormSchema.safeParse(formState);
  if (!parsed.success) {
    const errs: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] || 'form');
      if (!errs[k]) errs[k] = issue.message;
    }
    formErrors.value = errs;
    return;
  }

  try {
    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value._id, parsed.data);
      toast.success('Product Updated', `${parsed.data.name} (${parsed.data.sku}) updated.`);
    } else {
      await productsStore.createProduct(parsed.data);
      toast.success('Product Added', `${parsed.data.name} added to inventory.`);
    }
    isModalOpen.value = false;
  } catch (err: unknown) {
    const msg = extractApiErrorMessage(err);
    serverError.value = msg;
    toast.error('Failed to Save Product', msg);
  }
};

// Details Drawer
const inspectedProduct = ref<ProductRecord | null>(null);

// Delete Confirmation
const handleDeleteProduct = async (product: ProductRecord) => {
  const confirmed = await confirmDialog.ask({
    title: 'Remove Inventory SKU',
    message: `Are you sure you want to permanently delete "${product.name}" (SKU: ${product.sku}) from inventory?`,
    confirmLabel: 'Delete SKU',
    variant: 'danger',
  });
  if (!confirmed) return;

  try {
    await productsStore.deleteProduct(product._id);
    if (inspectedProduct.value?._id === product._id) {
      inspectedProduct.value = null;
    }
    toast.success('Product Removed', `SKU ${product.sku} was deleted.`);
  } catch (err: unknown) {
    toast.error('Delete Failed', extractApiErrorMessage(err));
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'in_stock':
      return 'In Stock';
    case 'low_stock':
      return 'Low Stock';
    case 'out_of_stock':
      return 'Out of Stock';
    case 'archived':
      return 'Archived';
    default:
      return status;
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Product &amp; SKU Inventory
        </h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track hardware appliances, enterprise licenses, stock levels, and unit pricing.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <!-- View Mode Toggle (Table vs Grid) -->
        <div
          class="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1"
        >
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
            :class="
              productsStore.viewMode === 'table'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="productsStore.viewMode = 'table'"
          >
            <List class="h-3.5 w-3.5" />
            Table
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors"
            :class="
              productsStore.viewMode === 'grid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            "
            @click="productsStore.viewMode = 'grid'"
          >
            <LayoutGrid class="h-3.5 w-3.5" />
            Cards
          </button>
        </div>

        <button type="button" class="btn-primary" @click="openCreateModal">
          <Plus class="h-4 w-4" />
          New Product
        </button>
      </div>
    </div>

    <!-- Filters Bar (Search, Category, Status, Price Range, Sort) -->
    <div class="surface-card p-4 space-y-3">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div class="relative lg:col-span-2">
          <Search
            class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            v-model="productsStore.filters.search"
            type="search"
            placeholder="Search by product name, SKU, or description..."
            class="input-field pl-10"
            @input="debouncedSearch"
          />
        </div>

        <UiCustomSelect
          v-model="productsStore.filters.category"
          :options="[
            { label: 'All Categories', value: '' },
            ...productsStore.categories.map((c) => ({ label: c, value: c })),
          ]"
          placeholder="All Categories"
          theme="emerald"
          class="w-full sm:w-48"
          @change="handleFilterChange"
        />

        <UiCustomSelect
          v-model="productsStore.filters.status"
          :options="[
            { label: 'All Stock Statuses', value: '' },
            { label: 'In Stock', value: 'in_stock' },
            { label: 'Low Stock', value: 'low_stock' },
            { label: 'Out of Stock', value: 'out_of_stock' },
            { label: 'Archived', value: 'archived' },
          ]"
          placeholder="All Stock Statuses"
          theme="emerald"
          class="w-full sm:w-48"
          @change="handleFilterChange"
        />

        <div class="flex items-center gap-2">
          <input
            v-model="productsStore.filters.minPrice"
            type="number"
            min="0"
            placeholder="Min $"
            class="input-field"
            @change="handleFilterChange"
          />
          <input
            v-model="productsStore.filters.maxPrice"
            type="number"
            min="0"
            placeholder="Max $"
            class="input-field"
            @change="handleFilterChange"
          />
        </div>

        <div class="flex items-center gap-2">
          <UiCustomSelect
            v-model="productsStore.filters.sortBy"
            :options="[
              { label: 'Newest First', value: 'createdAt' },
              { label: 'Price', value: 'price' },
              { label: 'Stock Units', value: 'stockQuantity' },
              { label: 'Name', value: 'name' },
            ]"
            theme="emerald"
            class="w-full sm:w-44"
            @change="handleFilterChange"
          />
          <button
            type="button"
            class="btn-secondary shrink-0 px-2.5"
            title="Toggle Sort Order"
            @click="
              productsStore.filters.sortOrder =
                productsStore.filters.sortOrder === 'asc' ? 'desc' : 'asc';
              handleFilterChange();
            "
          >
            <span class="font-mono text-xs uppercase">{{
              productsStore.filters.sortOrder
            }}</span>
          </button>
          <button
            type="button"
            class="btn-secondary shrink-0 px-2.5"
            title="Reset All Filters"
            @click="productsStore.resetFilters"
          >
            <RotateCcw class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading / Error / Empty States -->
    <div v-if="productsStore.loading" class="surface-card overflow-hidden">
      <UiTableSkeleton :rows="6" :columns="6" />
    </div>

    <div
      v-else-if="productsStore.error"
      class="surface-card p-8 text-center space-y-3"
    >
      <p class="text-sm font-semibold text-rose-500">{{ productsStore.error }}</p>
      <button type="button" class="btn-secondary" @click="productsStore.fetchProducts()">
        Retry
      </button>
    </div>

    <div v-else-if="productsStore.items.length === 0" class="surface-card p-6">
      <UiEmptyState
        title="No products match your filter criteria"
        description="Try widening your price range, clearing the category filter, or creating a new inventory item."
        action-label="Create Product"
        @action="openCreateModal"
      />
    </div>

    <!-- TABLE VIEW -->
    <div
      v-else-if="productsStore.viewMode === 'table'"
      class="surface-card overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              <th class="px-5 py-3.5">Product &amp; SKU</th>
              <th class="px-4 py-3.5">Category</th>
              <th class="px-4 py-3.5">Unit Price</th>
              <th class="px-4 py-3.5">Stock</th>
              <th class="px-4 py-3.5">Status</th>
              <th class="px-4 py-3.5">Updated</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-800/80 text-sm">
            <tr
              v-for="product in productsStore.items"
              :key="product._id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3.5">
                  <img
                    :src="resolveAssetUrl(product.image)"
                    :alt="product.name"
                    class="h-11 w-16 rounded-lg object-cover border border-slate-200 dark:border-slate-800 bg-slate-900 shrink-0"
                  />
                  <div class="min-w-0">
                    <button
                      type="button"
                      class="font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-500 text-left truncate block font-mono"
                      @click="inspectedProduct = product"
                    >
                      {{ product.name }}
                    </button>
                    <span class="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {{ product.sku }}
                    </span>
                  </div>
                </div>
              </td>

              <td class="px-4 py-3.5">
                <span class="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ product.category }}
                </span>
              </td>

              <td class="px-4 py-3.5 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                {{ formatCurrency(product.price) }}
              </td>

              <td class="px-4 py-3.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                {{ product.stockQuantity }} units
              </td>

              <td class="px-4 py-3.5">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="{
                    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400':
                      product.status === 'in_stock',
                    'bg-amber-500/10 text-amber-600 dark:text-amber-400':
                      product.status === 'low_stock',
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400':
                      product.status === 'out_of_stock',
                    'bg-slate-500/10 text-slate-500':
                      product.status === 'archived',
                  }"
                >
                  {{ statusLabel(product.status) }}
                </span>
              </td>

              <td class="px-4 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                {{ formatDate(product.updatedAt || product.createdAt) }}
              </td>

              <td class="px-5 py-3.5 text-right">
                <div class="inline-flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-500"
                    title="Inspect SKU"
                    @click="inspectedProduct = product"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500"
                    title="Edit SKU"
                    @click="openEditModal(product)"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
                    title="Delete SKU"
                    @click="handleDeleteProduct(product)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <UiPaginationBar :meta="productsStore.meta" @change="handlePageChange" />
    </div>

    <!-- GRID / CARD VIEW (INDUSTRIAL TELEMETRY HUD) -->
    <div v-else class="space-y-4">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="product in productsStore.items"
          :key="product._id"
          class="surface-card overflow-hidden flex flex-col justify-between group hover:border-emerald-500/60 hover:shadow-xl hover:shadow-emerald-950/30 transition-all border border-emerald-950/60 bg-[#0A121A]/80 relative"
        >
          <!-- Corner Technical Decal -->
          <div class="absolute top-0 right-0 w-8 h-8 pointer-events-none overflow-hidden">
            <div class="absolute transform rotate-45 bg-emerald-500/20 text-[8px] font-mono font-bold text-emerald-400 py-0.5 right-[-35px] top-[14px] w-[100px] text-center border-b border-emerald-500/30">
              HUD
            </div>
          </div>

          <div>
            <div class="relative aspect-16/10 w-full overflow-hidden bg-slate-950 border-b border-emerald-950/70">
              <img
                :src="resolveAssetUrl(product.image)"
                :alt="product.name"
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                class="absolute top-2.5 left-2.5 rounded px-2 py-0.5 text-[10px] font-mono font-bold backdrop-blur-md uppercase tracking-wider"
                :class="{
                  'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40':
                    product.status === 'in_stock',
                  'bg-amber-950/90 text-amber-300 border border-amber-500/40':
                    product.status === 'low_stock',
                  'bg-rose-950/90 text-rose-300 border border-rose-500/40':
                    product.status === 'out_of_stock',
                }"
              >
                {{ statusLabel(product.status) }}
              </span>
            </div>

            <div class="p-4 space-y-2.5">
              <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span class="text-emerald-400 font-bold tracking-wider flex items-center gap-1">
                  <span class="text-slate-600">|||</span> {{ product.sku }}
                </span>
                <span class="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[10px] border border-emerald-900/40 font-mono">{{ product.category }}</span>
              </div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 font-mono tracking-tight">
                {{ product.name }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {{ product.description }}
              </p>

              <!-- Stock Level Gauge Bar -->
              <div class="pt-1.5 space-y-1">
                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>BUFFER DENSITY</span>
                  <span class="text-emerald-400 font-bold">{{ product.stockQuantity }} UNITS</span>
                </div>
                <div class="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-emerald-950/40">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="product.stockQuantity < 10 ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'"
                    :style="{ width: `${Math.min(100, (product.stockQuantity / 60) * 100)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-emerald-950/70 bg-[#060B12]/80 px-4 py-3 flex items-center justify-between font-mono">
            <div>
              <p class="text-base font-extrabold text-emerald-400">
                {{ formatCurrency(product.price) }}
              </p>
              <p class="text-[10px] text-slate-500">
                LOC: AMS-RACK-{{ (product.sku || '01').slice(-2) }}
              </p>
            </div>

            <div class="flex items-center gap-1">
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-950/60 hover:text-emerald-400 transition-colors"
                title="Inspect SKU Telemetry"
                @click="inspectedProduct = product"
              >
                <Eye class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-950/60 hover:text-amber-400 transition-colors"
                title="Edit SKU"
                @click="openEditModal(product)"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                title="Delete SKU"
                @click="handleDeleteProduct(product)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="surface-card">
        <UiPaginationBar :meta="productsStore.meta" @change="handlePageChange" />
      </div>
    </div>

    <!-- Create / Edit Product Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      >
        <div class="surface-card w-full max-w-xl overflow-hidden shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ editingProduct ? 'Update Inventory SKU' : 'Create New Inventory SKU' }}
            </h3>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              @click="isModalOpen = false"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <form class="p-6 space-y-4 max-h-[82vh] overflow-y-auto" @submit.prevent="handleSaveProduct">
            <div
              v-if="serverError"
              class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-500"
            >
              {{ serverError }}
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  v-model="formState.name"
                  type="text"
                  placeholder="Titan Edge Gateway Pro X1"
                  class="input-field"
                />
                <p v-if="formErrors.name" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.name }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  SKU Code *
                </label>
                <input
                  v-model="formState.sku"
                  type="text"
                  placeholder="SYN-NET-8820"
                  class="input-field font-mono uppercase"
                />
                <p v-if="formErrors.sku" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.sku }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <UiCustomSelect
                  v-model="formState.category"
                  :options="productsStore.categories.map((c) => ({ label: c, value: c }))"
                  placeholder="Select Category"
                  theme="emerald"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Price (USD) *
                </label>
                <input
                  v-model.number="formState.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="input-field font-mono"
                />
                <p v-if="formErrors.price" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.price }}
                </p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Stock Quantity *
                </label>
                <input
                  v-model.number="formState.stockQuantity"
                  type="number"
                  min="0"
                  step="1"
                  class="input-field font-mono"
                />
                <p v-if="formErrors.stockQuantity" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.stockQuantity }}
                </p>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Description *
                </label>
                <textarea
                  v-model="formState.description"
                  rows="3"
                  placeholder="Detailed hardware or software specification..."
                  class="input-field"
                />
                <p v-if="formErrors.description" class="mt-1 text-xs text-rose-500">
                  {{ formErrors.description }}
                </p>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Image URL or Media Library Preset
                </label>
                <input
                  v-model="formState.image"
                  type="text"
                  class="input-field mb-2"
                />
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="preset in presetImages"
                    :key="preset.url"
                    type="button"
                    class="rounded border border-slate-200 dark:border-slate-800 px-2 py-1 text-[11px] text-slate-600 dark:text-slate-400 hover:border-sky-500 hover:text-sky-500"
                    @click="formState.image = preset.url"
                  >
                    {{ preset.label }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                class="btn-secondary"
                @click="isModalOpen = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="productsStore.submitting"
              >
                {{
                  productsStore.submitting
                    ? 'Saving...'
                    : editingProduct
                      ? 'Update SKU'
                      : 'Create SKU'
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Product Details Slide-over Drawer -->
    <Teleport to="body">
      <div
        v-if="inspectedProduct"
        class="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
        @click.self="inspectedProduct = null"
      >
        <div
          class="h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto flex flex-col justify-between shadow-2xl"
        >
          <div class="space-y-5">
            <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                SKU Specification Sheet
              </h3>
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                @click="inspectedProduct = null"
              >
                <X class="h-4 w-4" />
              </button>
            </div>

            <div class="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900">
              <img
                :src="resolveAssetUrl(inspectedProduct.image)"
                :alt="inspectedProduct.name"
                class="w-full h-48 object-cover"
              />
            </div>

            <div>
              <span class="font-mono text-xs text-sky-500 font-semibold">
                {{ inspectedProduct.sku }}
              </span>
              <h4 class="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {{ inspectedProduct.name }}
              </h4>
              <p class="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {{ inspectedProduct.description }}
              </p>
            </div>

            <div class="space-y-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4 text-xs">
              <div class="flex items-center justify-between py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <DollarSign class="h-3.5 w-3.5" /> Unit Price
                </span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">
                  {{ formatCurrency(inspectedProduct.price) }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <Boxes class="h-3.5 w-3.5" /> Stock Quantity
                </span>
                <span class="font-mono font-semibold text-slate-900 dark:text-white">
                  {{ inspectedProduct.stockQuantity }} units
                </span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-200/70 dark:border-slate-800/70">
                <span class="flex items-center gap-2 text-slate-500">
                  <Tag class="h-3.5 w-3.5" /> Category
                </span>
                <span class="font-medium text-slate-900 dark:text-slate-100">
                  {{ inspectedProduct.category }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-slate-500">Last Updated</span>
                <span class="font-mono text-slate-700 dark:text-slate-300">
                  {{ formatDateTime(inspectedProduct.updatedAt || inspectedProduct.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 mt-6">
            <button
              type="button"
              class="btn-secondary flex-1"
              @click="
                openEditModal(inspectedProduct!);
                inspectedProduct = null;
              "
            >
              <Pencil class="h-4 w-4" />
              Edit Product
            </button>
            <button
              type="button"
              class="btn-danger"
              @click="handleDeleteProduct(inspectedProduct!)"
            >
              <Trash2 class="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
