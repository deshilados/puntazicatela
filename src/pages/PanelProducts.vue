<template>
  <Navbar />
  <div>
    <h1 class="h4 fw-bold text-center">Productos</h1>
    <div v-if="flash" class="alert" :class="flashType">{{ flash }}</div>
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <span class="text-muted small">{{ productsStore.all.length }} producto(s)</span>
      <router-link to="/panel/crear" class="btn btn-dark btn-sm"><i class="bi bi-plus-lg"></i> Nuevo producto</router-link>
    </div>
    <div class="card shadow-sm mb-4">
      <div v-if="!productsStore.all.length" class="card-body text-center py-5 text-muted">
        <p class="fw-bold mb-2">No hay productos</p>
        <p class="mb-3">Crea el primero desde el botón «Nuevo producto».</p>
        <router-link to="/panel/crear" class="btn btn-dark">Nuevo producto</router-link>
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Orden</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Portada</th>
              <th>Estado</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productsStore.all" :key="p.id">
              <td>
                <button type="button" class="btn btn-sm btn-outline-secondary me-1" title="Subir" @click="subir(p.id)" :disabled="isFirst(p)"><i class="bi bi-chevron-up"></i></button>
                <button type="button" class="btn btn-sm btn-outline-secondary" title="Bajar" @click="bajar(p.id)" :disabled="isLast(p)"><i class="bi bi-chevron-down"></i></button>
              </td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <img :src="productImageUrl(p.imagen_url)" alt="" class="rounded object-fit-cover" width="48" height="48" />
                  <span class="fw-medium">{{ p.nombre }}</span>
                </div>
              </td>
              <td><span class="text-muted small">{{ p.categoria }}</span></td>
              <td>${{ Number(p.precio).toFixed(2) }}</td>
              <td>{{ p.stock }}</td>
              <td>
                <span class="badge" :class="p.portada ? 'bg-primary' : 'bg-secondary'">{{ p.portada ? 'Sí' : 'No' }}</span>
              </td>
              <td>
                <span class="badge" :class="p.activo ? 'bg-success' : 'bg-danger'">{{ p.activo ? 'Activo' : 'Inactivo' }}</span>
              </td>
              <td class="text-end">
                <router-link :to="'/panel/editar/' + p.id" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil-square"></i></router-link>
                <button type="button" class="btn btn-sm btn-outline-danger" @click="eliminar(p)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { productImageUrl } from '@/utils/productImageUrl';

const router = useRouter();
const route = useRoute();
const productsStore = useProductsStore();

const flash = ref('');
const flashType = ref('alert-success');

onMounted(async () => {
  await productsStore.fetchAll();
  const m = route.query.msg as string;
  const t = route.query.type as string;
  if (m) {
    flash.value = m;
    flashType.value = t === 'danger' ? 'alert-danger' : 'alert-success';
  }
});

function isFirst(p: { id: number }) {
  const list = productsStore.all;
  const i = list.findIndex((x) => x.id === p.id);
  return i <= 0;
}

function isLast(p: { id: number }) {
  const list = productsStore.all;
  const i = list.findIndex((x) => x.id === p.id);
  return i < 0 || i >= list.length - 1;
}

async function subir(id: number) {
  const ok = await productsStore.subirOrden(id);
  await productsStore.fetchAll();
  if (ok) flash.value = 'Orden actualizado';
  else flash.value = 'No se pudo subir';
}

async function bajar(id: number) {
  const ok = await productsStore.bajarOrden(id);
  await productsStore.fetchAll();
  if (ok) flash.value = 'Orden actualizado';
  else flash.value = 'No se pudo bajar';
}

async function eliminar(p: { id: number; nombre: string }) {
  if (!confirm('¿Eliminar definitivamente "' + p.nombre + '"?')) return;
  try {
    await productsStore.deletePermanent(p.id);
    router.replace({ path: '/panel', query: { msg: 'Producto eliminado', type: 'success' } });
    await productsStore.fetchAll();
  } catch (e) {
    flash.value = (e as Error).message;
    flashType.value = 'alert-danger';
  }
}
</script>

