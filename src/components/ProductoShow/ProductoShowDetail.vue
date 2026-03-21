<template>
  <div>
    <span class="small text-uppercase text-muted d-block mb-2">{{ product.categoria }}</span>
    <h1 class="display-4 fw-normal mb-3">{{ product.nombre }}</h1>
    <p class="display-5 fw-semibold mb-4 text-success">${{ Number(product.precio).toFixed(2) }} MXN</p>
    <p v-if="product.descripcion" class="text-muted mb-4" style="line-height: 1.8">{{ product.descripcion }}</p>
    <div v-if="product.tallas_disponibles" class="my-4">
      <h5 class="mb-3">Tallas Disponibles:</h5>
      <span v-for="t in tallas" :key="t" class="badge border border-secondary text-dark me-2 mb-2">{{ t }}</span>
    </div>
    <div class="p-3 rounded border-start border-4 my-4" :class="product.stock > 0 ? 'border-success' : 'border-danger'">
      <h5 class="mb-2">
        <i v-if="product.stock > 0" class="bi bi-check-circle text-success"></i>
        <i v-else class="bi bi-x-circle text-danger"></i>
        {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
      </h5>
      <p class="mb-0">
        <template v-if="product.stock > 0">Stock disponible: <strong>{{ product.stock }}</strong> unidades</template>
        <template v-else>Este producto está temporalmente agotado</template>
      </p>
    </div>
    <div>
      <router-link :to="'/ordenar?producto=' + product.id" class="btn btn-success mt-4">
        <i class="bi bi-cart-plus me-2"></i>Solicitar este Producto
      </router-link>
      <router-link
        :to="'/categorias?cat=' + encodeURIComponent(product.categoria)"
        class="btn btn-outline-secondary mt-4 ms-2"
      >
        <i class="bi bi-arrow-left me-2"></i>Ir a {{ product.categoria }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/stores/productsStore';

defineProps<{
  product: Product;
  tallas: string[];
}>();
</script>
