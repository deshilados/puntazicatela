import { defineStore } from 'pinia';
import md5 from 'md5';
import { supabase } from '@/utils/supabase';

/** Admin login: tabla `users` con `password` en MD5 (hex minúsculas, como en PHP/MySQL). */
export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    user: null as { id: number; nombre: string; email: string; rol: string } | null,
    loading: false,
    error: null as string | null
  }),
  getters: {
    isAdmin: (state) => !!state.user && state.user.rol === 'admin'
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      const emailNorm = email.trim().toLowerCase();
      const passwordHash = md5(password);
      const { data, error } = await supabase
        .from('users')
        .select('id, nombre, email, rol')
        .eq('email', emailNorm)
        .eq('password', passwordHash)
        .single();
      if (error || !data) {
        this.loading = false;
        this.error = 'Credenciales incorrectas.';
        return false;
      }
      if ((data as { rol: string }).rol !== 'admin') {
        this.error = 'Acceso denegado. Solo administradores.';
        this.loading = false;
        return false;
      }
      this.user = data as { id: number; nombre: string; email: string; rol: string };
      try {
        sessionStorage.setItem('adminUser', JSON.stringify(this.user));
      } catch (_) {}
      this.loading = false;
      return true;
    },
    logout() {
      this.user = null;
      this.error = null;
      try {
        sessionStorage.removeItem('adminUser');
      } catch (_) {}
    },
    initFromStorage() {
      try {
        const raw = sessionStorage.getItem('adminUser');
        if (raw) this.user = JSON.parse(raw);
      } catch (_) {}
    }
  }
});
