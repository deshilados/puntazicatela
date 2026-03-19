<template>
  <div class="card shadow-sm h-100" style="cursor: pointer" @click="go">
    <img :src="productImageUrl(product.imagen_url)" :alt="product.nombre" class="card-img-top" style="height: 320px; object-fit: cover" loading="lazy" />
    <div class="card-body">
      <span class="small text-uppercase text-muted d-block mb-2">{{ product.categoria }}</span>
      <h3 class="h5 mb-2">{{ product.nombre }}</h3>
      <p class="fw-semibold text-success mb-2">${{ Number(product.precio).toFixed(2) }} MXN</p>
      <small v-if="product.stock > 0" class="text-muted">Stock: {{ product.stock }}</small>
      <small v-else class="text-danger">Agotado</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Product } from '@/stores/productsStore';
import { productImageUrl } from '@/utils/productImageUrl';

const props = defineProps<{ product: Product }>();
const router = useRouter();

function go() {
  router.push('/producto/' + props.product.id);
}
</script>

