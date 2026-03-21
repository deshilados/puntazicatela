<template>
  <div>
    <span class="small text-uppercase text-muted d-block mb-2">{{ product.categoria }}</span>
    <h1 class="display-4 fw-normal mb-3">{{ product.nombre }}</h1>
    <p class="display-5 fw-semibold mb-4 text-success">${{ Number(product.precio).toFixed(2) }} MXN</p>
    <p v-if="product.descripcion" class="text-muted mb-4" style="line-height: 1.8">{{ product.descripcion }}</p>
    <div v-if="product.tallas_disponibles" class="my-4">
      <h5 class="mb-3">Tallas Disponibles:</h5>
      <span v-for="t in tallas" :key="t" class="badge border border-secondary text-dark me-2 mb-2">{{ t }}</span>
    </div>
    <div class="p-3 rounded border-start border-4 my-4" :class="product.stock > 0 ? 'border-success' : 'border-danger'">
      <h5 class="mb-2">
        <i v-if="product.stock > 0" class="bi bi-check-circle text-success"></i>
        <i v-else class="bi bi-x-circle text-danger"></i>
        {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
      </h5>
      <p class="mb-0">
        <template v-if="product.stock > 0">Stock disponible: <strong>{{ product.stock }}</strong> unidades</template>
        <template v-else>Este producto está temporalmente agotado</template>
      </p>
    </div>
    <div class="d-flex flex-wrap align-items-end gap-3 mt-4">
      <div v-if="product.stock > 0" class="d-flex flex-wrap align-items-end gap-2">
        <div v-if="tallas.length" class="me-1">
          <label class="form-label small mb-1">Talla</label>
          <select v-model="selectedTalla" class="form-select form-select-sm" style="min-width: 8rem">
            <option value="">Elige talla</option>
            <option v-for="t in tallas" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label class="form-label small mb-1">Cantidad</label>
          <input v-model.number="quantity" type="number" min="1" :max="product.stock"
            class="form-control form-control-sm" style="width: 5rem" />
        </div>
        <button type="button" class="btn btn-success" :disabled="!canAddToCart" @click="onAddToCart">
          <i class="bi bi-basket me-1"></i>Añadir al carrito
        </button>
      </div>
      <!-- <router-link :to="'/ordenar?producto=' + product.id" class="btn btn-success">
        <i class="bi bi-cart-plus me-2"></i>Solicitar este producto
      </router-link> -->
      <router-link :to="'/categorias?cat=' + encodeURIComponent(product.categoria)" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>Ir a {{ product.categoria }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Swal from 'sweetalert2';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/stores/productsStore';

const props = defineProps<{
  product: Product;
  tallas: string[];
}>();

const cart = useCartStore();
const selectedTalla = ref('');
const quantity = ref(1);

watch(
  () => props.product.id,
  () => {
    selectedTalla.value = '';
    quantity.value = 1;
  },
);

const canAddToCart = computed(() => {
  if (props.product.stock <= 0) return false;
  if (props.tallas.length && !selectedTalla.value.trim()) return false;
  const q = Number(quantity.value);
  return Number.isFinite(q) && q >= 1 && q <= props.product.stock;
});

function onAddToCart() {
  if (!canAddToCart.value) return;
  const q = Math.floor(Number(quantity.value));
  cart.addLine(props.product.id, q, selectedTalla.value, props.product.stock);
  void Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: 'Añadido al carrito',
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
}
</script>
