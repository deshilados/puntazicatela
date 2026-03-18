<template>
  <section class="py-5" style="margin-top: 6rem">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h4 fw-bold mb-3 text-center">Iniciar sesión</h1>
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <input v-model="email" type="email" class="form-control" id="email" required autocomplete="email" />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input v-model="password" type="password" class="form-control" id="password" required autocomplete="current-password" />
                </div>
                <button type="submit" class="btn btn-dark w-100">Entrar</button>
              </form>
              <p class="mt-3 mb-0 text-center small text-muted">
                ¿No tienes cuenta? <router-link to="/register">Regístrate</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/utils/supabase';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

async function submit() {
  error.value = '';
  const { data, error: err } = await supabase.from('users').select('id, nombre, email, rol').eq('email', email.value.trim().toLowerCase()).single();
  if (err || !data) {
    error.value = 'Email o contraseña incorrectos.';
    return;
  }
  // En producción validar password con Edge Function o Supabase Auth
  sessionStorage.setItem('user', JSON.stringify(data));
  router.push({ path: '/', query: { welcome: '1' } });
}
</script>
