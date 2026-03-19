<template>
  <Navbar />
  <div class="home-deshilados">
    <HomeHeroSection :hero="home.hero" />
    <HomeCollectionSection :collection="home.collection" />
    <HomeAboutSection :about="home.about" />
  </div>

  <ContactoFooter />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import HomeHeroSection from '@/components/sections/HomeHeroSection.vue';
import HomeCollectionSection from '@/components/sections/HomeCollectionSection.vue';
import HomeAboutSection from '@/components/sections/HomeAboutSection.vue';
import { useProductsStore } from '@/stores/productsStore';
import { useSiteContentStore } from '@/stores/siteContentStore';

const productsStore = useProductsStore();
const siteContent = useSiteContentStore();

const home = computed(() => siteContent.getNestedStructured().home);

onMounted(async () => {
  if (Object.keys(siteContent.items).length === 0) await siteContent.fetchAll();
  await productsStore.fetchPortada();
});
</script>

