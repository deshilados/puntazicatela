<template>
  <Navbar />
  <div class="card shadow-sm mx-auto pt-5 mb-4" style="max-width: 720px; margin-top: 2rem;">
    <div class="card-body p-4">
      <h1 class="h4 fw-bold mb-3 text-center">{{ isEdit ? 'Editar producto' : 'Nuevo producto' }}</h1>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="loadingEditData" class="placeholder-glow">
        <div class="placeholder col-6 mb-3" style="height: 38px"></div>
        <div class="placeholder col-12 mb-3" style="height: 80px"></div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <div class="placeholder col-12" style="height: 38px"></div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="placeholder col-12" style="height: 38px"></div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="placeholder col-12" style="height: 38px"></div>
          </div>
        </div>
        <div class="placeholder col-12 mb-2" style="height: 38px"></div>
        <div class="placeholder col-12 mb-2" style="height: 38px"></div>
        <div class="placeholder col-12 mb-4" style="height: 38px"></div>
        <div class="placeholder col-5" style="height: 40px"></div>
      </div>

      <form v-else @submit.prevent="submit">
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
          <label class="form-label">Imágenes del producto</label>
          <PathFieldNote />
          <div v-for="(_, idx) in imageNames" :key="'img-' + idx" class="input-group mb-2">
            <span class="input-group-text">#{{ idx + 1 }}</span>
            <input v-model="imageNames[idx]" type="text" class="form-control" placeholder="1_1.jpeg" />
            <button type="button" class="btn btn-outline-danger" :disabled="imageNames.length === 1"
              @click="removeImageField(idx)">
              Quitar
            </button>
          </div>
          <button type="button" class="btn btn-outline-secondary btn-sm" @click="addImageField">
            <i class="bi bi-plus-lg me-1"></i>Agregar imagen
          </button>

          <img v-if="firstImageName" :src="productImageUrl(firstImageName)" alt="Vista previa"
            class="img-thumbnail mt-2 d-block" style="max-height: 120px" />
        </div>
        <div class="mb-3">
          <label class="form-label">Tallas disponibles</label>
          <p class="small text-muted mb-2">
            Agrega cada talla en su propio campo. Se guarda como JSON para que en la vista se lea correctamente.
          </p>

          <div v-for="(_, idx) in tallasNames" :key="'talla-' + idx" class="input-group mb-2">
            <span class="input-group-text">#{{ idx + 1 }}</span>
            <input v-model="tallasNames[idx]" type="text" class="form-control" placeholder="Ej: S" />
            <button type="button" class="btn btn-outline-danger" :disabled="tallasNames.length === 1"
              @click="removeTallaField(idx)">
              Quitar
            </button>
          </div>

          <button type="button" class="btn btn-outline-secondary btn-sm" @click="addTallaField">
            <i class="bi bi-plus-lg me-1"></i>Agregar talla
          </button>
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
          <button type="submit" class="btn btn-primary me-2">{{ isEdit ? 'Guardar cambios' : 'Crear producto' }}</button>
          <router-link :to="cancelTo" class="btn btn-outline-secondary">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
  <ContactoFooter />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import PathFieldNote from '@/components/PathFieldNote.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { useProductsStore } from '@/stores/productsStore';
import { productImageUrl } from '@/utils/productImageUrl';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();

const id = computed(() => Number(route.params.id));
const isEdit = computed(() => !!id.value && id.value > 0);

const categories = ref<string[]>([]);
const error = ref('');
// En edición arrancamos en loading para evitar parpadeo de formulario vacío.
const loadingEditData = ref(isEdit.value);

function safeReturnTo(path: string | undefined): string | null {
  if (!path) return null;
  // Solo aceptamos rutas internas que comiencen con "/".
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  return path;
}

const returnTo = computed(() => safeReturnTo(route.query.returnTo as string | undefined));
const cancelTo = computed(() => returnTo.value ?? '/panel');

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

const imageNames = ref<string[]>(['']);
const tallasNames = ref<string[]>(['']);

function parseImageList(imagenUrl: string | null | undefined): string[] {
  const raw = (imagenUrl ?? '').trim();
  if (!raw) return [];

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x).trim()).filter(Boolean);
      }
    } catch {
      // Fallback a separadores
    }
  }

  return raw.split(/[,\|;]+/g).map((s) => s.trim()).filter(Boolean);
}

function normalizeImageNameEntry(value: string): string {
  const raw = value.trim();
  if (!raw) return '';
  const withoutQuery = raw.split('?')[0].split('#')[0];
  const parts = withoutQuery.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1].trim() : raw;
}

const firstImageName = computed(() => {
  const first = imageNames.value.map((n) => n.trim()).filter(Boolean)[0];
  return first ? normalizeImageNameEntry(first) : null;
});

function addImageField() {
  imageNames.value.push('');
}

function removeImageField(idx: number) {
  if (imageNames.value.length === 1) return;
  imageNames.value.splice(idx, 1);
}

function normalizeTallaEntry(value: string): string {
  const raw = value.trim();
  return raw;
}

function parseTallasList(tallasValue: string | null | undefined): string[] {
  const raw = (tallasValue ?? '').trim();
  if (!raw) return [];

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x).trim()).filter(Boolean);
      }
    } catch {
      // fallback a separadores
    }
  }

  return raw
    .split(/[,\|;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function addTallaField() {
  tallasNames.value.push('');
}

function removeTallaField(idx: number) {
  if (tallasNames.value.length === 1) return;
  tallasNames.value.splice(idx, 1);
}

onMounted(async () => {
  categories.value = await productsStore.getCategoriesAll();
  if (isEdit.value) {
    loadingEditData.value = true;
    try {
      const p = await productsStore.fetchById(id.value);
      if (p) {
        form.nombre = p.nombre;
        form.descripcion = p.descripcion ?? '';
        form.categoria = p.categoria;
        form.precio = p.precio;
        form.stock = p.stock;
        form.imagen_url = p.imagen_url ?? '';
        imageNames.value = parseImageList(form.imagen_url);
        if (!imageNames.value.length) imageNames.value = [''];
        form.activo = p.activo;
        form.portada = p.portada;
        tallasNames.value = parseTallasList(p.tallas_disponibles ?? '');
        if (!tallasNames.value.length) tallasNames.value = [''];
      }
    } finally {
      loadingEditData.value = false;
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

  const normalizedImages = imageNames.value
    .map((name) => normalizeImageNameEntry(name))
    .filter(Boolean);

  form.imagen_url = normalizedImages.length ? JSON.stringify(normalizedImages) : '';

  const normalizedTallas = tallasNames.value
    .map((t) => normalizeTallaEntry(t))
    .filter(Boolean);

  form.tallas_disponibles = normalizedTallas.length ? JSON.stringify(normalizedTallas) : '';

  try {
    Swal.fire({
      title: isEdit.value ? 'Guardando cambios...' : 'Creando producto...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    if (isEdit.value) {
      await productsStore.update(id.value, { ...form });
      Swal.close();
      await Swal.fire({
        icon: 'success',
        title: 'Listo',
        text: 'Producto actualizado correctamente.',
      });
      router.push(returnTo.value ?? '/panel');
    } else {
      await productsStore.create({ ...form });
      Swal.close();
      await Swal.fire({
        icon: 'success',
        title: 'Listo',
        text: 'Producto creado correctamente.',
      });
      router.push(returnTo.value ?? '/panel');
    }
  } catch (e) {
    Swal.close();
    error.value = (e as Error).message;
    void Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.value || 'No se pudo guardar el producto.',
    });
  }
}
</script>
