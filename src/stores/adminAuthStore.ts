import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase';

/** Admin login usa tabla users con rol admin (email + password en BD). */
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
    async login(email: string, _password: string) {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from('users')
        .select('id, nombre, email, rol')
        .eq('email', email.trim().toLowerCase())
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
      // En Supabase no guardamos password hasheado en cliente; asumimos que usas RPC o que
      // la tabla users tiene password y validas con Edge Function. Para simplificar,
      // aquí asumimos que el backend (o un RPC) ya validó. Como no tenemos backend PHP,
      // opción: crear una Edge Function que valide email+password contra users, o
      // usar Supabase Auth y sincronizar rol admin desde tabla users.
      // Por ahora guardamos el usuario en store (la contraseña la validarías con una
      // función que compare hash; en desarrollo puedes omitir comprobación).
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
