<template>
  <Navbar />
  <div class="pt-5" style="min-height: 70vh">
    <div v-if="loading" class="container py-5">
      <SkeletonProductDetail />
    </div>
    <div v-else-if="!product" class="container text-center py-5">
      <p class="text-danger">Producto no encontrado.</p>
      <router-link to="/" class="btn btn-success">Ir al inicio</router-link>
    </div>
    <div v-else class="container">
      <div aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><router-link to="/" class="text-success text-decoration-none">Inicio</router-link></li>
          <li class="breadcrumb-item"><router-link to="/categorias" class="text-success text-decoration-none">Categorías</router-link></li>
          <li class="breadcrumb-item">
            <router-link :to="'/categorias?cat=' + encodeURIComponent(product.categoria)" class="text-success text-decoration-none">{{ product.categoria }}</router-link>
          </li>
          <li class="breadcrumb-item active">{{ product.nombre }}</li>
        </ol>
      </div>

      <div class="row g-5 mb-5">
        <div class="col-lg-6">
          <div class="rounded shadow overflow-hidden">
            <img
              v-if="productImages.length"
              :src="productImageUrl(activeImageUrl)"
              :alt="product.nombre"
              class="w-100"
              style="height: 500px; object-fit: cover"
            />
            <img
              v-else
              :src="productImageUrl(product.imagen_url)"
              :alt="product.nombre"
              class="w-100"
              style="height: 500px; object-fit: cover"
            />
          </div>

          <div
            v-if="productImages.length"
            class="d-flex flex-wrap gap-2 mt-3"
            role="list"
            aria-label="Galería de imágenes del producto"
          >
            <button
              v-for="(img, idx) in productImages"
              :key="img + '-' + idx"
              type="button"
              class="btn btn-sm p-0"
              :class="idx === activeImageIndex ? 'border border-3 border-success' : 'border border-secondary'"
              @click="activeImageIndex = idx"
              :aria-label="'Ver imagen ' + (idx + 1)"
              :aria-pressed="idx === activeImageIndex"
            >
              <img
                :src="productImageUrl(img)"
                :alt="'Imagen ' + (idx + 1) + ' de ' + product.nombre"
                class="img-thumbnail"
                style="height: 84px; width: 140px; object-fit: cover; border-radius: 0.5rem;"
              />
            </button>
          </div>
        </div>
        <div class="col-lg-6">
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
            <router-link :to="'/categorias?cat=' + encodeURIComponent(product.categoria)" class="btn btn-outline-secondary mt-4 ms-2">
              <i class="bi bi-arrow-left me-2"></i>Ir a {{ product.categoria }}
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="related.length" class="mt-5 pt-4 border-top mb-5">
        <h3 class="display-5 fw-normal mb-4">Productos Relacionados</h3>
        <div class="row g-4">
          <div v-for="r in related" :key="r.id" class="col-md-6 col-lg-3">
            <div class="card shadow-sm h-100" style="cursor: pointer" @click="$router.push('/producto/' + r.id)">
              <img :src="productImageUrl(firstImageFrom(r.imagen_url))" :alt="r.nombre" class="card-img-top" style="height: 320px; object-fit: cover" />
              <div class="card-body">
                <span class="small text-uppercase text-muted d-block mb-2">{{ r.categoria }}</span>
                <h3 class="h5 mb-2">{{ r.nombre }}</h3>
                <p class="fw-semibold text-success mb-0">${{ Number(r.precio).toFixed(2) }} MXN</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ContactoFooter />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { useProductsStore } from '@/stores/productsStore';
import type { Product } from '@/stores/productsStore';
import { productImageUrl } from '@/utils/productImageUrl';
import SkeletonProductDetail from '@/components/SkeletonProductDetail.vue';

const route = useRoute();
const productsStore = useProductsStore();

const product = ref<Product | null>(null);
const loading = ref(true);

function parseImages(imagenUrl: string | null | undefined): string[] {
  const raw = (imagenUrl ?? '').trim();
  if (!raw) return [];

  // Soporta JSON: '["a.jpg","b.jpg"]'
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
    } catch {
      // Fallback a separadores
    }
  }

  // Soporta lista separada por comas/|/;
  return raw
    .split(/[,\|;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

const productImages = computed(() => parseImages(product.value?.imagen_url));
const activeImageIndex = ref(0);
const activeImageUrl = computed(() => productImages.value[activeImageIndex.value] ?? '');

function firstImageFrom(imagenUrl: string | null | undefined): string | null {
  return parseImages(imagenUrl)[0] ?? null;
}

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

  // Legacy: coma/|/;
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

onMounted(async () => {
  const id = Number(route.params.id);
  if (!id) {
    loading.value = false;
    return;
  }
  product.value = await productsStore.fetchById(id);
  if (product.value && !product.value.activo) {
    product.value = null;
  } else if (product.value) {
    const { supabase } = await import('@/utils/supabase');
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('categoria', product.value.categoria)
      .eq('activo', true)
      .neq('id', id)
      .limit(4);
    related.value = (data ?? []) as Product[];
  }
  loading.value = false;
});
</script>

