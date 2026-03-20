<template>
  <Navbar />
  <div class="panel-products-page px-5">
    <h1 class="h4 fw-bold text-center pt-5">Productos</h1>
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <span class="text-muted small">{{ productsStore.all.length }} producto(s)</span>
      <router-link to="/panel/crear" class="btn btn-primary btn-sm"><i class="bi bi-plus-lg"></i> Nuevo producto</router-link>
    </div>
    <div class="card shadow-sm mb-4">
      <div v-if="productsStore.loading" class="card-body">
        <div class="placeholder-glow">
          <div class="placeholder col-12 mb-2" style="height: 18px"></div>
          <div class="placeholder col-12 mb-2" style="height: 18px"></div>
          <div class="placeholder col-12 mb-2" style="height: 18px"></div>
          <div class="placeholder col-12 mb-2" style="height: 18px"></div>
          <div class="placeholder col-12 mb-2" style="height: 18px"></div>
        </div>
      </div>
      <div v-else-if="!productsStore.all.length" class="card-body text-center py-5 text-muted">
        <p class="fw-bold mb-2">No hay productos</p>
        <p class="mb-3">Crea el primero desde el botón «Nuevo producto».</p>
        <router-link to="/panel/crear" class="btn btn-primary">Nuevo producto</router-link>
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
                  <img
                    :src="productImageUrl(firstImageFrom(p.imagen_url))"
                    alt=""
                    class="rounded object-fit-cover"
                    width="48"
                    height="48"
                  />
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
  <ContactoFooter />
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import { onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { useProductsStore } from '@/stores/productsStore';
import { productImageUrl } from '@/utils/productImageUrl';

const productsStore = useProductsStore();

onMounted(async () => {
  await productsStore.fetchAll();
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

function firstImageFrom(imagenUrl: string | null | undefined): string | null {
  const raw = (imagenUrl ?? '').trim();
  if (!raw) return null;

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const first = parsed[0];
        return first ? String(first).trim() : null;
      }
    } catch {
      // Fallback a separadores
    }
  }

  return raw.split(/[,\|;]+/g).map((s) => s.trim()).filter(Boolean)[0] ?? null;
}

async function subir(id: number) {
  Swal.fire({
    title: 'Actualizando orden...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const ok = await productsStore.subirOrden(id);
  await productsStore.fetchAll();
  Swal.close();
  await Swal.fire({
    icon: ok ? 'success' : 'error',
    title: ok ? 'Listo' : 'No se pudo',
    text: ok ? 'Orden actualizado.' : 'No se pudo subir este producto.',
  });
}

async function bajar(id: number) {
  Swal.fire({
    title: 'Actualizando orden...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const ok = await productsStore.bajarOrden(id);
  await productsStore.fetchAll();
  Swal.close();
  await Swal.fire({
    icon: ok ? 'success' : 'error',
    title: ok ? 'Listo' : 'No se pudo',
    text: ok ? 'Orden actualizado.' : 'No se pudo bajar este producto.',
  });
}

async function eliminar(p: { id: number; nombre: string }) {
  try {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      text: 'Vas a eliminar definitivamente "' + p.nombre + '".',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: 'Eliminando...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await productsStore.deletePermanent(p.id);
    await productsStore.fetchAll();
    Swal.close();

    await Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'Producto eliminado correctamente.',
    });
  } catch (e) {
    Swal.close();
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: (e as Error).message || 'No se pudo eliminar el producto.',
    });
  }
}
</script>

