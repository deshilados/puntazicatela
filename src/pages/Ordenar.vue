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
            <div v-if="cartMode" class="col-lg-4 d-flex">
              <div class="card shadow-sm p-4 bg-light h-100 w-100">
                <h3 class="h5 mb-3">Tu carrito</h3>
                <p class="small text-muted mb-3">
                  Revisa las piezas y envía el pedido por WhatsApp. Puedes ajustar cantidades o quitar líneas.
                </p>
                <ul class="list-unstyled mb-0 cart-lines">
                  <li
                    v-for="row in cartLinesResolved"
                    :key="row.key"
                    class="border-bottom pb-3 mb-3"
                  >
                    <div class="d-flex gap-2">
                      <img
                        v-if="row.product"
                        :src="productImageUrl(firstImageFrom(row.product.imagen_url))"
                        :alt="row.product.nombre"
                        class="cart-thumb rounded"
                      />
                      <div class="flex-grow-1 min-w-0">
                        <div class="fw-semibold small">{{ row.product?.nombre ?? 'Producto' }}</div>
                        <div class="text-success small">
                          ${{ row.product ? Number(row.product.precio).toFixed(2) : '—' }} MXN
                          <span v-if="row.line.talla" class="text-muted"> · Talla {{ row.line.talla }}</span>
                        </div>
                        <div class="d-flex flex-wrap align-items-center gap-2 mt-2">
                          <label class="small mb-0">Cant.</label>
                          <input
                            type="number"
                            class="form-control form-control-sm"
                            style="width: 4.5rem"
                            :min="1"
                            :max="row.maxQty"
                            :value="row.line.quantity"
                            @change="onCartQtyChange(row, $event)"
                          />
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            @click="removeCartLine(row)"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
                <button type="button" class="btn btn-outline-secondary btn-sm w-100" @click="clearCart">
                  Vaciar carrito
                </button>
              </div>
            </div>

            <div v-else-if="selectedProduct" class="col-lg-4 d-flex">
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

            <div class="d-flex" :class="sideColumnClass">
              <div class="card shadow-sm p-4 p-lg-5 bg-light h-100 w-100">
                <form @submit.prevent="submitOrder">
                  <div class="row g-3">
                    <div :class="cartMode ? 'col-12' : 'col-md-6'">
                      <label class="form-label">Nombre Completo *</label>
                      <input v-model="form.name" type="text" class="form-control" required placeholder="Ej: Juan Pérez" />
                    </div>
                    <div v-if="!cartMode" class="col-md-6">
                      <label class="form-label">Selecciona un Producto *</label>
                      <select v-model="form.productId" class="form-select" required>
                        <option value="">Elige un producto...</option>
                        <option v-for="p in allProducts" :key="p.id" :value="p.id">
                          {{ p.nombre }} - ${{ Number(p.precio).toFixed(2) }} MXN
                        </option>
                      </select>
                    </div>
                    <div v-if="!cartMode" class="col-md-6">
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
import { useCartStore } from '@/stores/cartStore';
import { useSiteContentStore } from '@/stores/siteContentStore';
import { buildWhatsAppChatUrl, normalizeWhatsAppNumber, resolveSiteNameForWhatsApp } from '@/stores/siteContentStore';
import { productImageUrl } from '@/utils/productImageUrl';
import type { Product } from '@/stores/productsStore';
import type { CartLine } from '@/stores/cartStore';

const route = useRoute();
const productsStore = useProductsStore();
const cartStore = useCartStore();

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

const cartMode = computed(() => cartStore.lines.length > 0);

const sideColumnClass = computed(() =>
  cartMode.value || selectedProduct.value ? 'col-lg-8' : 'col-lg-12',
);

type CartRowResolved = {
  key: string;
  line: CartLine;
  product: Product | null;
  maxQty: number;
};

const cartLinesResolved = computed((): CartRowResolved[] => {
  return cartStore.lines.map((line) => {
    const product = allProducts.value.find((p) => p.id === line.productId) ?? null;
    const maxQty = Math.max(1, product?.stock ?? line.quantity);
    const key = `${line.productId}::${line.talla}`;
    return { key, line, product, maxQty };
  });
});

function onCartQtyChange(row: CartRowResolved, e: Event) {
  const target = e.target as HTMLInputElement | null;
  if (!target) return;
  const n = Number(target.value);
  cartStore.setLineQuantity(row.line.productId, row.line.talla, n, row.maxQty);
}

function removeCartLine(row: CartRowResolved) {
  cartStore.removeLine(row.line.productId, row.line.talla);
}

function clearCart() {
  cartStore.clear();
}

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
  if (cartStore.lines.length > 0) {
    return;
  }
  const id = route.query.producto;
  if (id) {
    const num = Number(id);
    form.value.productId = num ? String(num) : '';
    selectedProduct.value = allProducts.value.find((p) => p.id === num) ?? null;
  }
});

const WHATSAPP_FALLBACK = '529541817823';

function buildOrderWhatsAppBody(siteNameFromMeta: string): string {
  const brand = resolveSiteNameForWhatsApp(siteNameFromMeta);
  const productId = form.value.productId;
  const product = allProducts.value.find((p) => p.id === Number(productId));
  const productInfo = product ? `${product.nombre} ($${Number(product.precio).toFixed(2)} MXN)` : 'Producto personalizado';
  const size = form.value.size?.trim() || '—';
  const address = form.value.address?.trim() || '—';
  const notes = form.value.message?.trim() || '—';
  return [
    `🛍️ *Nuevo pedido — ${brand}*`,
    '',
    `👤 *Nombre:* ${form.value.name.trim()}`,
    `📦 *Producto:* ${productInfo}`,
    `📏 *Talla:* ${size}`,
    `📍 *Dirección:* ${address}`,
    `📝 *Notas:* ${notes}`,
    '',
    '────────────────────',
    `_Enviado desde el formulario de pedidos · ${brand}_`,
  ].join('\n');
}

function buildCartWhatsAppBody(siteNameFromMeta: string): string {
  const brand = resolveSiteNameForWhatsApp(siteNameFromMeta);
  const address = form.value.address?.trim() || '—';
  const notes = form.value.message?.trim() || '—';
  let subtotal = 0;
  const detailLines = cartStore.lines.map((line) => {
    const product = allProducts.value.find((p) => p.id === line.productId);
    const name = product?.nombre ?? `Producto #${line.productId}`;
    const unit = product ? Number(product.precio) : 0;
    subtotal += unit * line.quantity;
    const talla = line.talla ? ` · Talla ${line.talla}` : '';
    return `  • ${name} ×${line.quantity} (${unit > 0 ? `$${unit.toFixed(2)}` : '—'} c/u)${talla}`;
  });
  const subtotalLine = subtotal > 0 ? `\n💰 *Subtotal estimado:* $${subtotal.toFixed(2)} MXN` : '';
  return [
    `🛍️ *Nuevo pedido — ${brand}*`,
    '',
    `👤 *Nombre:* ${form.value.name.trim()}`,
    '📦 *Productos:*',
    ...detailLines,
    subtotalLine,
    '',
    `📍 *Dirección:* ${address}`,
    `📝 *Notas:* ${notes}`,
    '',
    '────────────────────',
    `_Enviado desde el carrito · ${brand}_`,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function submitOrder() {
  const siteContent = useSiteContentStore();
  const content = siteContent.getNestedStructured();
  const raw = content.footer.social.whatsapp;
  const digits = normalizeWhatsAppNumber(raw) || WHATSAPP_FALLBACK;
  const text =
    cartStore.lines.length > 0
      ? buildCartWhatsAppBody(content.meta.site.name)
      : buildOrderWhatsAppBody(content.meta.site.name);
  const url = buildWhatsAppChatUrl(digits, text);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    if (cartStore.lines.length > 0) cartStore.clear();
  }
}
</script>

<style scoped>
.product-preview-image {
  width: 100%;
  max-width: 400px;
  height: 400px;
  object-fit: cover;
}

.cart-thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  flex-shrink: 0;
}

.cart-lines li:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
</style>

