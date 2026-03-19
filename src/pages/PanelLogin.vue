<template>
  <Navbar />
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-3" style="margin-top: 4rem">
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
          <button type="submit" class="btn btn-dark w-100" :disabled="adminAuth.loading">Entrar</button>
          <router-link to="/" class="btn btn-link w-100 d-block text-center mt-2">Volver a la página principal</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

const router = useRouter();
const adminAuth = useAdminAuthStore();
const email = ref('');
const password = ref('');

async function submit() {
  adminAuth.error = null;
  const ok = await adminAuth.login(email.value, password.value);
  if (ok) router.push('/panel');
}
</script>

