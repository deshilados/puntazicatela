import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase';

function normalizeImageNameEntry(value: string): string {
  const raw = value.trim();
  if (!raw) return '';

  // Si llega URL completa o ruta, nos quedamos solo con el nombre de archivo.
  const withoutQuery = raw.split('?')[0].split('#')[0];
  const parts = withoutQuery.split('/').filter(Boolean);
  return parts.length ? parts[parts.length - 1].trim() : raw;
}

function normalizeImagenUrlValue(value: string | null | undefined): string {
  const raw = (value ?? '').trim();
  if (!raw) return '';

  // Soporta JSON array y lo normaliza a JSON array de nombres.
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((x) => normalizeImageNameEntry(String(x)))
          .filter(Boolean)
        return normalized.length ? JSON.stringify(normalized) : '';
      }
    } catch {
      // fallback a separadores
    }
  }

  const normalized = raw
    .split(/[,\|;]+/g)
    .map((s) => normalizeImageNameEntry(s))
    .filter(Boolean);

  return normalized.length ? JSON.stringify(normalized) : '';
}

function normalizeTallasValue(value: string | null | undefined): string {
  const raw = (value ?? '').trim();
  if (!raw) return '';

  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const normalized = parsed.map((x) => String(x).trim()).filter(Boolean);
        return normalized.length ? JSON.stringify(normalized) : '';
      }
    } catch {
      // fallback a separadores
    }
  }

  const normalized = raw
    .split(/[,\|;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  return normalized.length ? JSON.stringify(normalized) : '';
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
  stock: number;
  imagen_url: string | null;
  activo: boolean;
  portada: boolean;
  tallas_disponibles: string;
  orden: number | null;
  created_at?: string;
  updated_at?: string;
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    all: [] as Product[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchActive() {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false });
      if (error) {
        this.error = error.message;
        this.items = [];
      } else {
        this.items = (data ?? []) as Product[];
      }
      this.loading = false;
    },
    async fetchPortada() {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('activo', true)
        .eq('portada', true)
        .order('orden', { ascending: false })
        .order('id', { ascending: false });
      if (error) {
        this.error = error.message;
        this.items = [];
      } else {
        this.items = (data ?? []) as Product[];
      }
      this.loading = false;
    },
    async fetchAll() {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('orden', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false });
      if (error) {
        this.error = error.message;
        this.all = [];
      } else {
        this.all = (data ?? []) as Product[];
      }
      this.loading = false;
    },
    async fetchById(id: number) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      return data as Product;
    },
    async search(term: string) {
      if (!term.trim()) return this.fetchActive();
      this.loading = true;
      this.error = null;
      const t = '%' + term.trim() + '%';
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('activo', true)
        .or(`nombre.ilike.${t},descripcion.ilike.${t}`)
        .order('orden', { ascending: false })
        .order('id', { ascending: false });
      if (error) {
        this.error = error.message;
        this.items = [];
      } else {
        this.items = (data ?? []) as Product[];
      }
      this.loading = false;
    },
    async getCategories() {
      const { data } = await supabase
        .from('products')
        .select('categoria')
        .eq('activo', true);
      const set = new Set<string>();
      (data ?? []).forEach((r: { categoria: string }) => {
        if (r.categoria) set.add(r.categoria);
      });
      return Array.from(set).sort();
    },
    async getCategoriesAll() {
      const { data } = await supabase.from('products').select('categoria');
      const set = new Set<string>();
      (data ?? []).forEach((r: { categoria: string }) => {
        if (r.categoria) set.add(r.categoria);
      });
      return Array.from(set).sort();
    },
    groupByCategory(products: Product[]): Record<string, Product[]> {
      const g: Record<string, Product[]> = {};
      products.forEach((p) => {
        if (!p.categoria) return;
        if (!g[p.categoria]) g[p.categoria] = [];
        g[p.categoria].push(p);
      });
      return g;
    },
    async create(payload: Partial<Product>) {
      const { data, error } = await supabase
        .from('products')
        .insert({
          nombre: payload.nombre,
          descripcion: payload.descripcion ?? '',
          categoria: payload.categoria,
          precio: payload.precio,
          stock: payload.stock ?? 0,
          imagen_url: normalizeImagenUrlValue(payload.imagen_url),
          activo: payload.activo ?? true,
          portada: payload.portada ?? false,
          tallas_disponibles: normalizeTallasValue(payload.tallas_disponibles)
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      const id = data?.id;
      if (id) await supabase.from('products').update({ orden: id }).eq('id', id);
      return id;
    },
    async update(id: number, payload: Partial<Product>) {
      const { error } = await supabase
        .from('products')
        .update({
          nombre: payload.nombre,
          descripcion: payload.descripcion ?? '',
          categoria: payload.categoria,
          precio: payload.precio,
          stock: payload.stock ?? 0,
          imagen_url: normalizeImagenUrlValue(payload.imagen_url),
          activo: payload.activo ?? true,
          portada: payload.portada ?? false,
          tallas_disponibles: normalizeTallasValue(payload.tallas_disponibles)
        })
        .eq('id', id);
      if (error) throw new Error(error.message);
    },
    async deletePermanent(id: number) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    async subirOrden(id: number) {
      const { data: rows } = await supabase
        .from('products')
        .select('id, orden')
        .order('orden', { ascending: false })
        .order('id', { ascending: false });
      const list = (rows ?? []) as { id: number; orden: number | null }[];
      const idx = list.findIndex((r) => r.id === id);
      if (idx <= 0) return false;
      const prev = list[idx - 1];
      const curr = list[idx];
      const ordenCurr = curr.orden ?? curr.id;
      const ordenPrev = prev.orden ?? prev.id;
      await supabase.from('products').update({ orden: ordenPrev }).eq('id', id);
      await supabase.from('products').update({ orden: ordenCurr }).eq('id', prev.id);
      return true;
    },
    async bajarOrden(id: number) {
      const { data: rows } = await supabase
        .from('products')
        .select('id, orden')
        .order('orden', { ascending: false })
        .order('id', { ascending: false });
      const list = (rows ?? []) as { id: number; orden: number | null }[];
      const idx = list.findIndex((r) => r.id === id);
      if (idx < 0 || idx >= list.length - 1) return false;
      const next = list[idx + 1];
      const curr = list[idx];
      const ordenCurr = curr.orden ?? curr.id;
      const ordenNext = next.orden ?? next.id;
      await supabase.from('products').update({ orden: ordenNext }).eq('id', id);
      await supabase.from('products').update({ orden: ordenCurr }).eq('id', next.id);
      return true;
    }
  }
});
