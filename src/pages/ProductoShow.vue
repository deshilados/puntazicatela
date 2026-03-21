<template>
  <Navbar />

  <div>
    <div v-if="loading" class="container py-5">
      <SkeletonProductDetail />
    </div>
    <div v-else-if="!product" class="container text-center py-5">
      <p class="text-danger">Producto no encontrado.</p>
      <router-link to="/" class="btn btn-success">Ir al inicio</router-link>
    </div>
    <div v-else class="container pt-5"  style="min-height: 70vh">
      <ProductoShowBreadcrumb :product="product" />

      <div class="row mb-5">
        <div class="col-lg-6">
          <ProductoShowGallery v-model:active-index="activeImageIndex" :product-name="product.nombre"
            :imagen-url="product.imagen_url" :images="productImages" />
        </div>
        <div class="col-lg-6">
          <ProductoShowDetail :product="product" :tallas="tallas" />
        </div>
      </div>

      <ProductoShowRelated v-if="related.length" :related="related" :ready="!loading" />
    </div>
  </div>

  <ContactoFooter />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import ProductoShowBreadcrumb from '@/components/ProductoShow/ProductoShowBreadcrumb.vue';
import ProductoShowGallery from '@/components/ProductoShow/ProductoShowGallery.vue';
import ProductoShowDetail from '@/components/ProductoShow/ProductoShowDetail.vue';
import ProductoShowRelated from '@/components/ProductoShow/ProductoShowRelated.vue';
import { useProductsStore } from '@/stores/productsStore';
import type { Product } from '@/stores/productsStore';
import SkeletonProductDetail from '@/components/SkeletonProductDetail.vue';

const route = useRoute();
const productsStore = useProductsStore();

const product = ref<Product | null>(null);
const loading = ref(true);

function parseImages(imagenUrl: string | null | undefined): string[] {
  const raw = (imagenUrl ?? '').trim();
  if (!raw) return [];

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
    } catch {
      // Fallback a separadores
    }
  }

  return raw
    .split(/[,\|;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

const productImages = computed(() => parseImages(product.value?.imagen_url));
const activeImageIndex = ref(0);

function parseTallas(tallasValue: string | null | undefined): string[] {
  const raw = (tallasValue ?? '').trim();
  if (!raw) return [];

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
    } catch {
      // fallback legacy
    }
  }

  return raw
    .split(/[,\|;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

watch(
  () => product.value?.id,
  () => {
    activeImageIndex.value = 0;
  },
);

const tallas = computed(() => {
  return parseTallas(product.value?.tallas_disponibles);
});

const related = ref<Product[]>([]);

/** Misma vista `/producto/:id`: Vue reutiliza el componente; hay que recargar al cambiar el id. */
async function loadProductData() {
  const id = Number(route.params.id);
  if (!id) {
    product.value = null;
    related.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  product.value = null;
  related.value = [];
  activeImageIndex.value = 0;

  try {
    const p = await productsStore.fetchById(id);
    if (p && !p.activo) {
      product.value = null;
    } else {
      product.value = p;
      if (product.value) {
        const { supabase } = await import('@/utils/supabase');
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('categoria', product.value.categoria)
          .eq('activo', true)
          .neq('id', id)
          .limit(12);
        related.value = (data ?? []) as Product[];
      }
    }
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.id,
  () => {
    void loadProductData();
  },
  { immediate: true },
);
</script>
