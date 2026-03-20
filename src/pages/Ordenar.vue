<template>
  <Navbar />
  <div class="pt-5" style="min-height: 70vh">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <div class="row mb-5">
            <div class="col-12 text-center">
              <p class="small text-uppercase text-success mb-2">Haz tu Pedido</p>
              <h2 class="display-4 fw-normal mb-3">Solicita tu Producto</h2>
              <p class="text-muted mx-auto" style="max-width: 600px">
                Completa el formulario y nos pondremos en contacto contigo. Realizamos envíos a todo México y al extranjero.
              </p>
            </div>
          </div>

          <div class="row g-4 align-items-stretch">
            <div v-if="selectedProduct" class="col-lg-4 d-flex">
              <div class="card shadow-sm p-4 bg-light h-100 w-100">
                <img
                  :src="productImageUrl(firstImageFrom(selectedProduct.imagen_url))"
                  :alt="selectedProduct.nombre"
                  class="product-preview-image rounded shadow mb-3"
                />
                <div class="small text-uppercase text-muted mb-2">{{ selectedProduct.categoria }}</div>
                <h3 class="h3 mb-2">{{ selectedProduct.nombre }}</h3>
                <p class="h4 fw-semibold text-success mb-3">${{ Number(selectedProduct.precio).toFixed(2) }} MXN</p>
                <p v-if="selectedProduct.descripcion" class="text-muted small mb-0">
                  {{ selectedProduct.descripcion.slice(0, 100) }}{{ selectedProduct.descripcion.length > 100 ? '...' : '' }}
                </p>
              </div>
            </div>

            <div class="d-flex" :class="selectedProduct ? 'col-lg-8' : 'col-lg-12'">
              <div class="card shadow-sm p-4 p-lg-5 bg-light h-100 w-100">
                <form @submit.prevent="submitOrder">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">Nombre Completo *</label>
                      <input v-model="form.name" type="text" class="form-control" required placeholder="Ej: Juan Pérez" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Selecciona un Producto *</label>
                      <select v-model="form.productId" class="form-select" required>
                        <option value="">Elige un producto...</option>
                        <option v-for="p in allProducts" :key="p.id" :value="p.id">
                          {{ p.nombre }} - ${{ Number(p.precio).toFixed(2) }} MXN
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Talla</label>
                      <select v-model="form.size" class="form-select">
                        <option value="">Selecciona una talla</option>
                        <option v-for="t in tallasOpciones" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">Dirección</label>
                      <input v-model="form.address" type="text" class="form-control" placeholder="Ej: Calle, número, colonia, ciudad" />
                    </div>
                    <div class="col-12">
                      <label class="form-label">Notas Adicionales</label>
                      <textarea v-model="form.message" class="form-control" rows="3" placeholder="Comentarios, instrucciones especiales, etc."></textarea>
                    </div>
                    <div class="col-12 mt-4">
                      <button type="submit" class="btn btn-success flex-sm-fill">
                        <i class="bi bi-whatsapp me-2"></i>Solicitar Pedido
                      </button>
                      <router-link
                        :to="selectedProduct ? '/producto/' + selectedProduct.id : '/'"
                        class="btn btn-outline-secondary flex-sm-fill ms-2"
                      >
                        <i class="bi bi-arrow-left me-2"></i>Volver
                      </router-link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="row m-5">
            <div class="col-12 text-center text-muted">
              <p class="mb-2"><i class="bi bi-check-circle me-2"></i> Envío seguro a todo México</p>
              <p class="mb-2"><i class="bi bi-check-circle me-2"></i> Pago contra entrega disponible</p>
              <p class="mb-0"><i class="bi bi-check-circle me-2"></i> Garantía de autenticidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ContactoFooter />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { useProductsStore } from '@/stores/productsStore';
import { useSiteContentStore } from '@/stores/siteContentStore';
import { numberToWhatsAppUrl } from '@/stores/siteContentStore';
import { productImageUrl } from '@/utils/productImageUrl';
import type { Product } from '@/stores/productsStore';

const route = useRoute();
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

const form = ref({
  name: '',
  productId: '',
  size: '',
  address: '',
  message: ''
});

const allProducts = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);

const tallasOpciones = computed(() => {
  const p = selectedProduct.value;
  if (!p?.tallas_disponibles) return [];

  const raw = p.tallas_disponibles.trim();
  if (!raw) return [];

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
    } catch {
      // fallback legacy
    }
  }

  return raw.split(/[,\|;]+/g).map((s) => s.trim()).filter(Boolean);
});

watch(
  () => form.value.productId,
  (id) => {
    const n = Number(id);
    selectedProduct.value = allProducts.value.find((p) => p.id === n) ?? null;
  }
);

onMounted(async () => {
  await productsStore.fetchActive();
  allProducts.value = productsStore.items;
  const id = route.query.producto;
  if (id) {
    const num = Number(id);
    form.value.productId = num ? String(num) : '';
    selectedProduct.value = allProducts.value.find((p) => p.id === num) ?? null;
  }
});

function submitOrder() {
  const siteContent = useSiteContentStore();
  const content = siteContent.getNestedStructured();
  const wa = content.footer.social.whatsapp;
  const productId = form.value.productId;
  const product = allProducts.value.find((p) => p.id === Number(productId));
  const productInfo = product ? `${product.nombre} ($${Number(product.precio).toFixed(2)})` : 'Producto personalizado';
  const text = `Hola, me interesa hacer un pedido.\n\nNombre: ${form.value.name}\nProducto: ${productInfo}\nTalla: ${form.value.size || '-'}\nDirección: ${form.value.address || '-'}\nMensaje: ${form.value.message || '-'}`;
  const waUrl = wa || numberToWhatsAppUrl('529541817823');
  const url = waUrl.replace(/\/$/, '') + '?text=' + encodeURIComponent(text);
  window.open(url, '_blank');
}
</script>

<style scoped>
.product-preview-image {
  width: 100%;
  max-width: 400px;
  height: 400px;
  object-fit: cover;
}
</style>

