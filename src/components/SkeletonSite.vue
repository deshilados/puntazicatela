<template>
  <div class="skeleton-site">
    <!-- Skeleton del navbar fijo -->
    <nav class="navbar navbar-expand-lg bg-white shadow-sm fixed-top placeholder-glow" aria-label="Cargando sitio">
      <div class="container-fluid align-items-center">
        <div class="navbar-brand d-flex align-items-center gap-2">
          <span class="placeholder rounded" style="width: 36px; height: 36px;"></span>
          <span class="placeholder rounded" style="width: 190px; height: 20px;"></span>
        </div>
        <span class="navbar-toggler placeholder rounded" style="width: 44px; height: 44px;"></span>
        <div class="d-none d-lg-flex ms-auto align-items-center gap-3">
          <span class="placeholder rounded" style="width: 70px; height: 18px;"></span>
          <span class="placeholder rounded" style="width: 85px; height: 18px;"></span>
          <span class="placeholder rounded" style="width: 70px; height: 18px;"></span>
          <span class="placeholder rounded" style="width: 90px; height: 18px;"></span>
          <span class="placeholder rounded" style="width: 150px; height: 38px;"></span>
          <span class="placeholder rounded" style="width: 42px; height: 38px;"></span>
        </div>
      </div>
    </nav>

    <!-- Skeleton contenido (no skeleton por componente) -->
    <main class="container pt-5">
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="bg-white rounded shadow-sm placeholder-glow" style="height: 440px;">
            <div class="placeholder col-12" style="height: 100%;"></div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="placeholder-glow">
            <div class="placeholder col-10 mb-3" style="height: 34px;"></div>
            <div class="placeholder col-12 mb-3" style="height: 20px;"></div>
            <div class="placeholder col-12 mb-3" style="height: 20px;"></div>
            <div class="placeholder col-9 mb-4" style="height: 20px;"></div>
            <div class="placeholder col-4 mb-4" style="height: 44px;"></div>

            <div class="border rounded p-3">
              <div class="placeholder col-12 mb-2" style="height: 16px;"></div>
              <div class="placeholder col-12 mb-2" style="height: 16px;"></div>
              <div class="placeholder col-12 mb-2" style="height: 16px;"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <div class="row g-4">
          <div v-for="n in 6" :key="n" class="col-md-6 col-lg-4">
            <div class="card shadow-sm placeholder-glow h-100">
              <div class="card-img-top bg-light">
                <div class="placeholder col-12" style="height: 220px;"></div>
              </div>
              <div class="card-body">
                <div class="placeholder col-10 mb-2" style="height: 16px;"></div>
                <div class="placeholder col-9 mb-2" style="height: 16px;"></div>
                <div class="placeholder col-6" style="height: 16px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Skeleton global mientras carga site_content.
</script>

