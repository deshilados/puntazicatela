<template>
  <Navbar />
  <div class="card shadow-sm mb-4">
    <div class="card-header bg-dark text-white">
      <h1 class="h5 mb-0">Textos y datos del sitio</h1>
    </div>
    <div class="card-body p-4">
      <div v-if="flash" class="alert alert-success">{{ flash }}</div>
      <form @submit.prevent="submit">
        <ul class="nav nav-tabs mb-3" role="tablist">
          <li class="nav-item">
            <button type="button" class="nav-link" :class="{ active: tab === 'meta' }" @click="tab = 'meta'">Meta / SEO</button>
          </li>
          <li class="nav-item">
            <button type="button" class="nav-link" :class="{ active: tab === 'encabezado' }" @click="tab = 'encabezado'">Encabezado y home</button>
          </li>
          <li class="nav-item">
            <button type="button" class="nav-link" :class="{ active: tab === 'nosotros' }" @click="tab = 'nosotros'">Nosotros</button>
          </li>
          <li class="nav-item">
            <button type="button" class="nav-link" :class="{ active: tab === 'footer' }" @click="tab = 'footer'">Pie de página</button>
          </li>
        </ul>

        <div v-show="tab === 'meta'" class="tab-pane">
          <div class="mb-3">
            <label class="form-label">Nombre del sitio</label>
            <input v-model="form.meta_site_name" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Ruta del icono (ej: site/icon.png)</label>
            <input v-model="form.meta_site_icon" type="text" class="form-control" placeholder="site/icon.png" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción (SEO)</label>
            <textarea v-model="form.meta_site_description" class="form-control" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Ubicación</label>
            <input v-model="form.meta_site_location" type="text" class="form-control" />
          </div>
        </div>

        <div v-show="tab === 'encabezado'" class="tab-pane">
          <div class="mb-3">
            <label class="form-label">Marca (navbar)</label>
            <input v-model="form.navbar_brand" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Ruta logo navbar (ej: site/logo-navbar.png)</label>
            <input v-model="form.navbar_logo" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Ruta banner hero (ej: site/banner.jpg)</label>
            <input v-model="form.home_hero_image" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Lugar hero</label>
            <input v-model="form.home_hero_location" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Título hero</label>
            <input v-model="form.home_hero_title" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción hero</label>
            <textarea v-model="form.home_hero_description" class="form-control" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Título sección colección</label>
            <input v-model="form.home_collection_title" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción colección</label>
            <textarea v-model="form.home_collection_description" class="form-control" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Mensaje cuando no hay productos</label>
            <input v-model="form.home_collection_no_products" type="text" class="form-control" />
          </div>
        </div>

        <div v-show="tab === 'nosotros'" class="tab-pane">
          <div class="mb-3">
            <label class="form-label">Ruta imagen nosotros (ej: site/about.jpg)</label>
            <input v-model="form.home_about_image" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Badge (ej: Nuestra Historia)</label>
            <input v-model="form.home_about_badge" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Título nosotros</label>
            <input v-model="form.home_about_title" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción 1</label>
            <textarea v-model="form.home_about_description1" class="form-control" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción 2</label>
            <textarea v-model="form.home_about_description2" class="form-control" rows="2"></textarea>
          </div>
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Stat 1 valor (ej: 15+)</label>
              <input v-model="form.home_about_stats_years_value" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stat 1 etiqueta</label>
              <input v-model="form.home_about_stats_years_label" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stat 2 valor</label>
              <input v-model="form.home_about_stats_countrys_value" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stat 2 etiqueta</label>
              <input v-model="form.home_about_stats_countrys_label" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stat 3 valor</label>
              <input v-model="form.home_about_stats_products_value" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Stat 3 etiqueta</label>
              <input v-model="form.home_about_stats_products_label" type="text" class="form-control" />
            </div>
          </div>
        </div>

        <div v-show="tab === 'footer'" class="tab-pane">
          <div class="mb-3">
            <label class="form-label">Marca footer</label>
            <input v-model="form.footer_brand" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción footer</label>
            <textarea v-model="form.footer_description" class="form-control" rows="2"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Título contacto</label>
            <input v-model="form.footer_contact_title" type="text" class="form-control" />
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Dirección</label>
              <input v-model="form.footer_contact_street" type="text" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Ciudad</label>
              <input v-model="form.footer_contact_city" type="text" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Teléfono</label>
              <input v-model="form.footer_contact_phone" type="text" class="form-control" />
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.footer_contact_email" type="email" class="form-control" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Título horario</label>
              <input v-model="form.footer_schedule_title" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Días</label>
              <input v-model="form.footer_schedule_days" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Horas</label>
              <input v-model="form.footer_schedule_hours" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Días 2</label>
              <input v-model="form.footer_schedule_days_2" type="text" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Horas 2</label>
              <input v-model="form.footer_schedule_hours_2" type="text" class="form-control" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Facebook URL</label>
              <input v-model="form.footer_social_facebook" type="url" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Instagram URL</label>
              <input v-model="form.footer_social_instagram" type="url" class="form-control" />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">WhatsApp (número o URL wa.me/...)</label>
              <input v-model="form.footer_social_whatsapp" type="text" class="form-control" placeholder="529541817823 o https://wa.me/..." />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Copyright texto</label>
            <input v-model="form.footer_copyright_text" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Hecho con / mensaje final</label>
            <input v-model="form.footer_copyright_made_with" type="text" class="form-control" />
          </div>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button type="submit" class="btn btn-success">Guardar cambios</button>
          <router-link to="/panel" class="btn btn-outline-secondary">Volver a productos</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import { useSiteContentStore } from '@/stores/siteContentStore';
import { numberToWhatsAppUrl } from '@/stores/siteContentStore';

const siteContent = useSiteContentStore();
const tab = ref<'meta' | 'encabezado' | 'nosotros' | 'footer'>('meta');
const flash = ref('');

const form = reactive<Record<string, string>>({
  meta_site_name: '',
  meta_site_icon: '',
  meta_site_description: '',
  meta_site_location: '',
  navbar_brand: '',
  navbar_logo: '',
  home_hero_image: '',
  home_hero_location: '',
  home_hero_title: '',
  home_hero_description: '',
  home_collection_title: '',
  home_collection_description: '',
  home_collection_no_products: '',
  home_about_image: '',
  home_about_badge: '',
  home_about_title: '',
  home_about_description1: '',
  home_about_description2: '',
  home_about_stats_years_value: '',
  home_about_stats_years_label: '',
  home_about_stats_countrys_value: '',
  home_about_stats_countrys_label: '',
  home_about_stats_products_value: '',
  home_about_stats_products_label: '',
  footer_brand: '',
  footer_description: '',
  footer_contact_title: '',
  footer_contact_street: '',
  footer_contact_city: '',
  footer_contact_phone: '',
  footer_contact_email: '',
  footer_schedule_title: '',
  footer_schedule_days: '',
  footer_schedule_hours: '',
  footer_schedule_days_2: '',
  footer_schedule_hours_2: '',
  footer_social_facebook: '',
  footer_social_instagram: '',
  footer_social_whatsapp: '',
  footer_copyright_text: '',
  footer_copyright_made_with: ''
});

onMounted(async () => {
  await siteContent.fetchAll();
  Object.keys(form).forEach((key) => {
    form[key] = siteContent.get(key);
  });
  const wa = form.footer_social_whatsapp;
  if (wa && !wa.startsWith('http')) {
    form.footer_social_whatsapp = numberToWhatsAppUrl(wa);
  }
});

async function submit() {
  let wa = form.footer_social_whatsapp;
  if (wa && !wa.startsWith('http')) {
    form.footer_social_whatsapp = numberToWhatsAppUrl(wa);
  }
  await siteContent.setBulk({ ...form });
  flash.value = 'Contenido guardado correctamente';
  setTimeout(() => (flash.value = ''), 3000);
}
</script>

