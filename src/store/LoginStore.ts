import { defineStore } from 'pinia';
import User from '~/interfaces/User.interface';

export const useLoginStore = defineStore('login', {
  state: () => ({
    currentUser: null as User | null,
    users: [] as User[],
    isAuthenticated: false,
    authError: null as string | null,
  }),

  actions: {
    // Registrar un nuevo usuario
    registerUser(user: User) {
      // Comprobar si el usuario ya existe
      const existingUser = this.users.find(u => u.email === user.email);
      if (existingUser) {
        return { success: false, message: 'El email ya está registrado' };
      }
      
      // Añadir usuario a la lista
      this.users.push(user);
      return { success: true, message: 'Usuario registrado correctamente' };
    },
    
    // Iniciar sesión
    login(email: string, password: string) {
      // Resetear error previo
      this.authError = null;
      
      // Buscar usuario
      const user = this.users.find(u => 
        u.email === email && u.password === password
      );
      
      if (user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        return true;
      } else {
        this.authError = 'Credenciales incorrectas';
        return false;
      }
    },
    
    // Cerrar sesión
    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
    },
    
    // Método original (renombrado para claridad)
    setCurrentUser(user: User) {
      this.currentUser = user;
    },
  },
  
  getters: {
    // Obtener usuario actual
    getCurrentUser(): User | null {
      return this.currentUser;
    },
    
    // Verificar si está autenticado
    checkAuthenticated(): boolean {
      return this.isAuthenticated;
    },
    
    getAuthError():string|null{
      return this.authError
    }
  },
});