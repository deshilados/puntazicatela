<template>
  <Navbar />
  <div class="d-flex align-items-center justify-content-center p-5">
    <div class="card shadow-sm w-100" style="max-width: 400px">
      <div class="card-body p-4">
        <h1 class="h4 fw-bold mb-1 text-center">Administración</h1>
        <p class="text-muted small mb-4 text-center">Acceso solo para administradores</p>
        <div v-if="adminAuth.error" class="alert alert-danger">{{ adminAuth.error }}</div>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input v-model="email" type="email" class="form-control" id="email" required autocomplete="email" placeholder="admin@deshiladospxm.com" />
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">Contraseña</label>
            <input v-model="password" type="password" class="form-control" id="password" required autocomplete="current-password" placeholder="••••••••" />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="adminAuth.loading">Entrar</button>
          <router-link to="/" class="btn btn-link w-100 d-block text-center mt-2">Volver a la página principal</router-link>
        </form>
      </div>
    </div>
  </div>
  <ContactoFooter />
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

const router = useRouter();
const adminAuth = useAdminAuthStore();
const email = ref('');
const password = ref('');

async function submit() {
  adminAuth.error = null;
  Swal.fire({
    title: 'Verificando credenciales...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const ok = await adminAuth.login(email.value, password.value);
  Swal.close();
  if (ok) {
    await Swal.fire({
      icon: 'success',
      title: 'Acceso concedido',
      text: 'Bienvenido al panel.',
      timer: 1400,
      showConfirmButton: false,
    });
    router.push('/');
  } else {
    await Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: adminAuth.error || 'No se pudo iniciar sesión.',
    });
  }
}
</script>

