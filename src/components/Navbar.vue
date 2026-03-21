<template>
  <nav class="navbar navbar-expand-lg bg-white shadow-sm fixed-top" aria-label="Navegación principal">
    <div class="container align-items-center">
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2" @click="closeMenu">
        <img v-if="content.navbar.logo" :src="imageBase + content.navbar.logo" :alt="brandText" width="36"
          height="36" />
        <img v-else :src="imageBase + (content.meta.site.icon || 'icon.png')" :alt="brandText" width="36" height="36" />
        <span class="fw-bold">{{ brandText }}</span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <button class="nav-link" type="button" @click="handleNavClick('inicio')">
              Inicio
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" type="button" @click="handleNavClick('coleccion')">
              Colección
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" type="button" @click="handleNavClick('nosotros')">
              Nosotros
            </button>
          </li>
          <!-- <li class="nav-item">
            <button class="nav-link" type="button" @click="handleNavClick('contacto')">
              Contacto
            </button>
          </li> -->
          <li class="nav-item">
            <router-link to="/categorias" class="nav-link">
              Categorías
            </router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/ordenar" :class="{ active: isOrdenarActive }"
              :aria-current="isOrdenarActive ? 'page' : undefined" @click="closeMenu">
              Ordenar
            </router-link>
          </li>

          <li v-if="adminAuth.isAdmin" class="nav-item dropdown">
            <button class="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Administración
            </button>

            <ul class="dropdown-menu">
              <li>
                <router-link class="dropdown-item" to="/panel" :class="{ active: isProductosActive }"
                  :aria-current="isProductosActive ? 'page' : undefined" @click="closeMenu">
                  Productos
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/panel/contenido" :class="{ active: isContenidoActive }"
                  :aria-current="isContenidoActive ? 'page' : undefined" @click="closeMenu">
                  Contenido del sitio
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <button type="button" class="dropdown-item" @click="logout">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </li>

          <li v-else-if="canShowLogin" class="nav-item">
            <router-link class="nav-link text-nowrap" to="/panel/login"
              :class="{ active: route.path === '/panel/login' }"
              :aria-current="route.path === '/panel/login' ? 'page' : undefined" @click="closeMenu">
              Iniciar sesión
            </router-link>
          </li>
        </ul>

        <form class="d-flex w-100 w-lg-auto min-w-0 navbar-search-form" role="search" @submit.prevent="onSearch">
          <input v-model="searchQuery" class="form-control me-2 flex-grow-1 min-w-0 navbar-search-input" type="search"
            placeholder="Buscar" aria-label="Buscar productos" />
          <button class="btn btn-outline-primary flex-shrink-0" type="submit" aria-label="Buscar">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useSiteContentStore } from '@/stores/siteContentStore';

const router = useRouter();
const route = useRoute();
const adminAuth = useAdminAuthStore();
const siteContent = useSiteContentStore();

// El admin puede existir por sesión en sessionStorage, así que lo inicializamos pronto.
adminAuth.initFromStorage();

if (Object.keys(siteContent.items).length === 0) {
  // Cargar contenido para brand/logo.
  void siteContent.fetchAll();
}

const searchQuery = ref('');

const content = computed(() => siteContent.getNestedStructured());
const brandText = computed(() => content.value.navbar.brand || 'DESHILADOS PXM');

const imageBase = computed(() => {
  const base = import.meta.env.BASE_URL || '';
  return base.endsWith('/') ? base + 'images/' : base + '/images/';
});

const isOrdenarActive = computed(() => route.path === '/ordenar');
const isProductosActive = computed(() => (
  adminAuth.isAdmin &&
  (route.path === '/panel' || route.path.startsWith('/panel/crear') || route.path.startsWith('/panel/editar'))
));
const isContenidoActive = computed(() => adminAuth.isAdmin && route.path.startsWith('/panel/contenido'));
// Mostramos "Iniciar sesión" en `/panel/login`, pero ocultamos el link en el resto de panel.
const isPanelArea = computed(() => route.path.startsWith('/panel') && route.path !== '/panel/login');
const canShowLogin = computed(() => !adminAuth.isAdmin && !isPanelArea.value);

const searchTo = computed(() => (
  searchQuery.value.trim()
    ? `/categorias?q=${encodeURIComponent(searchQuery.value.trim())}`
    : '/categorias'
));

function onSearch() {
  router.push(searchTo.value);
  closeMenu();
}

function logout() {
  adminAuth.logout();
  router.push('/');
  closeMenu();
}

const NAVBAR_COLLAPSE_ID = 'navbarSupportedContent';
let collapseInstance: any = null;

function closeMenu() {
  if (collapseInstance?.hide) {
    collapseInstance.hide();
    return;
  }

  // Fallback si Bootstrap JS no está disponible.
  const el = document.getElementById(NAVBAR_COLLAPSE_ID);
  el?.classList.remove('show');
}

let onKeyDown: ((e: KeyboardEvent) => void) | null = null;

onMounted(() => {
  const el = document.getElementById(NAVBAR_COLLAPSE_ID);
  const bs = (window as any).bootstrap;
  if (el && bs?.Collapse) {
    // Bootstrap 5
    collapseInstance = bs.Collapse.getOrCreateInstance
      ? bs.Collapse.getOrCreateInstance(el)
      : new bs.Collapse(el, { toggle: false });
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMenu();
  };
  window.addEventListener('keydown', onKeyDown);
});

onBeforeUnmount(() => {
  if (onKeyDown) window.removeEventListener('keydown', onKeyDown);
});

watch(
  () => route.fullPath,
  () => closeMenu(),
);

const NAVBAR_OFFSET = 120;

function scrollToSection(id: string, retries = 5) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
    return;
  }
  if (retries <= 0) return;
  setTimeout(() => scrollToSection(id, retries - 1), 100);
}

async function handleNavClick(id: string) {
  closeMenu();

  // Si la sección existe en el DOM actual, solo hacemos scroll (sin navegar).
  if (document.getElementById(id)) {
    scrollToSection(id);
    return;
  }

  // Si no existe (por ejemplo, estás en /categorias), navega a Home y luego haz scroll.
  if (route.path !== '/') {
    await router.push('/');
    await nextTick();
  }

  setTimeout(() => scrollToSection(id, 10), 50);
}
</script>

<style scoped>
/* Look blanco + texto azul marino sutil (Bootstrap nativo). */
.navbar {
  background: #ffffff !important;
  color: #0b2d4d;
  z-index: 1030;
}

.navbar .navbar-brand {
  color: #0b2d4d !important;
}

.navbar .navbar-brand span {
  white-space: nowrap;
  line-height: 1.2;
  font-size: 1rem;
}

.navbar .nav-link,
.navbar .dropdown-item {
  color: #0b2d4d !important;
}

.navbar .nav-link {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding-top: 0;
  padding-bottom: 0;
}

.navbar .navbar-nav .nav-item {
  display: flex;
  align-items: center;
}

.navbar .nav-link:hover,
.navbar .dropdown-item:hover {
  background: rgba(11, 45, 77, 0.08);
}

.navbar .nav-link.active,
.navbar .dropdown-item.active {
  background: rgba(11, 45, 77, 0.1);
  font-weight: 600;
}

.navbar .dropdown-menu {
  background: #ffffff;
  border: 1px solid rgba(11, 45, 77, 0.14);
}

/* min-width del buscador solo en desktop — en móvil 360px rompía el ancho (flex + min-width) */
.navbar .form-control.me-2 {
  height: 44px;
  font-size: 1rem;
  padding-top: 0.55rem;
  padding-bottom: 0.55rem;
}

.navbar .navbar-toggler {
  border-color: rgba(11, 45, 77, 0.18);
}

.navbar .navbar-toggler:focus-visible {
  outline: 2px solid rgba(33, 110, 255, 0.35);
  outline-offset: 2px;
}

.navbar .navbar-brand img {
  object-fit: contain;
}

@media (max-width: 991.98px) {
  .navbar .navbar-collapse {
    max-width: 100%;
    overflow-x: hidden;
  }

  .navbar .form-control.me-2 {
    min-width: 0;
  }

  /* Dropdown Administración: opciones debajo del botón, no al lado (evita flex en .nav-item) */
  .navbar .navbar-nav .nav-item.dropdown {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .navbar .navbar-nav .nav-item.dropdown .dropdown-toggle {
    width: 100%;
    justify-content: space-between;
    text-align: left;
  }

  .navbar .navbar-nav .nav-item.dropdown .dropdown-menu {
    position: static !important;
    transform: none !important;
    inset: auto !important;
    margin: 0.25rem 0 0 !important;
    width: 100%;
    float: none;
  }
}

/* Alineación vertical consistente del brand y los items */
.navbar .navbar-brand {
  display: flex;
  align-items: center;
  height: 56px;
  /* consistente con el padding vertical del navbar */
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1;
}

.navbar .navbar-brand span {
  display: inline-flex;
  align-items: center;
  line-height: 1.2;
}

.navbar .nav-link {
  line-height: 44px;
}

/* Desktop: buscador compacto (antes w-100 + flex-grow ocupaba ~1/3 y apretaba “Iniciar sesión”) */
@media (min-width: 992px) {
  .navbar .navbar-search-form {
    width: auto !important;
    max-width: min(300px, 28vw);
    flex: 0 0 auto;
    margin-left: 0.75rem;
  }

  .navbar .navbar-search-input.form-control.me-2 {
    min-width: 0;
    flex: 1 1 auto;
  }
}
</style>