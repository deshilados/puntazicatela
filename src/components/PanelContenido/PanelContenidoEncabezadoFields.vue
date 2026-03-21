<template>
  <div v-show="visible" class="tab-pane panel-section">
    <h2 class="h6 text-uppercase text-muted mb-3">Encabezado (navbar)</h2>
    <div class="mb-3">
      <label class="form-label">Marca (navbar)</label>
      <input v-model="form.navbar_brand" type="text" class="form-control" />
    </div>
    <div class="mb-0 pt-3 border-top">
      <label class="form-label">Ruta logotipo navbar</label>
      <PathFieldNote />
      <input v-model="form.navbar_logo" type="text" class="form-control" />
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
