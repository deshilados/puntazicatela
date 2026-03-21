<template>
  <div class="card shadow-sm h-100 position-relative" style="cursor: pointer" @click="go">
    <div class="position-relative">
      <img :src="productImageUrl(firstImageFrom(product.imagen_url))" :alt="product.nombre" class="card-img-top"
        style="height: 100%; object-fit: cover" loading="lazy" />

      <div v-if="adminAuth.isAdmin" class="position-absolute top-0 end-0 p-2 d-flex gap-2" style="z-index: 3">
        <router-link
          :to="{ path: '/panel/editar/' + product.id, query: { returnTo: route.fullPath } }"
          class="btn btn-sm btn-primary"
          style="pointer-events: auto" @click.stop title="Editar">
          <i class="bi bi-pencil-square"></i>
        </router-link>

        <button type="button" class="btn btn-sm btn-danger" style="pointer-events: auto" @click.stop="eliminar"
          title="Eliminar">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <span class="small text-uppercase text-muted d-block mb-2">{{ product.categoria }}</span>
      <h3 class="h5 mb-2">{{ product.nombre }}</h3>
      <p class="fw-semibold text-success mb-2">${{ Number(product.precio).toFixed(2) }} MXN</p>
      <small v-if="product.stock > 0" class="text-muted">Stock: {{ product.stock }}</small>
      <small v-else class="text-danger">Agotado</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useProductsStore, type Product } from '@/stores/productsStore';
import { productImageUrl } from '@/utils/productImageUrl';

const props = defineProps<{ product: Product }>();
const router = useRouter();
const route = useRoute();
const adminAuth = useAdminAuthStore();
const productsStore = useProductsStore();

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

function go() {
  router.push('/producto/' + props.product.id);
}

async function eliminar() {
  if (!adminAuth.isAdmin) return;

  try {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      text: 'Vas a eliminar definitivamente "' + props.product.nombre + '".',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: 'Eliminando...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    await productsStore.deletePermanent(props.product.id);
    // En Home se muestra `portada`, así que refrescamos ese set para que desaparezca el card.
    await productsStore.fetchPortada();

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
