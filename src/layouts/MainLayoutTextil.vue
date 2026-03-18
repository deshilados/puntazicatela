<template>
  <div class="main-layout-textil">
    <nav class="navbar navbar-expand-lg fixed-top bg-light border-bottom py-3">
      <div class="container">
        <router-link class="navbar-brand fs-4 fw-semibold text-dark d-flex align-items-center gap-2" to="/">
          <img
            v-if="content.navbar.logo"
            :src="imageBase + content.navbar.logo"
            alt=""
            height="40"
            class="d-inline-block align-middle"
          />
          <img v-else :src="imageBase + (content.meta.site.icon || 'icon.png')" alt="" width="32" height="32" />
          {{ content.navbar.brand || 'OAXACA TEXTILES' }}
        </router-link>
        <button class="navbar-toggler border-2 px-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li v-if="adminAuth.isAdmin" class="nav-item">
              <router-link class="nav-link text-dark small" to="/admin"><i class="bi bi-gear me-1"></i>Admin</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark small" to="/#inicio">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark small" to="/#coleccion">Colección</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark small" to="/#nosotros">Nosotros</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark small" to="/#contacto">Contacto</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-dark small" to="/ordenar">Ordenar</router-link>
            </li>
          </ul>
          <form class="d-flex me-3 mb-2 mb-lg-0" @submit.prevent="onSearch">
            <input
              v-model="searchQuery"
              class="form-control form-control-sm"
              type="search"
              placeholder="Buscar..."
              style="min-width: 150px"
            />
            <router-link :to="searchTo" class="btn btn-outline-success btn-sm ms-1">
              <i class="bi bi-search"></i>
            </router-link>
          </form>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer id="contacto" class="bg-dark text-white pt-5 pb-2">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4">
            <p class="h4 fw-semibold mb-3">{{ content.footer.brand || 'OAXACA TEXTILES' }}</p>
            <p class="small text-white-50">{{ content.footer.description }}</p>
            <div v-if="hasSocial" class="mt-3">
              <a v-if="content.footer.social.facebook" :href="content.footer.social.facebook" class="btn btn-link text-white-50 me-2" target="_blank" rel="noopener"><i class="bi bi-facebook"></i></a>
              <a v-if="content.footer.social.instagram" :href="content.footer.social.instagram" class="btn btn-link text-white-50 me-2" target="_blank" rel="noopener"><i class="bi bi-instagram"></i></a>
              <a v-if="content.footer.social.whatsapp" :href="content.footer.social.whatsapp" class="btn btn-link text-white-50 me-2" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
          <div class="col-lg-2 col-md-4">
            <h5 class="h6 fw-semibold mb-4">Navegación</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><router-link to="/#inicio" class="text-decoration-none small text-white-50">Inicio</router-link></li>
              <li class="mb-2"><router-link to="/#coleccion" class="text-decoration-none small text-white-50">Colección</router-link></li>
              <li class="mb-2"><router-link to="/#nosotros" class="text-decoration-none small text-white-50">Nosotros</router-link></li>
              <li class="mb-2"><router-link to="/ordenar" class="text-decoration-none small text-white-50">Ordenar</router-link></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-4">
            <h5 class="h6 fw-semibold mb-4">{{ content.footer.contact.title || 'Contacto' }}</h5>
            <ul class="list-unstyled">
              <li v-if="content.footer.contact.address.street" class="mb-2 small text-white-50"><i class="bi bi-geo-alt me-2"></i>{{ content.footer.contact.address.street }}</li>
              <li v-if="content.footer.contact.address.city" class="mb-2 small text-white-50">{{ content.footer.contact.address.city }}</li>
              <li v-if="content.footer.contact.phone" class="mb-2 small text-white-50"><i class="bi bi-telephone me-2"></i>{{ content.footer.contact.phone }}</li>
              <li v-if="content.footer.contact.email" class="mb-2 small text-white-50"><i class="bi bi-envelope me-2"></i>{{ content.footer.contact.email }}</li>
            </ul>
          </div>
          <div v-if="hasSchedule" class="col-lg-3 col-md-4">
            <h5 class="h6 fw-semibold mb-4">{{ content.footer.schedule.title || 'Horario' }}</h5>
            <ul class="list-unstyled">
              <li class="mb-2 small text-white-50">{{ content.footer.schedule.weekdays.days }}</li>
              <li class="mb-2 small text-white-50">{{ content.footer.schedule.weekdays.hours }}</li>
              <li v-if="content.footer.schedule.extra.days" class="mb-2 small text-white-50">{{ content.footer.schedule.extra.days }}</li>
              <li v-if="content.footer.schedule.extra.hours" class="mb-2 small text-white-50">{{ content.footer.schedule.extra.hours }}</li>
            </ul>
          </div>
        </div>
        <div class="border-top border-white border-opacity-10 pt-4 mt-5 text-center">
          <p class="mb-0 small text-white-50">&copy; {{ new Date().getFullYear() }} {{ content.footer.copyright.text || 'Oaxaca Textiles.' }}</p>
          <p class="mt-1 small text-white-50">{{ content.footer.copyright.made_with }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSiteContentStore } from '@/stores/siteContentStore';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

const router = useRouter();
const siteContent = useSiteContentStore();
const adminAuth = useAdminAuthStore();

const searchQuery = ref('');

const imageBase = computed(() => {
  const base = import.meta.env.BASE_URL || '';
  return base.endsWith('/') ? base + 'images/' : base + '/images/';
});

const content = computed(() => siteContent.getNestedStructured());

const hasSocial = computed(() => {
  const s = content.value.footer.social;
  return !!(s.facebook || s.instagram || s.whatsapp);
});

const hasSchedule = computed(() => {
  const sch = content.value.footer.schedule;
  return !!(sch.weekdays.days || sch.weekdays.hours || sch.extra.days || sch.extra.hours);
});

const searchTo = computed(() => (searchQuery.value.trim() ? `/categorias?q=${encodeURIComponent(searchQuery.value.trim())}` : '/categorias'));

function onSearch() {
  if (searchQuery.value.trim()) router.push(searchTo.value);
}

onMounted(() => {
  adminAuth.initFromStorage();
  if (Object.keys(siteContent.items).length === 0) siteContent.fetchAll();
});
</script>

<style scoped>
.main-content {
  padding-top: 80px;
  min-height: 60vh;
}
</style>
