<template>
  <Navbar />
  <div class="categorias-page pt-5" style="min-height: 60vh">
    <div class="container">
      <div class="row mb-2">
        <div class="col-12 text-center">
          <template v-if="searchTerm">
            <p class="small text-uppercase text-success mb-2">Resultados de Búsqueda</p>
            <div class="d-flex justify-content-center">
              <strong class="text-muted">{{ totalProducts }} {{ totalProducts === 1 ? 'producto encontrado' : 'productos encontrados' }}</strong>
            </div>
            <div class="d-flex justify-content-center gap-2 flex-wrap mt-2 mb-2">
              <router-link to="/categorias" class="btn btn-outline-secondary btn-sm">
                <i class="bi bi-arrow-left me-2"></i>Ver todas las categorías
              </router-link>
            </div>
          </template>
          <template v-else>
            <p class="small text-uppercase text-success mb-2">Nuestra Colección Completa</p>
            <h2 class="display-4 fw-normal mb-3">Explora por Categorías</h2>
            <p class="text-muted small mb-1">{{ totalProducts }} {{ totalProducts === 1 ? 'producto disponible' :
              'productos disponibles' }}</p>
          </template>
        </div>
      </div>

      <div v-if="categoryNames.length && !searchTerm"
        class="category-tabs-wrap d-flex flex-wrap justify-content-center gap-2 mb-5">
        <button type="button" class="category-tab btn" :class="selectedCategory === null ? 'active' : ''"
          @click="selectedCategory = null">
          Todas
        </button>
        <button v-for="cat in categoryNames" :key="cat" type="button" class="category-tab btn text-capitalize"
          :class="selectedCategory === cat ? 'active' : ''" @click="selectedCategory = cat">
          {{ cat }}
        </button>
        <div v-if="adminAuth.isAdmin" class="d-flex justify-content-center mt-2 mb-2">
          <router-link :to="{ path: '/panel/crear', query: { returnTo: route.fullPath } }"
            class="btn btn-primary btn-sm">
            <i class="bi bi-plus-lg me-2"></i>Nuevo producto
          </router-link>
        </div>
      </div>

      <div v-if="!productsStore.loading && !hasCategories && searchTerm" class="alert alert-info text-center">
        <p class="mb-0">No se encontraron productos que coincidan con "{{ searchTerm }}".</p>
      </div>
      <div v-else-if="!productsStore.loading && !hasCategories && !searchTerm" class="alert alert-warning text-center">
        <p class="mb-0">No se encontraron categorías.</p>
      </div>

      <template v-if="productsStore.loading">
        <div class="mb-5">
          <SkeletonProductGrid :count="12" />
        </div>
      </template>
      <template v-else-if="hasCategories">
        <template v-if="searchTerm">
          <div class="row g-4 mb-5">
            <div v-for="p in flatProducts" :key="p.id" class="col-md-6 col-lg-4">
              <ProductCard :product="p" />
            </div>
          </div>
        </template>
        <template v-else>
          <div v-show="selectedCategory === null" class="mb-5">
            <div v-for="(prods, cat) in productsByCategory" :key="cat" class="pb-4">
              <h3 class="display-5 fw-normal mb-4 pb-2">{{ cat }}</h3>
              <div class="row g-4">
                <div v-for="p in prods" :key="p.id" class="col-md-6 col-lg-4">
                  <ProductCard :product="p" />
                </div>
              </div>
            </div>
          </div>
          <div v-for="(prods, cat) in productsByCategory" :key="'tab-' + cat" v-show="selectedCategory === cat"
            class="row g-4 mb-5">
            <div v-for="p in prods" :key="p.id" class="col-md-6 col-lg-4">
              <ProductCard :product="p" />
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>

  <ContactoFooter />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import ProductCard from '@/components/ProductCard.vue';
import SkeletonProductGrid from '@/components/SkeletonProductGrid.vue';

const route = useRoute();
const productsStore = useProductsStore();
const adminAuth = useAdminAuthStore();

function queryParamSingle(v: unknown): string {
  if (v == null) return '';
  return Array.isArray(v) ? String(v[0] ?? '') : String(v);
}

const selectedCategory = ref<string | null>(null);

const searchTerm = computed(() => queryParamSingle(route.query.q).trim());

const categoryNames = computed(() => Object.keys(productsByCategory.value));

const productsByCategory = computed(() => {
  const list = searchTerm.value ? productsStore.items : productsStore.items;
  return productsStore.groupByCategory(list);
});

const flatProducts = computed(() => productsStore.items);

const totalProducts = computed(() => productsStore.items.length);

const hasCategories = computed(() => categoryNames.value.length > 0 && Object.keys(productsByCategory.value).length > 0);

/** Misma vista `/categorias`: al cambiar `?q=` (o el buscador actualiza la URL) hay que volver a cargar. */
async function loadCategoriasData() {
  const q = queryParamSingle(route.query.q).trim();
  if (q) {
    await productsStore.search(q);
  } else {
    await productsStore.fetchActive();
  }
}

watch(
  () => queryParamSingle(route.query.q),
  () => {
    void loadCategoriasData();
  },
  { immediate: true }
);

watch(
  () => route.query.cat,
  (cat) => {
    selectedCategory.value = (cat as string) || null;
  },
  { immediate: true }
);
</script>

<style scoped>
.category-tabs-wrap {
  padding-bottom: 0.25rem;
}

.category-tab {
  border-radius: 999px;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0.45rem 0.95rem;
  font-weight: 500;
}

.category-tab:hover {
  color: #111827 !important;
  border-color: #d1d5db !important;
  background: #ffffff !important;
}

.category-tab.active {
  color: #ffffff !important;
  background: #111827 !important;
  border-color: #111827 !important;
}
</style>
