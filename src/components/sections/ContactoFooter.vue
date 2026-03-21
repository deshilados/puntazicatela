<template>
  <footer id="contacto" class="bg-dark text-white pt-5 pb-2">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <p class="h4 fw-semibold mb-3">{{ content.footer.brand || 'DESHILADOS PXM' }}</p>
          <p class="small text-white-50">{{ content.footer.description }}</p>
          <div v-if="hasSocial" class="mt-3">
            <a v-if="content.footer.social.facebook" :href="content.footer.social.facebook"
              class="btn btn-link text-white-50 me-2" target="_blank" rel="noopener">
              <i class="bi bi-facebook"></i> Facebook
            </a>
            <a v-if="content.footer.social.instagram" :href="content.footer.social.instagram"
              class="btn btn-link text-white-50 me-2" target="_blank" rel="noopener">
              <i class="bi bi-instagram"></i> Instagram
            </a>
            <a
              v-if="hasWhatsApp"
              href="#"
              class="btn btn-link text-white-50 me-2"
              rel="noopener noreferrer"
              @click.prevent="openWhatsApp"
            >
              <i class="bi bi-whatsapp"></i> WhatsApp
            </a>
          </div>
        </div>

        <div class="col-lg-2 col-md-4">
          <h5 class="h6 fw-semibold mb-4">Navegación</h5>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/#inicio" class="text-decoration-none small text-white-50">Inicio</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/#coleccion" class="text-decoration-none small text-white-50">Colección</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/#nosotros" class="text-decoration-none small text-white-50">Nosotros</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/ordenar" class="text-decoration-none small text-white-50">Ordenar</router-link>
            </li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-4">
          <h5 class="h6 fw-semibold mb-4">{{ content.footer.contact.title || 'Contacto' }}</h5>
          <ul class="list-unstyled">
            <li v-if="content.footer.contact.address.street" class="mb-2 small text-white-50">
              <i class="bi bi-geo-alt me-2"></i>{{ content.footer.contact.address.street }}
            </li>
            <li v-if="content.footer.contact.address.city" class="mb-2 small text-white-50">
              {{ content.footer.contact.address.city }}
            </li>
            <li v-if="content.footer.contact.phone" class="mb-2 small text-white-50">
              <i class="bi bi-telephone me-2"></i>{{ content.footer.contact.phone }}
            </li>
            <li v-if="content.footer.contact.email" class="mb-2 small text-white-50">
              <i class="bi bi-envelope me-2"></i>{{ content.footer.contact.email }}
            </li>
          </ul>
        </div>

        <div v-if="hasSchedule" class="col-lg-3 col-md-4">
          <h5 class="h6 fw-semibold mb-4">{{ content.footer.schedule.title || 'Horario' }}</h5>
          <ul class="list-unstyled">
            <li class="mb-2 small text-white-50">{{ content.footer.schedule.weekdays.days }}</li>
            <li class="mb-2 small text-white-50">{{ content.footer.schedule.weekdays.hours }}</li>
            <li v-if="content.footer.schedule.extra.days" class="mb-2 small text-white-50">
              {{ content.footer.schedule.extra.days }}
            </li>
            <li v-if="content.footer.schedule.extra.hours" class="mb-2 small text-white-50">
              {{ content.footer.schedule.extra.hours }}
            </li>
          </ul>
        </div>
      </div>

      <div class="border-top border-white border-opacity-10 pt-4 mt-5 text-center">
        <p class="mb-0 small text-white-50">
          &copy; {{ new Date().getFullYear() }} {{ content.footer.copyright.text || 'Deshilados PXM.' }}
        </p>
        <p class="mt-1 small text-white-50">{{ content.footer.copyright.made_with }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  useSiteContentStore,
  buildWhatsAppChatUrl,
  buildWhatsAppFooterMessage,
  normalizeWhatsAppNumber,
} from '@/stores/siteContentStore';

const siteContent = useSiteContentStore();

const content = computed(() => siteContent.getNestedStructured());

const whatsappDigits = computed(() => normalizeWhatsAppNumber(content.value.footer.social.whatsapp));

const hasWhatsApp = computed(() => whatsappDigits.value.length > 0);

function openWhatsApp() {
  const msg = buildWhatsAppFooterMessage(content.value.meta.site.name);
  const url = buildWhatsAppChatUrl(whatsappDigits.value, msg);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

const hasSocial = computed(() => {
  const s = content.value.footer.social;
  return !!(s.facebook || s.instagram || hasWhatsApp.value);
});

const hasSchedule = computed(() => {
  const sch = content.value.footer.schedule;
  return !!(sch.weekdays.days || sch.weekdays.hours || sch.extra.days || sch.extra.hours);
});
</script>
