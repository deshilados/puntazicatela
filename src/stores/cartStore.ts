import { defineStore } from 'pinia';

const STORAGE_KEY = 'puntazicatela_cart_v1';

export interface CartLine {
  productId: number;
  quantity: number;
  /** Talla elegida o cadena vacía si no aplica */
  talla: string;
}

function normalizeTalla(talla: string | undefined): string {
  return (talla ?? '').trim();
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: [] as CartLine[]
  }),
  getters: {
    totalItems: (state) => state.lines.reduce((n, l) => n + l.quantity, 0),
    isEmpty: (state) => state.lines.length === 0
  },
  actions: {
    hydrateFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return;
        this.lines = parsed
          .filter(
            (x): x is CartLine =>
              typeof x === 'object' &&
              x !== null &&
              typeof (x as CartLine).productId === 'number' &&
              typeof (x as CartLine).quantity === 'number' &&
              (x as CartLine).quantity > 0
          )
          .map((l) => ({
            productId: l.productId,
            quantity: Math.floor(l.quantity),
            talla: normalizeTalla(l.talla)
          }));
      } catch {
        this.lines = [];
      }
    },

    _persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines));
      } catch {
        /* ignore */
      }
    },

    /**
     * Añade o suma cantidad respetando stock máximo por línea.
     */
    addLine(productId: number, quantity: number, talla: string | undefined, maxStock: number) {
      const t = normalizeTalla(talla);
      const add = Math.max(1, Math.floor(quantity));
      const cap = Math.max(0, Math.floor(maxStock));
      if (cap <= 0) return;

      const existing = this.lines.find((l) => l.productId === productId && l.talla === t);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + add, cap);
      } else {
        this.lines.push({ productId, quantity: Math.min(add, cap), talla: t });
      }
      this._persist();
    },

    setLineQuantity(productId: number, talla: string | undefined, quantity: number, maxStock: number) {
      const t = normalizeTalla(talla);
      const q = Math.max(0, Math.floor(quantity));
      const cap = Math.max(0, Math.floor(maxStock));
      const idx = this.lines.findIndex((l) => l.productId === productId && l.talla === t);
      if (idx === -1) return;
      if (q <= 0) {
        this.lines.splice(idx, 1);
      } else {
        this.lines[idx].quantity = Math.min(q, cap);
      }
      this._persist();
    },

    removeLine(productId: number, talla: string | undefined) {
      const t = normalizeTalla(talla);
      const idx = this.lines.findIndex((l) => l.productId === productId && l.talla === t);
      if (idx !== -1) {
        this.lines.splice(idx, 1);
        this._persist();
      }
    },

    clear() {
      this.lines = [];
      this._persist();
    }
  }
});
