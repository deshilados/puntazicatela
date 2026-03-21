import type { InjectionKey } from 'vue';

/** Formulario reactivo de contenido del sitio (mismas claves que `site_content`). */
export const PANEL_CONTENIDO_FORM_KEY: InjectionKey<Record<string, string>> = Symbol('panelContenidoForm');
