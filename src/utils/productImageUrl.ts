/**
 * URL para imagen de producto.
 * Si imagen_url es ruta local (ej. productos/1.jpg) se resuelve con baseUrl.
 * Si es URL externa (http...) se devuelve tal cual.
 */
const PLACEHOLDER = '/images/productos/placeholder.svg';

export function productImageUrl(
  imagenUrl: string | null | undefined,
  baseUrl: string = '',
  defaultUrl: string = PLACEHOLDER
): string {
  const url = (imagenUrl ?? '').trim();
  if (!url) return defaultUrl || PLACEHOLDER;
  if (/^https?:\/\//i.test(url)) return url;
  const base = (baseUrl || import.meta.env.BASE_URL || '').replace(/\/$/, '');
  const prefix = base ? base + '/' : '';
  let clean = url.replace(/^\//, '');

  // Normalizar entradas legacy:
  // - images/1.jpg -> 1.jpg
  // - images/productos/1.jpg -> productos/1.jpg
  if (clean.startsWith('images/')) {
    clean = clean.slice('images/'.length);
  }

  // Convención del proyecto: si solo hay nombre, usar carpeta productos.
  if (!clean.includes('/')) {
    return prefix + 'images/productos/' + clean;
  }

  // Si ya viene con "productos/", respetarlo.
  if (clean.startsWith('productos/')) {
    return prefix + 'images/' + clean;
  }

  // Cualquier otra subruta relativa bajo images/.
  return prefix + 'images/' + clean;
}
