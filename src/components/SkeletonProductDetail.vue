<template>
  <div class="row mb-5">
    <div class="col-lg-6">
      <div class="rounded shadow overflow-hidden bg-white placeholder-glow">
        <div class="card-img-top bg-light" style="height: 500px">
          <div class="placeholder col-12" style="height: 100%"></div>
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2 mt-3">
        <div v-for="n in 5" :key="n" class="placeholder-glow">
          <div
            class="bg-light border rounded"
            style="height: 84px; width: 140px; object-fit: cover; border-radius: 0.5rem"
          />
        </div>
      </div>
    </div>

    <div class="col-lg-6">
      <div class="placeholder-glow">
        <div class="placeholder col-6 mb-3" style="height: 18px"></div>
        <div class="placeholder col-12 mb-3" style="height: 40px"></div>
        <div class="placeholder col-12 mb-4" style="height: 28px"></div>
        <div class="placeholder col-12 mb-3" style="height: 18px"></div>
        <div class="placeholder col-12 mb-3" style="height: 18px"></div>
        <div class="placeholder col-12 mb-4" style="height: 60px"></div>
        <div class="placeholder col-8" style="height: 44px"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Skeleton UI para el detalle de producto.
</script>

