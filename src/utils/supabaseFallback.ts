/**
 * Datos locales (CSV en supabase/fallback) cuando Supabase no responde.
 * Solo lectura: el panel admin sigue necesitando la BD para escribir.
 */
import productsCsv from '../../supabase/fallback/products_rows.csv?raw';
import siteContentCsv from '../../supabase/fallback/site_content_rows.csv?raw';

export type FallbackProduct = {
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
};

/** Parser CSV en un solo paso (respeta comillas y "" escapadas; no destruye JSON en celdas). */
function parseCsvRows(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = '';
  };
  const pushRow = () => {
    // Ignora filas vacías (p. ej. newline final)
    if (row.length === 1 && row[0] === '' && field === '') {
      row = [];
      return;
    }
    pushField();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      pushField();
      continue;
    }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && next === '\n') i++;
      pushRow();
      continue;
    }
    field += ch;
  }

  if (field.length || row.length) pushRow();
  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((cols) => {
    const record: Record<string, string> = {};
    headers.forEach((h, idx) => {
      record[h] = cols[idx] ?? '';
    });
    return record;
  });
}

function toBool(v: string): boolean {
  return v.trim().toLowerCase() === 'true' || v.trim() === '1';
}

function toNum(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function toNumOrNull(v: string): number | null {
  if (v == null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function sortProducts(list: FallbackProduct[]): FallbackProduct[] {
  return [...list].sort((a, b) => {
    const oa = a.orden ?? a.id;
    const ob = b.orden ?? b.id;
    if (ob !== oa) return ob - oa;
    return b.id - a.id;
  });
}

let productsCache: FallbackProduct[] | null = null;
let siteContentCache: { key: string; value: string | null }[] | null = null;

export function loadFallbackProducts(): FallbackProduct[] {
  if (productsCache) return productsCache;
  productsCache = sortProducts(
    parseCsvRows(productsCsv).map((r) => ({
      id: toNum(r.id),
      nombre: r.nombre ?? '',
      descripcion: r.descripcion?.trim() ? r.descripcion : null,
      categoria: r.categoria ?? '',
      precio: toNum(r.precio),
      stock: toNum(r.stock),
      imagen_url: r.imagen_url?.trim() ? r.imagen_url : null,
      activo: toBool(r.activo),
      portada: toBool(r.portada),
      tallas_disponibles: r.tallas_disponibles ?? '',
      orden: toNumOrNull(r.orden),
      created_at: r.created_at || undefined,
      updated_at: r.updated_at || undefined
    }))
  );
  return productsCache;
}

export function loadFallbackSiteContent(): { key: string; value: string | null }[] {
  if (siteContentCache) return siteContentCache;
  siteContentCache = parseCsvRows(siteContentCsv).map((r) => ({
    key: r.key ?? '',
    value: r.value === '' ? null : (r.value ?? null)
  }));
  return siteContentCache;
}

export function getFallbackActiveProducts(): FallbackProduct[] {
  return loadFallbackProducts().filter((p) => p.activo);
}

export function getFallbackPortadaProducts(): FallbackProduct[] {
  return loadFallbackProducts().filter((p) => p.activo && p.portada);
}

export function getFallbackProductById(id: number): FallbackProduct | null {
  return loadFallbackProducts().find((p) => p.id === id) ?? null;
}

export function searchFallbackProducts(term: string): FallbackProduct[] {
  const q = term.trim().toLowerCase();
  if (!q) return getFallbackActiveProducts();
  return getFallbackActiveProducts().filter((p) => {
    const nombre = (p.nombre ?? '').toLowerCase();
    const desc = (p.descripcion ?? '').toLowerCase();
    return nombre.includes(q) || desc.includes(q);
  });
}

export function getFallbackCategories(activeOnly: boolean): string[] {
  const list = activeOnly ? getFallbackActiveProducts() : loadFallbackProducts();
  const set = new Set<string>();
  list.forEach((p) => {
    if (p.categoria) set.add(p.categoria);
  });
  return Array.from(set).sort();
}

export const FALLBACK_NOTICE = 'Usando datos locales (sin conexión a la base de datos)';
