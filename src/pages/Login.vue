<template>
  <Navbar />
  <section class="py-5">
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
                ¿No tienes cuenta?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ContactoFooter />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import ContactoFooter from '@/components/sections/ContactoFooter.vue';
import { supabase } from '@/utils/supabase';
import Swal from 'sweetalert2';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

async function submit() {
  error.value = '';
  Swal.fire({
    title: 'Iniciando sesión...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const { data, error: err } = await supabase.from('users').select('id, nombre, email, rol').eq('email', email.value.trim().toLowerCase()).single();
  if (err || !data) {
    Swal.close();
    error.value = 'Email o contraseña incorrectos.';
    await Swal.fire({
      icon: 'error',
      title: 'No se pudo iniciar sesión',
      text: error.value,
    });
    return;
  }
  // En producción validar password con Edge Function o Supabase Auth
  sessionStorage.setItem('user', JSON.stringify(data));
  Swal.close();
  await Swal.fire({
    icon: 'success',
    title: 'Bienvenido',
    text: 'Sesión iniciada correctamente.',
    timer: 1400,
    showConfirmButton: false,
  });
  router.push({ path: '/' });
}
</script>

