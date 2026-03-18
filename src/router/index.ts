import { createRouter, createWebHashHistory } from 'vue-router';
import MainLayoutTextil from '@/layouts/MainLayoutTextil.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

import HomeTextil from '@/pages/textil/HomeTextil.vue';
import Categorias from '@/pages/textil/Categorias.vue';
import ProductoShow from '@/pages/textil/ProductoShow.vue';
import Ordenar from '@/pages/textil/Ordenar.vue';
import LoginTextil from '@/pages/textil/LoginTextil.vue';
import RegisterTextil from '@/pages/textil/RegisterTextil.vue';
import About from '@/pages/textil/About.vue';
import Contact from '@/pages/textil/Contact.vue';

import AdminLogin from '@/pages/admin/AdminLogin.vue';
import AdminProducts from '@/pages/admin/AdminProducts.vue';
import AdminProductForm from '@/pages/admin/AdminProductForm.vue';
import AdminContenido from '@/pages/admin/AdminContenido.vue';

import { useAdminAuthStore } from '@/stores/adminAuthStore';

const routes = [
  {
    path: '/',
    component: MainLayoutTextil,
    children: [
      { path: '', name: 'Home', component: HomeTextil },
      { path: 'categorias', name: 'Categorias', component: Categorias },
      { path: 'producto/:id', name: 'ProductoShow', component: ProductoShow },
      { path: 'ordenar', name: 'Ordenar', component: Ordenar },
      { path: 'login', name: 'Login', component: LoginTextil },
      { path: 'register', name: 'Register', component: RegisterTextil },
      { path: 'about', name: 'About', component: About },
      { path: 'contact', name: 'Contact', component: Contact }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: (_to, _from, next) => {
      const adminAuth = useAdminAuthStore();
      adminAuth.initFromStorage();
      next();
    },
    children: [
      { path: '', name: 'Admin', component: AdminProducts, meta: { admin: true } },
      { path: 'login', name: 'AdminLogin', component: AdminLogin },
      { path: 'crear', name: 'AdminCrear', component: AdminProductForm, meta: { admin: true } },
      { path: 'editar/:id', name: 'AdminEditar', component: AdminProductForm, meta: { admin: true } },
      { path: 'contenido', name: 'AdminContenido', component: AdminContenido, meta: { admin: true } }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  if (to.meta.admin) {
    const adminAuth = useAdminAuthStore();
    adminAuth.initFromStorage();
    if (!adminAuth.isAdmin) {
      next({ path: '/admin/login' });
      return;
    }
  }
  next();
});

export default router;
