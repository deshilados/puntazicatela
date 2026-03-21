<template>
  <div class="product-gallery" :class="{ 'product-gallery--single': !images.length }">
    <!-- Miniaturas a la izquierda (en móvil: debajo de la principal, fila con scroll) -->
    <div v-if="images.length" class="product-gallery-thumbs text-center" role="list"
      aria-label="Galería de imágenes del producto">
      <button v-for="(img, idx) in images" :key="img + '-' + idx" type="button"
        class="btn btn-sm p-0 product-gallery-thumb-btn"
        :class="idx === activeIndex ? 'border border-3 border-success' : 'border border-secondary'"
        @click="activeIndex = idx" :aria-label="'Ver imagen ' + (idx + 1)" :aria-pressed="idx === activeIndex">
        <img :src="productImageUrl(img)" :alt="'Imagen ' + (idx + 1) + ' de ' + productName"
          class="img-thumbnail product-gallery-thumb-img" />
      </button>
    </div>

    <!-- Foto principal a la derecha -->
    <div class="product-gallery-main rounded overflow-hidden text-center flex-grow-1 min-w-0 w-100">
      <img v-if="images.length" :src="productImageUrl(activeImageUrl)" :alt="productName"
        class="product-gallery-main-img" />
      <img v-else :src="productImageUrl(imagenUrl)" :alt="productName" class="product-gallery-main-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { productImageUrl } from '@/utils/productImageUrl';

const props = defineProps<{
  productName: string;
  imagenUrl: string | null;
  images: string[];
}>();

const activeIndex = defineModel<number>('activeIndex', { default: 0 });

const activeImageUrl = computed(() => props.images[activeIndex.value] ?? '');
</script>

<style scoped>
/* Una fila: miniaturas | principal (mismo tamaño de imágenes que antes) */
.product-gallery {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: flex-start;
}

.product-gallery--single {
  display: block;
}

.product-gallery-main-img {
  width: 100%;
  height: 29.5rem;
  object-fit: cover;
  display: block;
}

/* Miniaturas: columna a la izquierda, scroll vertical si hay muchas */
.product-gallery-thumbs {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 0.5rem;
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 29.5rem;
  padding-bottom: 0.15rem;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.product-gallery-thumb-btn {
  flex: 0 0 auto;
  min-width: 2.75rem;
  min-height: 2.75rem;
}

.product-gallery-thumb-img {
  display: block;
  width: clamp(4.5rem, 28vw, 8.75rem);
  height: clamp(3.25rem, 22vw, 5.25rem);
  object-fit: cover;
  border-radius: 0.5rem;
}

@media (min-width: 576px) {
  .product-gallery-thumb-img {
    width: clamp(5.5rem, 18vw, 8.75rem);
    height: clamp(4rem, 14vw, 5.25rem);
  }
}

@media (min-width: 768px) {
  .product-gallery-thumb-img {
    width: clamp(6.5rem, 12vw, 8.75rem);
    height: clamp(4.5rem, 9vw, 5.25rem);
  }
}

@media (min-width: 992px) {
  .product-gallery-thumb-img {
    width: 8.75rem;
    height: 5.25rem;
  }
}

/* Pantallas estrechas: principal arriba, miniaturas abajo en fila con scroll */
@media (max-width: 575.98px) {
  .product-gallery:not(.product-gallery--single) {
    flex-direction: column;
  }

  .product-gallery-main {
    order: 1;
  }

  .product-gallery-thumbs {
    order: 2;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: none;
    width: 100%;
    scroll-snap-type: x mandatory;
    padding-bottom: 0.35rem;
  }

  .product-gallery-thumb-btn {
    scroll-snap-align: start;
  }

  .product-gallery-main-img {
    height: min(29.5rem, 70vh);
  }
}
</style>
