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
  return prefix + 'images/' + url.replace(/^\//, '');
}
