<template>
  <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
    <nav aria-label="breadcrumb" class="flex-grow-1 min-w-0">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item">
          <router-link to="/" class="text-success text-decoration-none">Inicio</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link to="/categorias" class="text-success text-decoration-none">Categorías</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link
            :to="'/categorias?cat=' + encodeURIComponent(product.categoria)"
            class="text-success text-decoration-none"
          >{{ product.categoria }}</router-link>
        </li>
        <li class="breadcrumb-item active text-truncate" :title="product.nombre">{{ product.nombre }}</li>
      </ol>
    </nav>
    <router-link
      v-if="adminAuth.isAdmin"
      :to="{ path: '/panel/editar/' + product.id, query: { returnTo: route.fullPath } }"
      class="btn btn-sm btn-primary flex-shrink-0"
      title="Editar producto"
    >
      <i class="bi bi-pencil-square" aria-hidden="true" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import type { Product } from '@/stores/productsStore';

defineProps<{
  product: Product;
}>();

const route = useRoute();
const adminAuth = useAdminAuthStore();

onMounted(() => {
  adminAuth.initFromStorage();
});
</script>
