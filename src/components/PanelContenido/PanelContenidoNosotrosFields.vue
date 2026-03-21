<template>
  <div v-show="visible" class="tab-pane panel-section">
    <h2 class="h6 text-uppercase text-muted mb-3">Sección nosotros</h2>
    <div class="mb-3">
      <label class="form-label">Badge (ej: Nuestra Historia)</label>
      <input v-model="form.home_about_badge" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">Título nosotros</label>
      <input v-model="form.home_about_title" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">Descripción 1</label>
      <textarea v-model="form.home_about_description1" class="form-control" rows="2"></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Descripción 2</label>
      <textarea v-model="form.home_about_description2" class="form-control" rows="2"></textarea>
    </div>
    <div class="row">
      <div class="col-md-4 mb-3">
        <label class="form-label">Stat 1 valor (ej: 15+)</label>
        <input v-model="form.home_about_stats_years_value" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Stat 1 etiqueta</label>
        <input v-model="form.home_about_stats_years_label" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Stat 2 valor</label>
        <input v-model="form.home_about_stats_countrys_value" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Stat 2 etiqueta</label>
        <input v-model="form.home_about_stats_countrys_label" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Stat 3 valor</label>
        <input v-model="form.home_about_stats_products_value" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-0">
        <label class="form-label">Stat 3 etiqueta</label>
        <input v-model="form.home_about_stats_products_label" type="text" class="form-control" />
      </div>
    </div>
    <div class="mb-0 pt-3 border-top">
      <label class="form-label">Ruta imagen nosotros</label>
      <PathFieldNote />
      <input v-model="form.home_about_image" type="text" class="form-control" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import PathFieldNote from '@/components/PathFieldNote.vue';
import { PANEL_CONTENIDO_FORM_KEY } from './injectionKeys';

defineProps<{
  visible: boolean;
}>();

const form = inject(PANEL_CONTENIDO_FORM_KEY)!;
</script>

<style scoped>
.panel-section {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  background: #ffffff;
}

.form-label {
  font-weight: 500;
}
</style>
