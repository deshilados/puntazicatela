import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Categorias from '@/pages/Categorias.vue';
import ProductoShow from '@/pages/ProductoShow.vue';
import Ordenar from '@/pages/Ordenar.vue';
import Login from '@/pages/Login.vue';
import Register from '@/pages/Register.vue';
import About from '@/pages/About.vue';
import Contact from '@/pages/Contact.vue';

import PanelLogin from '@/pages/PanelLogin.vue';
import PanelProducts from '@/pages/PanelProducts.vue';
import PanelProductForm from '@/pages/PanelProductForm.vue';
import PanelContenido from '@/pages/PanelContenido.vue';

import { useAdminAuthStore } from '@/stores/adminAuthStore';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/categorias', name: 'Categorias', component: Categorias },
  { path: '/producto/:id', name: 'ProductoShow', component: ProductoShow },
  { path: '/ordenar', name: 'Ordenar', component: Ordenar },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },

  { path: '/panel', name: 'Panel', component: PanelProducts, meta: { requiresPanelAdmin: true } },
  { path: '/panel/login', name: 'PanelLogin', component: PanelLogin },
  { path: '/panel/crear', name: 'PanelCrear', component: PanelProductForm, meta: { requiresPanelAdmin: true } },
  { path: '/panel/editar/:id', name: 'PanelEditar', component: PanelProductForm, meta: { requiresPanelAdmin: true } },
  { path: '/panel/contenido', name: 'PanelContenido', component: PanelContenido, meta: { requiresPanelAdmin: true } }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    // Siempre volver al inicio al cambiar de ruta para que no “quede” scroll
    // del componente anterior.
    if (savedPosition) return savedPosition;
    return { top: 0 };
  }
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresPanelAdmin) {
    const adminAuth = useAdminAuthStore();
    adminAuth.initFromStorage();
    if (!adminAuth.isAdmin) {
      next({ path: '/panel/login' });
      return;
    }
  }
  next();
});

export default router;
