<template>
  <div id="app">
    <SkeletonSite v-if="!siteReady" />
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useSiteContentStore } from '@/stores/siteContentStore';
import SkeletonSite from '@/components/SkeletonSite.vue';

const siteContent = useSiteContentStore();
const siteReady = ref(false);

const hasLoadedSomeContent = computed(() => Object.keys(siteContent.items).length > 0);

onMounted(async () => {
  try {
    // Si todavía no se cargó el contenido del sitio, lo pedimos aquí para evitar flicker.
    if (!hasLoadedSomeContent.value) {
      await siteContent.fetchAll();
    }
  } catch (_) {
    // Si falla, igual renderizamos para que se vean defaults de las vistas.
  } finally {
    siteReady.value = true;
  }
});
</script>

<style>
#app {
  min-height: 100vh;
  /* Compensar el `fixed-top` del navbar para que el contenido no quede tapado. */
  padding-top: 2rem;
}
.navbar.fixed-top {
  z-index: 1030;
}
</style>
