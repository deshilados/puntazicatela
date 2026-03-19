<template>
  <div class="row g-4">
    <div v-for="n in count" :key="n" class="col-md-6 col-lg-4">
      <div class="card shadow-sm h-100 placeholder-glow">
        <div class="card-img-top bg-light" style="height: 320px">
          <div class="placeholder col-12" style="height: 100%"></div>
        </div>
        <div class="card-body">
          <div class="placeholder col-8 mb-2"></div>
          <div class="placeholder col-10 mb-2"></div>
          <div class="placeholder col-7 mb-2"></div>
          <div class="placeholder col-6"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count?: number;
}>();
</script>

