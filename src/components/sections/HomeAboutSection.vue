<template>
  <section id="nosotros" class="py-5 overflow-hidden">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <img :src="aboutImageSrc" :alt="about.title" class="img-fluid rounded" style="height: 400px; object-fit: cover" />
        </div>
        <div class="col-lg-6">
          <p class="small text-uppercase mb-2 text-success">{{ about.badge }}</p>
          <h2 class="display-4 fw-normal mb-4">{{ about.title }}</h2>
          <p class="mb-4 text-muted">{{ about.description1 }}</p>
          <p class="mb-4 text-muted">{{ about.description2 }}</p>
          <div class="row mt-5">
            <div class="col-4 text-center">
              <p class="display-5 fw-semibold mb-2 text-success">{{ about.stats.years.value }}</p>
              <p class="small text-muted">{{ about.stats.years.label }}</p>
            </div>
            <div class="col-4 text-center">
              <p class="display-5 fw-semibold mb-2 text-success">{{ about.stats.countrys.value }}</p>
              <p class="small text-muted">{{ about.stats.countrys.label }}</p>
            </div>
            <div class="col-4 text-center">
              <p class="display-5 fw-semibold mb-2 text-success">{{ about.stats.products.value }}</p>
              <p class="small text-muted">{{ about.stats.products.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type HomeAbout = {
  badge?: string;
  title?: string;
  description1?: string;
  description2?: string;
  image?: string | null;
  stats: {
    years: { value?: string; label?: string };
    countrys: { value?: string; label?: string };
    products: { value?: string; label?: string };
  };
};

const props = defineProps<{
  about: HomeAbout;
}>();

const imageBase = computed(() => {
  const b = import.meta.env.BASE_URL || '';
  return b.endsWith('/') ? b + 'images/' : b + '/images/';
});

const aboutImageSrc = computed(() => {
  const img = props.about.image;
  return img ? imageBase.value + img : imageBase.value + 'about.jpg';
});

const about = props.about;
</script>

