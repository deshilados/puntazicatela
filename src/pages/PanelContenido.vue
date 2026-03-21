<template>
  <Navbar />
  <div class="container pt-5 pb-4 panel-contenido-wrap">
    <div class="card border-0 shadow-sm mb-4">
      <PanelContenidoHeader />

      <div class="card-body p-4">
        <form @submit.prevent="submit">
          <PanelContenidoTabs v-model="tab" />

          <PanelContenidoEncabezadoFields :visible="tab === 'encabezado'" />
          <PanelContenidoPortadaFields :visible="tab === 'portada'" />
          <PanelContenidoNosotrosFields :visible="tab === 'nosotros'" />
          <PanelContenidoPieFields :visible="tab === 'footer'" />
          <PanelContenidoMetaFields :visible="tab === 'meta'" />

          <PanelContenidoFormActions />
        </form>
      </div>
    </div>
  </div>
  <ContactoFooter />
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import PanelContenidoHeader from '@/components/PanelContenido/PanelContenidoHeader.vue';
import PanelContenidoTabs from '@/components/PanelContenido/PanelContenidoTabs.vue';
import PanelContenidoEncabezadoFields from '@/components/PanelContenido/PanelContenidoEncabezadoFields.vue';
import PanelContenidoPortadaFields from '@/components/PanelContenido/PanelContenidoPortadaFields.vue';
import PanelContenidoNosotrosFields from '@/components/PanelContenido/PanelContenidoNosotrosFields.vue';
import PanelContenidoPieFields from '@/components/PanelContenido/PanelContenidoPieFields.vue';
import PanelContenidoMetaFields from '@/components/PanelContenido/PanelContenidoMetaFields.vue';
import PanelContenidoFormActions from '@/components/PanelContenido/PanelContenidoFormActions.vue';
import { PANEL_CONTENIDO_FORM_KEY } from '@/components/PanelContenido/injectionKeys';
import { normalizeWhatsAppNumber, useSiteContentStore } from '@/stores/siteContentStore';
import Swal from 'sweetalert2';

const siteContent = useSiteContentStore();
const tab = ref<'meta' | 'encabezado' | 'portada' | 'nosotros' | 'footer'>('encabezado');

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
  footer_copyright_made_with: '' });

provide(PANEL_CONTENIDO_FORM_KEY, form);

onMounted(async () => {
  await siteContent.fetchAll();
  Object.keys(form).forEach((key) => {
    form[key] = siteContent.get(key);
  });
  if (form.footer_social_whatsapp) {
    form.footer_social_whatsapp = normalizeWhatsAppNumber(form.footer_social_whatsapp);
  }
});

async function submit() {
  Swal.fire({
    title: 'Guardando contenido...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  if (form.footer_social_whatsapp) {
    form.footer_social_whatsapp = normalizeWhatsAppNumber(form.footer_social_whatsapp);
  }
  try {
    await siteContent.setBulk({ ...form });
    Swal.close();
    await Swal.fire({
      icon: 'success',
      title: 'Listo',
      text: 'Contenido guardado correctamente.',
      timer: 1400,
      showConfirmButton: false,
    });
  } catch (e) {
    Swal.close();
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: (e as Error).message || 'No se pudo guardar el contenido.',
    });
  }
}
</script>

<style scoped>
.panel-contenido-wrap {
  max-width: 1040px;
}
</style>
