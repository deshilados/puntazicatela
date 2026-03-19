<template>
  <div class="card shadow-sm h-100" style="cursor: pointer" @click="go">
    <img
      :src="productImageUrl(firstImageFrom(product.imagen_url))"
      :alt="product.nombre"
      class="card-img-top"
      style="height: 320px; object-fit: cover"
      loading="lazy"
    />
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

function firstImageFrom(imagenUrl: string | null | undefined): string | null {
  const raw = (imagenUrl ?? '').trim();
  if (!raw) return null;

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const first = parsed[0];
        return first ? String(first).trim() : null;
      }
    } catch {
      // Fallback a separadores
    }
  }

  return raw.split(/[,\|;]+/g).map((s) => s.trim()).filter(Boolean)[0] ?? null;
}

function go() {
  router.push('/producto/' + props.product.id);
}
</script>

