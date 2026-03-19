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
            <router-link to="/categorias" class="btn btn-outline-secondary btn-sm mt-2 mb-2">
              <i class="bi bi-arrow-left me-2"></i>Ver todas las categorías
            </router-link>
          </template>
          <template v-else>
            <p class="small text-uppercase text-success mb-2">Nuestra Colección Completa</p>
            <h2 class="display-4 fw-normal mb-3">Explora por Categorías</h2>
            <p class="text-muted">{{ totalProducts }} {{ totalProducts === 1 ? 'producto disponible' : 'productos disponibles' }}</p>
          </template>
        </div>
      </div>

      <div v-if="categoryNames.length && !searchTerm" class="d-flex flex-wrap justify-content-center gap-2 mb-5 pb-0 border-bottom border-2">
        <button
          type="button"
          class="category-tab btn btn-link text-decoration-none px-4 py-3 border-bottom border-3"
          :class="selectedCategory === null ? 'active fw-semibold' : 'border-transparent'"
          @click="selectedCategory = null"
        >
          Todas
        </button>
        <button
          v-for="cat in categoryNames"
          :key="cat"
          type="button"
          class="category-tab btn btn-link text-decoration-none px-4 py-3 text-capitalize border-bottom border-3"
          :class="selectedCategory === cat ? 'active fw-semibold' : 'border-transparent'"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
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
              <h3 class="display-5 fw-normal mb-4 pb-2 border-bottom border-success border-2">{{ cat }}</h3>
              <div class="row g-4">
                <div v-for="p in prods" :key="p.id" class="col-md-6 col-lg-4">
                  <ProductCard :product="p" />
                </div>
              </div>
            </div>
          </div>
          <div v-for="(prods, cat) in productsByCategory" :key="'tab-' + cat" v-show="selectedCategory === cat" class="row g-4 mb-5">
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
import { computed, onMounted, ref, watch } from 'vue';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import ProductCard from '@/components/ProductCard.vue';
import SkeletonProductGrid from '@/components/SkeletonProductGrid.vue';

const route = useRoute();
const productsStore = useProductsStore();

const selectedCategory = ref<string | null>(null);

const searchTerm = computed(() => (route.query.q as string) || '');

const categoryNames = computed(() => Object.keys(productsByCategory.value));

const productsByCategory = computed(() => {
  const list = searchTerm.value ? productsStore.items : productsStore.items;
  return productsStore.groupByCategory(list);
});

const flatProducts = computed(() => productsStore.items);

const totalProducts = computed(() => productsStore.items.length);

const hasCategories = computed(() => categoryNames.value.length > 0 && Object.keys(productsByCategory.value).length > 0);

watch(
  () => route.query.cat,
  (cat) => {
    selectedCategory.value = (cat as string) || null;
  },
  { immediate: true }
);

onMounted(async () => {
  if (searchTerm.value) {
    await productsStore.search(searchTerm.value);
  } else {
    await productsStore.fetchActive();
  }
  const cat = route.query.cat as string;
  if (cat) selectedCategory.value = cat;
});
</script>

<style scoped>
.category-tab:hover {
  color: #4a6741 !important;
  border-bottom-color: #4a6741 !important;
  background: rgba(74, 103, 65, 0.05) !important;
}
.category-tab.active {
  color: #4a6741 !important;
  border-bottom-color: #4a6741 !important;
}
</style>

