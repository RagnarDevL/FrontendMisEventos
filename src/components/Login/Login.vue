<template>
  <div class="wrapper-login">
    <!-- Logo -->

    <!-- End Message Closed Session -->

    <div class="login" style="margin-top: -100px;">

      <!-- ALERT MESSAGE HERE -->
      <div class="alert-message2" v-if="msgLogin">
          <p style="text-align: center; color: red;"><b>{{ msgLogin }}</b></p>
      </div>
      <!-- ALERT MESSAGE HERE -->
      <div class="alert-message d-none">
          <div class="d-flex align-items-center">
              <p><b>Bienvenido a Mis Eventos</b></p>
          </div>
          <p style="text-align: center">
              Hola aquí podrás gestionar tus eventos <b>Agendarlos con toda la información necesaria</b> como Agregar Asistente, Ver Asistentes <b>Estado del evento</b> Agregar ponentes, Ver ponentes y gestionar el evento(Inicarlo o Finalizarlo)
          </p>
      </div>
      <!-- END ALERT MESSAGE -->

      <!-- Email -->
      <div class="mb-2">
        <label><b>Email</b></label>
        <div class="input-with-icon">
          <input type="email" v-model="email" required>
        </div>
        <p v-if="alertEmail" style="color: red;">{{ alertEmail }}</p>
      </div>

      <!-- Password -->
      <div class="mb-2">
        <label><b>Contraseña</b></label>
        <div class="input-with-icon">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" required>
        </div>
        <p v-if="alertPassword" style="color: red;">{{ alertPassword }}</p>
      </div>

      <!-- Button Login -->
      <div class="d-flex justify-content-center my-4">
        <button class="btn-login" @click="login" :disabled="spinner">
          Ingresar
        </button>
      </div>

     

      <!-- Mensajes de sesión -->

      <!-- BEGIN COPYRIGHT -->
      <div class="copyright">
        {{ new Date().getFullYear() }} © Coomotoritas
      </div>
      <!-- END COPYRIGHT -->
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginComponent', // Cambiado a un nombre de componente de múltiples palabras
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      spinner: false,
      alertEmail: '',
      alertPassword: '',
      msgLogin: ''
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async login() {
      this.spinner = true;
      this.msgLogin = '';
      this.alertEmail = '';
      this.alertPassword = '';
      
      // Validar campos
      if (!this.email) {
        this.alertEmail = 'El email es requerido.';
        this.spinner = false;
        return;
      }
      if (!this.password) {
        this.alertPassword = 'La contraseña es requerida.';
        this.spinner = false;
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/login', {
          username: this.email,
          password: this.password
        });

        // Manejar la respuesta del backend
        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          localStorage.setItem('rol', response.data.rol);
          localStorage.setItem('Nombre', response.data.Nombre);
          localStorage.setItem('Email', response.data.Email);
          this.router.push('/home'); 
        } else {
          this.msgLogin = response.data.detail || 'Error en el inicio de sesión.';
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        this.msgLogin = error.response?.data?.detail || 'Error en la conexión con el servidor.';
      } finally {
        this.spinner = false;
      }
    },
    async createUser () {
      // Lógica para crear un nuevo usuario
      // Puedes implementar la lógica aquí
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./Login.scss";
</style>