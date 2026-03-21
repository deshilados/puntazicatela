<template>
  <div v-if="related.length" class="mt-5 pt-4 border-top mb-5 related-products-wrap">
    <h3 class="display-5 fw-normal mb-4">Productos Relacionados</h3>
    <div class="position-relative">
      <button
        v-show="canRelatedPrev"
        type="button"
        class="btn btn-light border shadow-sm related-carousel-nav related-carousel-nav--prev"
        aria-label="Ver productos anteriores"
        @click="shiftRelatedWindow(-1)"
      >
        <i class="bi bi-chevron-left" aria-hidden="true" />
      </button>
      <button
        v-show="canRelatedNext"
        type="button"
        class="btn btn-light border shadow-sm related-carousel-nav related-carousel-nav--next"
        aria-label="Ver el siguiente grupo de productos"
        @click="shiftRelatedWindow(1)"
      >
        <i class="bi bi-chevron-right" aria-hidden="true" />
      </button>
      <div
        ref="relatedViewportEl"
        class="related-viewport"
        role="region"
        aria-label="Productos relacionados"
        tabindex="0"
        :style="relatedViewportCssVars"
        @keydown="onRelatedCarouselKeydown"
      >
        <div class="related-track" :style="relatedTrackStyle">
          <div v-for="r in related" :key="r.id" class="related-track__cell">
            <ProductCard :product="r" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import type { Product } from '@/stores/productsStore';
import ProductCard from '@/components/ProductCard.vue';

const props = defineProps<{
  related: Product[];
  /** Cuando el padre terminó de cargar (no skeleton). */
  ready: boolean;
}>();

const relatedLayoutColumns = ref(1);
const relatedItemsPerPage = ref(1);
const relatedWindowStart = ref(0);
const relatedViewportWidthPx = ref(0);
const relatedViewportEl = ref<HTMLElement | null>(null);

let relatedResizeObserver: ResizeObserver | null = null;

const MIN_RELATED_CARD_PX = 240;
const RELATED_GAP_PX = 20;
const MAX_RELATED_PER_PAGE = 4;

const relatedCellWidthPx = computed(() => {
  const w = relatedViewportWidthPx.value;
  const cols = Math.max(1, relatedLayoutColumns.value);
  if (w < 1) return 0;
  return (w - (cols - 1) * RELATED_GAP_PX) / cols;
});

const relatedViewportCssVars = computed(() => ({
  '--related-cell-w': relatedCellWidthPx.value > 0 ? `${relatedCellWidthPx.value}px` : '280px',
}));

const relatedTrackStyle = computed(() => {
  const cell = relatedCellWidthPx.value;
  const step = cell > 0 ? cell + RELATED_GAP_PX : 0;
  const x = relatedWindowStart.value * step;
  return {
    transform: `translate3d(-${x}px, 0, 0)`,
  };
});

const canRelatedPrev = computed(() => relatedWindowStart.value > 0);
const canRelatedNext = computed(() => {
  const len = props.related.length;
  const ipp = Math.max(1, relatedItemsPerPage.value);
  return relatedWindowStart.value + ipp < len;
});

function updateRelatedItemsPerPage() {
  const el = relatedViewportEl.value;
  if (!el || !props.related.length) return;
  const w = el.clientWidth;
  relatedViewportWidthPx.value = w;
  if (w < 1) return;
  const n = Math.max(1, Math.floor((w + RELATED_GAP_PX) / (MIN_RELATED_CARD_PX + RELATED_GAP_PX)));
  relatedLayoutColumns.value = Math.min(n, MAX_RELATED_PER_PAGE);
  relatedItemsPerPage.value = Math.min(relatedLayoutColumns.value, props.related.length);
  clampRelatedWindowStart();
}

function clampRelatedWindowStart() {
  const len = props.related.length;
  const ipp = Math.max(1, relatedItemsPerPage.value);
  if (len <= ipp) {
    relatedWindowStart.value = 0;
    return;
  }
  const maxStart = len - ipp;
  if (relatedWindowStart.value > maxStart) {
    relatedWindowStart.value = maxStart;
  }
}

function shiftRelatedWindow(direction: 1 | -1) {
  const len = props.related.length;
  const ipp = Math.max(1, relatedItemsPerPage.value);
  if (len <= ipp) return;
  const maxStart = len - ipp;
  const next = relatedWindowStart.value + direction;
  if (next < 0 || next > maxStart) return;
  relatedWindowStart.value = next;
}

function onRelatedCarouselKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    shiftRelatedWindow(-1);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    shiftRelatedWindow(1);
  }
}

function bindRelatedViewportObserver() {
  relatedResizeObserver?.disconnect();
  relatedResizeObserver = null;
  const el = relatedViewportEl.value;
  if (!el || typeof ResizeObserver === 'undefined') {
    updateRelatedItemsPerPage();
    return;
  }
  relatedResizeObserver = new ResizeObserver(() => updateRelatedItemsPerPage());
  relatedResizeObserver.observe(el);
  updateRelatedItemsPerPage();
}

watch(
  () => props.related,
  async () => {
    relatedWindowStart.value = 0;
    await nextTick();
    requestAnimationFrame(() => bindRelatedViewportObserver());
  },
  { deep: true },
);

watch(
  () => [props.ready, props.related.length] as const,
  async ([isReady, len]) => {
    if (!isReady || !len) return;
    await nextTick();
    requestAnimationFrame(() => bindRelatedViewportObserver());
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('resize', updateRelatedItemsPerPage);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateRelatedItemsPerPage);
  relatedResizeObserver?.disconnect();
  relatedResizeObserver = null;
});
</script>

<style scoped>
.related-products-wrap {
  --related-nav-offset: 0.25rem;
  --related-gap: 20px;
}

.related-viewport {
  overflow: hidden;
  width: 100%;
}

.related-viewport:focus-visible {
  outline: 2px solid var(--bs-success, #198754);
  outline-offset: 2px;
}

.related-track {
  display: flex;
  gap: var(--related-gap);
  min-width: 0;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}

.related-track__cell {
  flex: 0 0 var(--related-cell-w, 280px);
  min-width: 0;
}

.related-carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-carousel-nav--prev {
  left: var(--related-nav-offset);
}

.related-carousel-nav--next {
  right: var(--related-nav-offset);
}

@media (max-width: 575.98px) {
  .related-carousel-nav {
    width: 2.25rem;
    height: 2.25rem;
  }
}
</style>
