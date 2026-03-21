<template>
  <div v-show="visible" class="tab-pane panel-section">
    <h2 class="h6 text-uppercase text-muted mb-3">Pie de página</h2>
    <div class="mb-3">
      <label class="form-label">Marca footer</label>
      <input v-model="form.footer_brand" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label class="form-label">Descripción footer</label>
      <textarea v-model="form.footer_description" class="form-control" rows="2"></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Título contacto</label>
      <input v-model="form.footer_contact_title" type="text" class="form-control" />
    </div>
    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Dirección</label>
        <input v-model="form.footer_contact_street" type="text" class="form-control" />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Ciudad</label>
        <input v-model="form.footer_contact_city" type="text" class="form-control" />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Teléfono</label>
        <input v-model="form.footer_contact_phone" type="text" class="form-control" />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">Email</label>
        <input v-model="form.footer_contact_email" type="email" class="form-control" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 mb-3">
        <label class="form-label">Título horario</label>
        <input v-model="form.footer_schedule_title" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Días</label>
        <input v-model="form.footer_schedule_days" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Horas</label>
        <input v-model="form.footer_schedule_hours" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Días 2</label>
        <input v-model="form.footer_schedule_days_2" type="text" class="form-control" />
      </div>
      <div class="col-md-4 mb-0">
        <label class="form-label">Horas 2</label>
        <input v-model="form.footer_schedule_hours_2" type="text" class="form-control" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 mb-3">
        <label class="form-label">Facebook URL</label>
        <input v-model="form.footer_social_facebook" type="url" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">Instagram URL</label>
        <input v-model="form.footer_social_instagram" type="url" class="form-control" />
      </div>
      <div class="col-md-4 mb-3">
        <label class="form-label">WhatsApp</label>
        <input
          v-model="form.footer_social_whatsapp"
          type="text"
          class="form-control"
          inputmode="numeric"
          autocomplete="tel"
          placeholder="529541817823"
        />
      </div>
    </div>
    <div class="mb-3">
      <label class="form-label">Copyright texto</label>
      <input v-model="form.footer_copyright_text" type="text" class="form-control" />
    </div>
    <div class="mb-0">
      <label class="form-label">Hecho con / mensaje final</label>
      <input v-model="form.footer_copyright_made_with" type="text" class="form-control" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
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
