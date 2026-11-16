import { defineStore } from 'pinia';
import type {
  PaginationMeta,
  ProductFormPayload,
  ProductRecord,
  ProductStatus,
} from '#shared/types/api';

export const useProductsStore = defineStore('titan-products', () => {
  const api = useApiClient();

  const items = ref<ProductRecord[]>([]);
  const categories = ref<string[]>([
    'Cloud Infrastructure',
    'Network Hardware',
    'Security Appliances',
    'Developer Workstations',
    'Edge IoT Sensors',
    'Enterprise Software',
  ]);
  const selectedProduct = ref<ProductRecord | null>(null);
  const viewMode = ref<'table' | 'grid'>('table');

  const meta = ref<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const filters = reactive({
    page: 1,
    limit: 8,
    search: '',
    category: '',
    status: '' as '' | ProductStatus,
    minPrice: '' as string | number,
    maxPrice: '' as string | number,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const loading = ref(false);
  const submitting = ref(false);
  const error = ref<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get<string[]>('/products/categories');
      if (Array.isArray(res.data) && res.data.length > 0) {
        categories.value = res.data;
      }
    } catch {
      // Keep default categories fallback
    }
  };

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<ProductRecord[]>(
        '/products',
        {
          page: filters.page,
          limit: filters.limit,
          search: filters.search || undefined,
          category: filters.category || undefined,
          status: filters.status || undefined,
          minPrice:
            filters.minPrice !== '' && filters.minPrice !== null
              ? Number(filters.minPrice)
              : undefined,
          maxPrice:
            filters.maxPrice !== '' && filters.maxPrice !== null
              ? Number(filters.maxPrice)
              : undefined,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        },
        'products-list',
      );
      items.value = res.data || [];
      if (res.meta) {
        meta.value = res.meta;
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      error.value = api.extractApiErrorMessage(err);
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (payload: ProductFormPayload) => {
    submitting.value = true;
    try {
      const res = await api.post<ProductRecord>(
        '/products',
        payload as unknown as Record<string, unknown>,
      );
      await fetchProducts();
      return res.data;
    } finally {
      submitting.value = false;
    }
  };

  const updateProduct = async (
    id: string,
    payload: Partial<ProductFormPayload>,
  ) => {
    submitting.value = true;
    try {
      const res = await api.patch<ProductRecord>(
        `/products/${id}`,
        payload as unknown as Record<string, unknown>,
      );
      await fetchProducts();
      return res.data;
    } finally {
      submitting.value = false;
    }
  };

  const deleteProduct = async (id: string) => {
    submitting.value = true;
    try {
      await api.del(`/products/${id}`);
      if (items.value.length === 1 && filters.page > 1) {
        filters.page -= 1;
      }
      await fetchProducts();
    } finally {
      submitting.value = false;
    }
  };

  const resetFilters = () => {
    filters.page = 1;
    filters.search = '';
    filters.category = '';
    filters.status = '';
    filters.minPrice = '';
    filters.maxPrice = '';
    filters.sortBy = 'createdAt';
    filters.sortOrder = 'desc';
    fetchProducts();
  };

  return {
    items,
    categories,
    selectedProduct,
    viewMode,
    meta,
    filters,
    loading,
    submitting,
    error,
    fetchCategories,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    resetFilters,
  };
});
