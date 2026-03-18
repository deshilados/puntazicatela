<template>
  <div class="home-textil">
    <section id="inicio" class="hero d-flex align-items-center overflow-hidden">
      <img :src="heroImageSrc" alt="Banner principal" class="hero-bg" />
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="text-white" style="max-width: 700px">
          <h1 class="display-2 fw-light mb-4 lh-sm mt-5">{{ home.hero.title || 'Tradición Textil Oaxaqueña' }}</h1>
          <p class="lead mb-4 opacity-75 lh-lg">{{ home.hero.description }}</p>
          <a href="#coleccion" class="btn btn-warning px-4 py-2 small mb-4">Explorar Colección</a>
        </div>
      </div>
    </section>

    <section id="coleccion" class="py-5 overflow-hidden">
      <div class="container">
        <div class="row mb-5">
          <div class="col-lg-6">
            <p class="small text-uppercase mb-2 text-success">Nuestra Colección</p>
            <h2 class="display-4 fw-normal mb-3">{{ home.collection.title || 'Prendas Artesanales' }}</h2>
            <p class="text-muted" style="max-width: 500px">{{ home.collection.description }}</p>
          </div>
          <div class="col-lg-6 text-lg-end d-flex align-items-center justify-content-lg-end">
            <router-link to="/categorias" class="btn btn-success px-4 py-2">
              <i class="bi bi-grid me-2"></i>Ver Todas las Categorías
            </router-link>
          </div>
        </div>
        <div v-if="productsStore.items.length" class="row g-4">
          <div v-for="p in productsStore.items" :key="p.id" class="col-md-6 col-lg-4">
            <div class="bg-light rounded card product-card h-100 border shadow-sm cursor-pointer" @click="goProduct(p.id)">
              <img :src="productImageUrl(p.imagen_url)" :alt="p.nombre" class="card-img-top" style="height: 320px; object-fit: cover" loading="lazy" />
              <div class="card-body">
                <span class="small text-uppercase d-block mb-2 text-muted">{{ p.categoria }}</span>
                <h3 class="h5 mb-2">{{ p.nombre }}</h3>
                <p class="fw-semibold mb-2 text-success">${{ Number(p.precio).toFixed(2) }} MXN</p>
                <small v-if="p.stock > 0" class="text-muted">Stock: {{ p.stock }}</small>
                <small v-else class="text-danger">Agotado</small>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="col-12">
          <div class="alert alert-info text-center">
            <p class="mb-0">{{ home.collection.no_products || 'No hay productos disponibles en este momento.' }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="nosotros" class="py-5 overflow-hidden">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <img :src="aboutImageSrc" :alt="home.about.title" class="img-fluid rounded" style="height: 400px; object-fit: cover" />
          </div>
          <div class="col-lg-6">
            <p class="small text-uppercase mb-2 text-success">{{ home.about.badge }}</p>
            <h2 class="display-4 fw-normal mb-4">{{ home.about.title }}</h2>
            <p class="mb-4 text-muted">{{ home.about.description1 }}</p>
            <p class="mb-4 text-muted">{{ home.about.description2 }}</p>
            <div class="row mt-5">
              <div class="col-4 text-center">
                <p class="display-5 fw-semibold mb-2 text-success">{{ home.about.stats.years.value }}</p>
                <p class="small text-muted">{{ home.about.stats.years.label }}</p>
              </div>
              <div class="col-4 text-center">
                <p class="display-5 fw-semibold mb-2 text-success">{{ home.about.stats.countrys.value }}</p>
                <p class="small text-muted">{{ home.about.stats.countrys.label }}</p>
              </div>
              <div class="col-4 text-center">
                <p class="display-5 fw-semibold mb-2 text-success">{{ home.about.stats.products.value }}</p>
                <p class="small text-muted">{{ home.about.stats.products.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useSiteContentStore } from '@/stores/siteContentStore';
import { productImageUrl } from '@/utils/productImageUrl';

const router = useRouter();
const productsStore = useProductsStore();
const siteContent = useSiteContentStore();

const home = computed(() => siteContent.getNestedStructured().home);

const imageBase = computed(() => {
  const b = import.meta.env.BASE_URL || '';
  return b.endsWith('/') ? b + 'images/' : b + '/images/';
});
const heroImageSrc = computed(() => {
  const img = home.value.hero.image;
  return img ? imageBase.value + img : imageBase.value + 'banner.jpg';
});
const aboutImageSrc = computed(() => {
  const img = home.value.about.image;
  return img ? imageBase.value + img : imageBase.value + 'about.jpg';
});

function goProduct(id: number) {
  router.push('/producto/' + id);
}

onMounted(async () => {
  if (Object.keys(siteContent.items).length === 0) await siteContent.fetchAll();
  await productsStore.fetchPortada();
});
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 55vh;
  margin-top: 8vh;
}
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(61, 53, 41, 0.85), rgba(61, 53, 41, 0.4));
  z-index: -1;
}
.product-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.product-card:hover {
  transform: translateY(-5px);
}
</style>
