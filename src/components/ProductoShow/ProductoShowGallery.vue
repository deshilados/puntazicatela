<template>
  <div>
    <div class="rounded shadow overflow-hidden">
      <img
        v-if="images.length"
        :src="productImageUrl(activeImageUrl)"
        :alt="productName"
        class="w-100"
        style="height: 500px; object-fit: cover"
      />
      <img
        v-else
        :src="productImageUrl(imagenUrl)"
        :alt="productName"
        class="w-100"
        style="height: 500px; object-fit: cover"
      />
    </div>

    <div
      v-if="images.length"
      class="product-gallery-thumbs"
      role="list"
      aria-label="Galería de imágenes del producto"
    >
      <button
        v-for="(img, idx) in images"
        :key="img + '-' + idx"
        type="button"
        class="btn btn-sm p-0 product-gallery-thumb-btn"
        :class="idx === activeIndex ? 'border border-3 border-success' : 'border border-secondary'"
        @click="activeIndex = idx"
        :aria-label="'Ver imagen ' + (idx + 1)"
        :aria-pressed="idx === activeIndex"
      >
        <img
          :src="productImageUrl(img)"
          :alt="'Imagen ' + (idx + 1) + ' de ' + productName"
          class="img-thumbnail product-gallery-thumb-img"
        />
      </button>
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
.product-gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  padding-bottom: 0.35rem;
  scrollbar-width: thin;
}

.product-gallery-thumb-btn {
  flex: 0 0 auto;
  scroll-snap-align: start;
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
  .product-gallery-thumbs {
    flex-wrap: wrap;
    overflow-x: visible;
    scroll-snap-type: none;
  }

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
</style>
