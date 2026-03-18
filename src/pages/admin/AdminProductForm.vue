<template>
  <div class="card shadow-sm mx-auto mb-4" style="max-width: 720px; margin-top: 6rem">
    <div class="card-body p-4">
      <h1 class="h4 fw-bold mb-3 text-center">{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</h1>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre <span class="text-danger">*</span></label>
          <input v-model="form.nombre" type="text" class="form-control" id="nombre" required />
        </div>
        <div class="mb-3">
          <label for="descripcion" class="form-label">Descripción</label>
          <textarea v-model="form.descripcion" class="form-control" id="descripcion" rows="3"></textarea>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="categoria" class="form-label">Categoría <span class="text-danger">*</span></label>
            <input v-model="form.categoria" type="text" class="form-control" list="categorias-list" required />
            <datalist id="categorias-list">
              <option v-for="c in categories" :key="c" :value="c"></option>
            </datalist>
          </div>
          <div class="col-md-3 mb-3">
            <label for="precio" class="form-label">Precio <span class="text-danger">*</span></label>
            <input v-model.number="form.precio" type="number" step="0.01" class="form-control" required />
          </div>
          <div class="col-md-3 mb-3">
            <label for="stock" class="form-label">Stock</label>
            <input v-model.number="form.stock" type="number" min="0" class="form-control" />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Imagen del producto</label>
          <p class="small text-muted">Ruta de la imagen (ej: productos/1.jpg o URL). Los archivos los subes tú al servidor.</p>
          <input v-model="form.imagen_url" type="text" class="form-control" placeholder="productos/1.jpg" />
          <img v-if="isEdit && form.imagen_url" :src="productImageUrl(form.imagen_url)" alt="Vista previa" class="img-thumbnail mt-2" style="max-height: 120px" />
        </div>
        <div class="mb-3">
          <label class="form-label">Tallas disponibles (separadas por coma)</label>
          <input v-model="form.tallas_disponibles" type="text" class="form-control" placeholder="S, M, L" />
        </div>
        <div class="mb-4">
          <div class="form-check form-check-inline">
            <input v-model="form.activo" class="form-check-input" type="checkbox" id="activo" />
            <label class="form-check-label" for="activo">Activo (visible en tienda)</label>
          </div>
          <div class="form-check form-check-inline">
            <input v-model="form.portada" class="form-check-input" type="checkbox" id="portada" />
            <label class="form-check-label" for="portada">Mostrar en portada</label>
          </div>
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-dark me-2">{{ isEdit ? 'Guardar cambios' : 'Crear producto' }}</button>
          <router-link to="/admin" class="btn btn-outline-secondary">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { productImageUrl } from '@/utils/productImageUrl';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const id = computed(() => Number(route.params.id));
const isEdit = computed(() => !!id.value && id.value > 0);

const categories = ref<string[]>([]);
const error = ref('');

const form = reactive({
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: 0,
  stock: 0,
  imagen_url: '',
  activo: true,
  portada: false,
  tallas_disponibles: ''
});

onMounted(async () => {
  categories.value = await productsStore.getCategoriesAll();
  if (isEdit.value) {
    const p = await productsStore.fetchById(id.value);
    if (p) {
      form.nombre = p.nombre;
      form.descripcion = p.descripcion ?? '';
      form.categoria = p.categoria;
      form.precio = p.precio;
      form.stock = p.stock;
      form.imagen_url = p.imagen_url ?? '';
      form.activo = p.activo;
      form.portada = p.portada;
      form.tallas_disponibles = p.tallas_disponibles ?? '';
    }
  }
});

async function submit() {
  error.value = '';
  if (!form.nombre.trim() || !form.categoria.trim()) {
    error.value = 'Nombre y categoría son obligatorios.';
    return;
  }
  if (form.precio <= 0) {
    error.value = 'El precio debe ser mayor que 0.';
    return;
  }
  try {
    if (isEdit.value) {
      await productsStore.update(id.value, { ...form });
      router.push({ path: '/admin', query: { msg: 'Producto actualizado', type: 'success' } });
    } else {
      await productsStore.create({ ...form });
      router.push({ path: '/admin', query: { msg: 'Producto creado', type: 'success' } });
    }
  } catch (e) {
    error.value = (e as Error).message;
  }
}
</script>
