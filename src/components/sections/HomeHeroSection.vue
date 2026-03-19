<template>
  <section id="inicio" class="hero pxm-hero d-flex align-items-center overflow-hidden" aria-label="Hero principal">
    <img
      :src="heroImageSrc"
      :alt="heroAlt"
      class="hero-bg pxm-hero__bg"
      loading="eager"
      decoding="async"
      fetchpriority="high"
    />

    <div class="hero-overlay pxm-hero__overlay" aria-hidden="true"></div>

    <div class="container">
      <div class="text-white pxm-hero__content">
        <h1 class="display-2 fw-light mb-4 lh-sm mt-5">
          {{ hero.title || 'Tradición de los Deshilados Oaxaqueños' }}
        </h1>

        <p v-if="hero.description" class="lead mb-4 opacity-75 lh-lg">
          {{ hero.description }}
        </p>

        <p v-else class="lead mb-4 opacity-75 lh-lg">
          Explora piezas tejidas a mano con tradición, diseño y cuidado artesanal.
        </p>

        <button
          type="button"
          class="btn btn-warning px-4 py-2 small mb-4 pxm-hero__cta"
          @click="scrollToSection('coleccion')"
        >
          Explorar Colección
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type HomeHero = {
  title?: string;
  description?: string;
  image?: string | null;
};

const props = defineProps<{
  hero?: HomeHero;
}>();

const hero = computed(() => props.hero ?? ({} as HomeHero));

const imageBase = computed(() => {
  const b = import.meta.env.BASE_URL || '';
  return b.endsWith('/') ? b + 'images/' : b + '/images/';
});

const heroImageSrc = computed(() => {
  const img = hero.value.image;
  return img ? imageBase.value + img : imageBase.value + 'banner.jpg';
});

const heroAlt = computed(() => hero.value.title || 'Banner principal');

function scrollToSection(id: string, retries = 5) {
  const el = document.getElementById(id);
  if (el) {
    // Mantener el desplazamiento alineado con el offset del header del sitio.
    const NAVBAR_OFFSET = 120;
    const y = el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
    return;
  }
  if (retries <= 0) return;
  setTimeout(() => scrollToSection(id, retries - 1), 100);
}
</script>

<style scoped>
.pxm-hero {
  position: relative;
}

.pxm-hero__content {
  max-width: 700px;
  padding-right: 1rem;
  padding-left: 1rem;
  position: relative;
  z-index: 2;
}

.pxm-hero__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.pxm-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1;
}

.pxm-hero__cta:focus-visible {
  outline: 2px solid rgba(33, 110, 255, 0.6);
  outline-offset: 3px;
}
</style>