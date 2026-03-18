<template>
  <div class="admin-layout bg-light min-vh-100">
    <nav v-if="adminAuth.isAdmin" class="navbar navbar-expand-lg navbar-light bg-light border-bottom shadow-sm fixed-top py-3">
      <div class="container">
        <router-link to="/admin" class="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span>{{ siteName }} Admin</span>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/"><i class="bi bi-house-door me-1"></i>Página principal</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin"><i class="bi bi-box-seam me-1"></i>Productos</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/crear"><i class="bi bi-plus-lg me-1"></i>Nuevo producto</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/contenido"><i class="bi bi-pencil-square me-1"></i>Contenido del sitio</router-link>
            </li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            <span class="text-dark small">{{ adminAuth.user?.nombre }}</span>
            <button type="button" class="btn btn-dark btn-sm" @click="logout"><i class="bi bi-box-arrow-right me-1"></i>Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>
    <main class="container" :style="{ paddingTop: adminAuth.isAdmin ? '100px' : '0' }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useSiteContentStore } from '@/stores/siteContentStore';

const router = useRouter();
const adminAuth = useAdminAuthStore();
const siteContent = useSiteContentStore();

const siteName = computed(() => siteContent.get('meta_site_name', 'TextilPXM'));

function logout() {
  adminAuth.logout();
  router.push('/admin');
}

onMounted(() => {
  adminAuth.initFromStorage();
  if (Object.keys(siteContent.items).length === 0) siteContent.fetchAll();
});
</script>
