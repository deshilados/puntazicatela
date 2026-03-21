<template>
  <div class="row mb-5">
    <div class="col-lg-5 min-w-0">
      <div class="product-skeleton-gallery" aria-hidden="true">
        <!-- Mismo orden DOM que ProductoShowGallery: miniaturas | principal -->
        <div class="product-skeleton-thumbs">
          <div v-for="n in 5" :key="n" class="product-skeleton-thumb placeholder-glow">
            <div class="product-skeleton-thumb-inner bg-light border border-secondary rounded" />
          </div>
        </div>

        <div class="product-skeleton-main rounded overflow-hidden bg-white border placeholder-glow w-100">
          <div class="product-skeleton-main-inner bg-light">
            <div class="placeholder col-12" style="height: 100%" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-5 min-w-0">
      <div class="placeholder-glow">
        <div class="placeholder col-6 mb-3" style="height: 18px" />
        <div class="placeholder col-12 mb-3" style="height: 40px" />
        <div class="placeholder col-12 mb-4" style="height: 28px" />
        <div class="placeholder col-12 mb-3" style="height: 18px" />
        <div class="placeholder col-12 mb-3" style="height: 18px" />
        <div class="placeholder col-12 mb-4" style="height: 60px" />
        <div class="placeholder col-8" style="height: 44px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Paridad visual con ProductoShowGallery (miniaturas | principal; móvil: principal arriba, thumbs abajo).
</script>

<style scoped>
/* Igual que .product-gallery */
.product-skeleton-gallery {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: flex-start;
}

.product-skeleton-thumbs {
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

.product-skeleton-thumb {
  flex: 0 0 auto;
}

/* Tamaños alineados con .product-gallery-thumb-img (lg = 8.75rem × 5.25rem) */
.product-skeleton-thumb-inner {
  width: clamp(4.5rem, 28vw, 8.75rem);
  height: clamp(3.25rem, 22vw, 5.25rem);
  border-radius: 0.5rem;
}

@media (min-width: 576px) {
  .product-skeleton-thumb-inner {
    width: clamp(5.5rem, 18vw, 8.75rem);
    height: clamp(4rem, 14vw, 5.25rem);
  }
}

@media (min-width: 768px) {
  .product-skeleton-thumb-inner {
    width: clamp(6.5rem, 12vw, 8.75rem);
    height: clamp(4.5rem, 9vw, 5.25rem);
  }
}

@media (min-width: 992px) {
  .product-skeleton-thumb-inner {
    width: 8.75rem;
    height: 5.25rem;
  }
}

.product-skeleton-main {
  flex-grow: 1;
  min-width: 0;
}

.product-skeleton-main-inner {
  height: 29.5rem;
}

/* Móvil: principal arriba, miniaturas abajo (order + fila con scroll) */
@media (max-width: 575.98px) {
  .product-skeleton-gallery {
    flex-direction: column;
  }

  .product-skeleton-main {
    order: 1;
  }

  .product-skeleton-thumbs {
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

  .product-skeleton-thumb {
    scroll-snap-align: start;
    flex-shrink: 0;
  }

  .product-skeleton-main-inner {
    height: min(29.5rem, 70vh);
  }
}
</style>
