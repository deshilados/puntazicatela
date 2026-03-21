<template>
  <ul class="nav nav-pills panel-tabs mb-4" role="tablist">
    <li class="nav-item">
      <button
        type="button"
        class="nav-link"
        :class="{ active: modelValue === 'encabezado' }"
        @click="$emit('update:modelValue', 'encabezado')"
      >
        Encabezado
      </button>
    </li>
    <li class="nav-item">
      <button
        type="button"
        class="nav-link"
        :class="{ active: modelValue === 'portada' }"
        @click="$emit('update:modelValue', 'portada')"
      >
        Portada
      </button>
    </li>
    <li class="nav-item">
      <button
        type="button"
        class="nav-link"
        :class="{ active: modelValue === 'nosotros' }"
        @click="$emit('update:modelValue', 'nosotros')"
      >
        Nosotros
      </button>
    </li>
    <li class="nav-item">
      <button
        type="button"
        class="nav-link"
        :class="{ active: modelValue === 'footer' }"
        @click="$emit('update:modelValue', 'footer')"
      >
        Pie de página
      </button>
    </li>
    <li class="nav-item">
      <button
        type="button"
        class="nav-link"
        :class="{ active: modelValue === 'meta' }"
        @click="$emit('update:modelValue', 'meta')"
      >
        Meta / SEO
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'meta' | 'encabezado' | 'portada' | 'nosotros' | 'footer';
}>();

defineEmits<{
  'update:modelValue': [value: 'meta' | 'encabezado' | 'portada' | 'nosotros' | 'footer'];
}>();
</script>

<style scoped>
.panel-tabs {
  gap: 0.5rem;
}

.panel-tabs .nav-link {
  border-radius: 999px;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0.45rem 0.95rem;
  font-weight: 500;
}

.panel-tabs .nav-link:hover {
  color: #111827;
  border-color: #d1d5db;
}

.panel-tabs .nav-link.active {
  color: #ffffff;
  background: #111827;
  border-color: #111827;
}
</style>
