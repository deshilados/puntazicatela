<template>
  <div v-show="visible" class="tab-pane panel-section">
    <h2 class="h6 text-uppercase text-muted mb-3">Portada</h2>
    <div class="mb-3">
      <label class="form-label">Lugar hero</label>
      <input v-model="form.home_hero_location" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">Título hero</label>
      <input v-model="form.home_hero_title" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">Descripción hero</label>
      <textarea v-model="form.home_hero_description" class="form-control" rows="2"></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Título sección colección</label>
      <input v-model="form.home_collection_title" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">Descripción colección</label>
      <textarea v-model="form.home_collection_description" class="form-control" rows="2"></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Mensaje cuando no hay productos</label>
      <input v-model="form.home_collection_no_products" type="text" class="form-control" />
    </div>
    <div class="mb-0 pt-3 border-top">
      <label class="form-label">Ruta imagen banner</label>
      <PathFieldNote />
      <input v-model="form.home_hero_image" type="text" class="form-control" />
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
