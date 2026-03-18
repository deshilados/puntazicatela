<template>
  <section class="py-5" style="margin-top: 6rem">
    <div class="container">
      <h1 class="h3 fw-bold mb-3">{{ home.about.title || 'Sobre Nosotros' }}</h1>
      <p class="lead text-muted">{{ home.about.description1 }}</p>
      <p class="text-muted">{{ home.about.description2 }}</p>
      <router-link to="/#nosotros" class="btn btn-dark">Ver más en la página principal</router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSiteContentStore } from '@/stores/siteContentStore';

const siteContent = useSiteContentStore();
const home = computed(() => siteContent.getNestedStructured().home);

onMounted(() => {
  if (Object.keys(siteContent.items).length === 0) siteContent.fetchAll();
});
</script>
