<template>
  <section id="coleccion" class="py-5 overflow-hidden">
    <div class="container">
      <div class="row mb-5">
        <div class="col-lg-6">
          <p class="small text-uppercase mb-2 text-success">Nuestra Colección</p>
          <h2 class="display-4 fw-normal mb-3">{{ collection.title || 'Prendas Artesanales' }}</h2>
          <p class="text-muted" style="max-width: 500px">{{ collection.description }}</p>
        </div>
        <div class="col-lg-6 text-lg-end d-flex align-items-center justify-content-lg-end gap-2 flex-wrap">
          <router-link to="/categorias" class="btn btn-success px-4 py-2">
            <i class="bi bi-grid me-2"></i>Ver Todas las Categorías
          </router-link>

          <router-link
            v-if="adminAuth.isAdmin"
            :to="{ path: '/panel/crear', query: { returnTo: route.fullPath } }"
            class="btn btn-primary px-4 py-2"
          >
            <i class="bi bi-plus-lg me-2"></i>Nuevo producto
          </router-link>
        </div>
      </div>

      <div v-if="productsStore.items.length" class="row g-4">
        <div v-for="p in productsStore.items" :key="p.id" class="col-md-6 col-lg-3">
          <ProductCard :product="p" />
        </div>
      </div>
      <div v-else-if="productsStore.loading" class="row g-4">
        <div class="col-12">
          <SkeletonProductGrid :count="6" />
        </div>
      </div>
      <div v-else class="col-12">
        <div class="alert alert-info text-center">
          <p class="mb-0">{{ collection.no_products || 'No hay productos disponibles en este momento.' }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import ProductCard from '@/components/ProductCard.vue';
import SkeletonProductGrid from '@/components/SkeletonProductGrid.vue';

type HomeCollection = {
  title?: string;
  description?: string;
  no_products?: string;
};

const props = defineProps<{
  collection: HomeCollection;
}>();

const route = useRoute();
const productsStore = useProductsStore();
const collection = props.collection;
const adminAuth = useAdminAuthStore();
</script>

